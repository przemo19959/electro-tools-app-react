import type { ReactNode } from "react";
import ReportIcon from '@mui/icons-material/Report';
import WarningIcon from '@mui/icons-material/Warning';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import type { Palette } from "@mui/material";

export class ElementMessage {
    private constructor(public id: string,
        public key: MessageKey,
        public params: Record<string, string>) {
    }

    static create(key: MessageKey, content: Record<string, string>) {
        return new ElementMessage(key.id, key, content);
    }

    clone() {
        return new ElementMessage(this.id, this.key, this.params);
    }
}

export const MESSAGE_TYPE_VALUES = ['ERROR', 'WARN', 'INFO'] as const; //order determines priority, do not change
export type MessageTypeVal = typeof MESSAGE_TYPE_VALUES[number];

export class MessageType {
    static ERROR = new MessageType('ERROR', <ReportIcon color="error" />);
    static WARN = new MessageType('WARN', <WarningIcon color="warning" />);
    static INFO = new MessageType('INFO', <LightbulbIcon color="primary" />);

    static of(type: MessageTypeVal) {
        return [this.ERROR, this.WARN, this.INFO].find(v => v.value === type);
    }

    constructor(
        public value: MessageTypeVal,
        public sign: ReactNode,
    ) {
    }

    public fromPalette(palette: Palette): string {
        switch (this.value) {
            case 'ERROR': return palette.error.main;
            case 'WARN': return palette.warning.main;
            case 'INFO': return palette.primary.main;
        }
    }
}

export class MessageKey {
    static TOO_BIG_WIRE_DIAMETER = new MessageKey('TOO_BIG_WIRE_DIAMETER', MessageType.INFO);
    static OVERCURRENT_SPLIT_POSSIBLE = new MessageKey('OVERCURRENT_SPLIT_REQUIRED', MessageType.INFO);
    static NO_MATCHING_OP = new MessageKey('NO_MATCHING_OP', MessageType.INFO);
    static NO_MATCHING_RCD = new MessageKey('NO_MATCHING_RCD', MessageType.INFO);

    static START_CURRENT_ISSUE = new MessageKey('START_CURRENT_ISSUE', MessageType.WARN);
    static WRONG_DIRECTION = new MessageKey('WRONG_DIRECTION', MessageType.WARN);

    static WRONG_WIRE_DIAMETER = new MessageKey('WRONG_WIRE_DIAMETER', MessageType.ERROR);
    static TOO_BIG_VOLTAGE_DROP_PREV = new MessageKey('TOO_BIG_VOLTAGE_DROP_PREV', MessageType.ERROR);
    static TOO_BIG_VOLTAGE_DROP_THIS = new MessageKey('TOO_BIG_VOLTAGE_DROP_THIS', MessageType.ERROR);
    static WRONG_OVERCURRENT_PROTECTION = new MessageKey('WRONG_OVERCURRENT_PROTECTION', MessageType.ERROR);
    static NO_ZEROING_TNC = new MessageKey('NO_ZEROING_TNC', MessageType.ERROR);
    static NO_ZEROING_OTHER = new MessageKey('NO_ZEROING_OTHER', MessageType.ERROR);
    static SELF_TURN_OFF = new MessageKey('SELF_TURN_OFF', MessageType.ERROR);
    static RCD_OP_CHILDREN_ONLY = new MessageKey('RCD_OP_CHILDREN_ONLY', MessageType.ERROR);
    static RCD_TOTAL_CURRENT = new MessageKey('RCD_TOTAL_CURRENT', MessageType.ERROR);
    static DESCENDING_CAPACITY = new MessageKey('DESCENDING_CAPACITY', MessageType.ERROR);
    static RCD_TNC = new MessageKey('RCD_TNC', MessageType.ERROR);

    static values = [
        MessageKey.TOO_BIG_WIRE_DIAMETER,
        MessageKey.OVERCURRENT_SPLIT_POSSIBLE,
        MessageKey.START_CURRENT_ISSUE,
        MessageKey.WRONG_DIRECTION,
        MessageKey.WRONG_WIRE_DIAMETER,
        MessageKey.TOO_BIG_VOLTAGE_DROP_PREV,
        MessageKey.TOO_BIG_VOLTAGE_DROP_THIS,
        MessageKey.WRONG_OVERCURRENT_PROTECTION,
        MessageKey.NO_ZEROING_TNC,
        MessageKey.NO_ZEROING_OTHER,
        MessageKey.SELF_TURN_OFF,
        MessageKey.RCD_OP_CHILDREN_ONLY,
        MessageKey.RCD_TOTAL_CURRENT,
        MessageKey.DESCENDING_CAPACITY,
        MessageKey.NO_MATCHING_OP,
        MessageKey.NO_MATCHING_RCD,
        MessageKey.RCD_TNC,
    ];

    constructor(
        public id: string,
        public type: MessageType,
    ) {
    }

    public translationKey() {
        return `${this.type.value}.${this.id}`;
    }

    isError(): boolean {
        return this.type.value === MessageType.ERROR.value;
    }

    static of(id: string) {
        return this.values.find(v => v.id === id);
    }
}
