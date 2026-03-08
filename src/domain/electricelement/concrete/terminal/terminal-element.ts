import { ElementMessage } from "../../../elementmessage/element-message";
import { Wire } from "../../../wire/wire";
import { ElectricElement } from "../../electric-element";
import { type ElectricElementContext, EMPTY_CONTEXT, TYPE_TO_DEFAULT_LABEL } from "../../types";
import { TerminalType } from "./terminal-type";

export class TerminalElement extends ElectricElement {
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

        public terminalType: TerminalType,
    ) {
        super(id, x, y, parentId, 'TERMINAL', wire, label, messages, children, context);
    }

    static empty(_parentId?: string, existingCount?: number, wire = Wire.empty()) {
        return new TerminalElement(
            '',
            0,
            0,
            undefined,
            wire,
            `${TYPE_TO_DEFAULT_LABEL.TERMINAL}${existingCount ?? ''}`,
            [],
            [],
            EMPTY_CONTEXT(),
            TerminalType.TN_C,
        );
    }

    static createFromDB(data: any) {
        return new TerminalElement(
            data.id,
            data.x,
            data.y,
            undefined,
            Wire.createFromDB(data),
            data.label,
            [],
            [],
            EMPTY_CONTEXT(),
            TerminalType.create(data.terminal_type) ?? data.terminal_type,
        );
    }

    static createFromRaw(data: any) {
        return new TerminalElement(
            data.id,
            data.x,
            data.y,
            undefined,
            Wire.createFromRaw(data.wire),
            data.label,
            data.messages ?? [],
            (data.children ?? []).map((v: ElectricElement) => v.clone()),
            { ...data.context },
            data.terminalType,
        );
    }

    clone(): ElectricElement {
        return new TerminalElement(
            this.id,
            this.x,
            this.y,
            this.parentId,
            Wire.createFromRaw(this.wire),
            this.label,
            this.messages,
            this.children.map(v => v.clone()),
            { ...this.context },
            this.terminalType,
        );
    }

    // imageSource() {
    //     return require('./../../../../assets/images/supply.png');
    // }

    protected recalculateContextByType(): void {
        this.context.terminalType = this.terminalType;
    }
}