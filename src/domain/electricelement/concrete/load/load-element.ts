import { ElectricElement } from "../../electric-element";
import { Wire } from "../../../wire/wire";
import type { LoadConfig } from "./load-config";
import { ElementMessage, MessageKey } from "../../../elementmessage/element-message";
import { type ElectricElementContext, EMPTY_CONTEXT, type LoadElementSubType, TYPE_TO_DEFAULT_LABEL } from "../../types";
import { TerminalType } from "../terminal/terminal-type";
import type { CreateLoadElementDto } from "../../../../api/api";

const THREE_SQUARE_ROOT = 1.732

export type CreatePredefinedLoadElement = {
    predefinedValue: LoadElementSubType;
    parentId?: string;
    existingCount?: number;
}

export const PREDEFINED_LOAD_MAP: Record<LoadElementSubType, number> = {
    'LOAD_LIGHT': 100,
    'LOAD_OVEN': 2500,
    'LOAD_SOCKET': 1500,
    'LOAD_WASHING_MACHINE': 2000,
};

export class LoadElement extends ElectricElement {
    constructor(
        public id: string,
        public x: number,
        public y: number,
        public parentId: string | undefined,

        public wire: Wire,

        public label: string,
        public messages: ElementMessage[],
        public children: ElectricElement[],
        public context: ElectricElementContext,

        public drawPower: number,
        public powerFactor: number,
        public highStartCurrent: boolean,
        public config: LoadConfig,
        public zeroed: boolean,
    ) {
        super(id, x, y, parentId, 'LOAD', wire, label, messages, children, context);
    }

    static empty(parentId?: string, existingCount?: number) {
        return new LoadElement(
            '',
            0,
            0,
            parentId,
            Wire.empty(),
            `${TYPE_TO_DEFAULT_LABEL.LOAD}${existingCount ?? ''}`,
            [],
            [],
            EMPTY_CONTEXT(),
            2500,
            1,
            false,
            'STAR',
            false
        );
    }

    static predefined({
        predefinedValue,
        parentId,
        existingCount,
    }: CreatePredefinedLoadElement) {
        const empty = this.empty(parentId, existingCount);
        empty.drawPower = PREDEFINED_LOAD_MAP[predefinedValue];

        return empty;
    }

    static createFromDB(data: any) {
        return new LoadElement(
            data.id,
            data.x,
            data.y,
            data.parentId,
            Wire.createFromDB(data),
            data.label,
            [],
            [],
            EMPTY_CONTEXT(),
            data.draw_power,
            data.power_factor,
            data.high_start_current === 1, //SQLite stores booleans as integers
            data.config,
            data.zeroed === 1,
        );
    }

    static createFromRaw(data: any) {
        return new LoadElement(
            data.id,
            data.x,
            data.y,
            data.parentId,
            Wire.createFromRaw(data.wire),
            data.label,
            [...(data.messages ?? [])],
            (data.children ?? []).map((v: ElectricElement) => v.clone()),
            { ...data.context },
            data.drawPower,
            data.powerFactor,
            data.highStartCurrent,
            data.config,
            data.zeroed,
        );
    }

    toCreateDto(projectId: string): CreateLoadElementDto {
        return {
            ...super.toCreateDto(projectId),
            drawPower: this.drawPower,
            powerFactor: this.powerFactor,
            highStartCurrent: this.highStartCurrent,
            config: this.config,
            zeroed: this.zeroed,
        };
    }

    clone(): ElectricElement {
        return new LoadElement(
            this.id,
            this.x,
            this.y,
            this.parentId,
            Wire.createFromRaw(this.wire),
            this.label,
            this.messages,
            this.children.map(v => v.clone()),
            { ...this.context },
            this.drawPower,
            this.powerFactor,
            this.highStartCurrent,
            this.config,
            this.zeroed,
        );
    }

    // imageSource() {
    //     return require('./../../../../assets/images/load.png');
    // }

    /**
     * Return Irms of load
     * 
     * General formula for single phase AC Average Power equals P = Vrms * Irms * pf. From this we get Irms = P/(Vrms*pf).
     * This pf is actually cos(v-i), where v-i is difference in angles between voltage and current signals. When load is purely
     * resistive, that angle diff = 0, and so cos(0) = 1, then P = Vrms * Irms.
     * 
     * There is even more general formula for power, S = P + jQ = Vrms * Irms * pf + jVrms * Irms * sin(v-i). When pf = 1, imaginary
     * part equals 0 and we get to standard P=U*I formula.
     */
    getLineCurrent() {
        return this.drawPower / (230 * this.powerFactor * this.wire.phase.phaseCount);
    }

    /**
     * Current flowing between phases. For star connection it is same as line current.
     * For delta connection, current flowing in line is 1.732 times that between phases.
     */
    getPhaseCurrent() {
        const line = this.getLineCurrent();
        switch (this.config) {
            case 'STAR':
                return line;
            case 'DELTA':
                return line / THREE_SQUARE_ROOT;
        }
        return 0;
    }

    getTotalCurrent(): number {
        return super.getTotalCurrent() + this.getLineCurrent();
    }

    getTotalPower(): number {
        return super.getTotalPower() + this.drawPower;
    }

    protected powerForCurrent(current: number): number {
        return super.powerForCurrent(current) * this.powerFactor;
    }

    check(withChildren?: boolean): LoadElement {
        super.check(withChildren);
        this.zeroedRule();
        this.startCurrentRule();

        return this;
    }

    private zeroedRule() {
        const terminalType = this.context.terminalType;
        if (TerminalType.TN_C.equals(terminalType)) {
            this.handleMessage(this.zeroed, MessageKey.NO_ZEROING_TNC, {});
            this.removeMessage(MessageKey.NO_ZEROING_OTHER);
        } else {
            this.handleMessage(!this.zeroed, MessageKey.NO_ZEROING_OTHER, { type: terminalType.label });
            this.removeMessage(MessageKey.NO_ZEROING_TNC);
        }
    }

    private startCurrentRule() {
        const closestOp = this.context.closestOp;
        if (this.highStartCurrent && closestOp) {
            //during start current will reach max 8 times nominal one, so we assume worst case scenario
            const nominalCurrent = this.getLineCurrent();
            const maxStartCurrent = nominalCurrent * 8;
            const opFireCurrent = closestOp.getFireCurrentByClass();

            const valid = opFireCurrent > maxStartCurrent;

            if (valid) {
                this.removeMessage(MessageKey.START_CURRENT_ISSUE);
            } else {
                const maxPower = this.powerForCurrent(opFireCurrent / 8) - 1;

                this.putMessage(MessageKey.START_CURRENT_ISSUE, {
                    opFireCurrent: opFireCurrent.toFixed(2),
                    maxStartCurrent: maxStartCurrent.toFixed(2),
                    maxPower: maxPower.toFixed(2),
                });
            }
        }
    }
}