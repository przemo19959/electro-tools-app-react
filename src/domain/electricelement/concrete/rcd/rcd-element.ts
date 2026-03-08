import { CurrentTable } from "../../../currenttable/CurrentTable";
import { ElementMessage, MessageKey } from "../../../elementmessage/element-message";
import { Wire } from "../../../wire/wire";
import { ElectricElement } from "../../electric-element";
import { type ElectricElementContext, EMPTY_CONTEXT, TYPE_TO_DEFAULT_LABEL } from "../../types";
import { TerminalType } from "../terminal/terminal-type";
import { RCD_NOMINAL_VALUES } from "./types";

export class RcdElement extends ElectricElement {
    constructor(
        public id: string,
        public parentId: string | undefined,

        public wire: Wire,

        public label: string,
        public messages: ElementMessage[],
        public children: ElectricElement[],
        public context: ElectricElementContext,

        public nominalCurrent: number,
        public diffCurrent: number,
    ) {
        super(id, parentId, 'RCD', wire, label, messages, children, context);
    }

    static empty(parentId?: string, existingCount?: number) {
        return new RcdElement(
            '',
            parentId,
            Wire.empty(),
            `${TYPE_TO_DEFAULT_LABEL.RCD}${existingCount ?? ''}`,
            [],
            [],
            EMPTY_CONTEXT(),
            25,
            30,
        );
    }

    static createFromDB(data: any) {
        return new RcdElement(
            data.id,
            data.parentId,
            Wire.createFromDB(data),
            data.label,
            [],
            [],
            EMPTY_CONTEXT(),
            data.nominal_current,
            data.diff_current,
        );
    }

    static createFromRaw(data: any) {
        return new RcdElement(
            data.id,
            data.parentId,
            Wire.createFromRaw(data.wire),
            data.label,
            data.messages ?? [],
            (data.children ?? []).map((v: ElectricElement) => v.clone()),
            { ...data.context },
            data.nominalCurrent,
            data.diffCurrent,
        );
    }

    clone(): ElectricElement {
        return new RcdElement(
            this.id,
            this.parentId,
            Wire.createFromRaw(this.wire),
            this.label,
            this.messages,
            this.children.map(v => v.clone()),
            { ...this.context },
            this.nominalCurrent,
            this.diffCurrent,
        );
    }

    // imageSource() {
    //     return require('./../../../../assets/images/rcd.png');
    // }

    check(withChildren?: boolean): void {
        super.check(withChildren);
        this.nominalCurrentRule();
        this.noTNCRule();
    }

    private nominalCurrentRule() {
        if (this.wire) {
            const loadCapacity = CurrentTable.findLoadCapacityByWire(this.wire).orElse(1e3);
            const valid = loadCapacity <= this.nominalCurrent;

            const validRcdValues = RCD_NOMINAL_VALUES.filter(v => v > loadCapacity);
            if (validRcdValues.length > 0) {
                this.handleMessage(valid, MessageKey.RCD_TOTAL_CURRENT, { minNominationCurrent: `${validRcdValues[0]}` });
                this.removeMessage(MessageKey.NO_MATCHING_RCD);
            } else {
                this.handleMessage(valid, MessageKey.NO_MATCHING_RCD, {});
                this.removeMessage(MessageKey.RCD_TOTAL_CURRENT);
            }
        }
    }

    private noTNCRule() {
        const valid = !this.context.terminalType.equals(TerminalType.TN_C);
        this.handleMessage(valid, MessageKey.RCD_TNC, {});
    }
}