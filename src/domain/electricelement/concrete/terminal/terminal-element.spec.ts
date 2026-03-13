import { LoadElement } from "../load/load-element";
import uuid from 'react-native-uuid';
import { TerminalElement } from "./terminal-element";
import { TerminalType } from "./terminal-type";
import { MessageKey } from "../../../elementmessage/element-message";
import {it, expect} from 'vitest';

describe('ZeroedRule', () => {
    it('should work fine on TN-C', () => {
        const terminal = TerminalElement.empty();
        terminal.id = uuid.v4();
        terminal.wire.length = 0;
        terminal.terminalType = TerminalType.TN_C;

        const load = LoadElement.empty();
        load.id = uuid.v4();
        load.drawPower = 3680;

        terminal.addChild(load);
        terminal.check(true);

        expect(terminal.messages.length).toEqual(0);
        expect(load.messages.length).toEqual(1);
        expect(load.messages[0].id).toEqual(MessageKey.NO_ZEROING_TNC.id);

        load.zeroed = true;
        terminal.check(true);

        expect(terminal.messages.length).toEqual(0);
        expect(load.messages.length).toEqual(0);
    });

    it('should work fine on other than TN-C', () => {
        const terminal = TerminalElement.empty();
        terminal.id = uuid.v4();
        terminal.terminalType = TerminalType.TT;

        const load = LoadElement.empty();
        load.id = uuid.v4();
        load.drawPower = 3680;

        terminal.addChild(load);
        terminal.check(true);

        expect(terminal.messages.length).toEqual(0);
        expect(load.messages.length).toEqual(0);

        load.zeroed = true;
        terminal.check(true);

        expect(terminal.messages.length).toEqual(0);
        expect(load.messages.length).toEqual(1);
        expect(load.messages[0].id).toEqual(MessageKey.NO_ZEROING_OTHER.id);
        expect(load.messages[0].params).toEqual({ type: terminal.terminalType.label });
    });
});