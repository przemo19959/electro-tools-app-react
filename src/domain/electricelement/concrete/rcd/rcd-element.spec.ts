import { WireDiameter } from "../../../currenttable/enums/WireDiameter";
import { MessageKey } from "../../../elementmessage/element-message";
import { LoadElement } from "../load/load-element";
import { TerminalElement } from "../terminal/terminal-element";
import { TerminalType } from "../terminal/terminal-type";
import { RcdElement } from "./rcd-element";
import uuid from 'react-native-uuid';

describe('rcd element tests', () => {
    it('case 1 - when nominal current is lower than wire capacity', () => {
        const terminal = TerminalElement.empty();
        terminal.terminalType = TerminalType.TN_C_S;

        const rcd = RcdElement.empty();
        rcd.nominalCurrent = 10;
        terminal.addChild(rcd);

        const load1 = LoadElement.empty();
        rcd.addChild(load1);

        terminal.check(true);

        expect(terminal.messages.length).toEqual(0);
        expect(rcd.messages.length).toEqual(1);
        expect(rcd.messages[0].id).toEqual(MessageKey.RCD_TOTAL_CURRENT.id);
        expect(rcd.messages[0].params).toEqual({ minNominationCurrent: '20' });
        expect(load1.messages.length).toEqual(0);

        rcd.nominalCurrent = 20;
        terminal.check(true);

        expect(terminal.messages.length).toEqual(0);
        expect(rcd.messages.length).toEqual(0);
        expect(load1.messages.length).toEqual(0);
    });

    it('case 2 - one rcd with many standard loads', () => {
        const terminal = TerminalElement.empty();
        terminal.terminalType = TerminalType.TN_C_S;
        terminal.wire.diameter = WireDiameter.D_100;

        const rcd = RcdElement.empty();
        rcd.nominalCurrent = 20;
        rcd.wire.diameter = WireDiameter.D_100;
        terminal.addChild(rcd);

        const load1 = LoadElement.empty();
        load1.id = uuid.v4();
        load1.drawPower = 3.7e3;
        rcd.addChild(load1);

        const load2 = LoadElement.empty();
        load2.id = uuid.v4();
        load2.drawPower = 3.7e3;
        rcd.addChild(load2);

        const load3 = LoadElement.empty();
        load3.id = uuid.v4();
        load3.drawPower = 3.7e3;
        rcd.addChild(load3);

        terminal.check(true);

        expect(terminal.messages.length).toEqual(0);
        expect(rcd.messages.length).toEqual(1);
        expect(rcd.messages[0].id).toEqual(MessageKey.RCD_TOTAL_CURRENT.id);
        expect(rcd.messages[0].params).toEqual({ minNominationCurrent: '63' });

        expect(load1.messages.length).toEqual(0);
        expect(load2.messages.length).toEqual(0);
        expect(load3.messages.length).toEqual(0);

        rcd.nominalCurrent = 63;
        terminal.check(true);

        expect(terminal.messages.length).toEqual(0);
        expect(rcd.messages.length).toEqual(0);
        expect(load1.messages.length).toEqual(0);
        expect(load2.messages.length).toEqual(0);
        expect(load3.messages.length).toEqual(0);
    });

    it('case 3 - one rcd with many loads, so that there is no higher nominal', () => {
        const terminal = TerminalElement.empty();
        terminal.terminalType = TerminalType.TN_C_S;
        terminal.wire.diameter = WireDiameter.D_500;

        const rcd = RcdElement.empty();
        rcd.nominalCurrent = 20;
        rcd.wire.diameter = WireDiameter.D_500;
        terminal.addChild(rcd);

        const load1 = LoadElement.empty();
        load1.id = uuid.v4();
        load1.wire.diameter = WireDiameter.D_160;
        load1.drawPower = 15e3;
        rcd.addChild(load1);

        const load2 = LoadElement.empty();
        load2.id = uuid.v4();
        load2.wire.diameter = WireDiameter.D_160;
        load2.drawPower = 15e3;
        rcd.addChild(load2);

        terminal.check(true);

        expect(terminal.messages.length).toEqual(0);
        expect(rcd.messages.length).toEqual(1);
        expect(rcd.messages[0].id).toEqual(MessageKey.NO_MATCHING_RCD.id);

        expect(load1.messages.length).toEqual(0);
        expect(load2.messages.length).toEqual(0);
    });

    it('case 4 - when rcd used in TNC like network add error', () => {
        const terminal = TerminalElement.empty();
        terminal.terminalType = TerminalType.TN_C;

        const rcd = RcdElement.empty();
        rcd.nominalCurrent = 20;
        terminal.addChild(rcd);

        terminal.check(true);
        
        expect(terminal.messages.length).toEqual(0);
        expect(rcd.messages.length).toEqual(1);
        expect(rcd.messages[0].id).toEqual(MessageKey.RCD_TNC.id);
        
        terminal.terminalType = TerminalType.TN_C_S;
        terminal.check(true);

        expect(terminal.messages.length).toEqual(0);
        expect(rcd.messages.length).toEqual(0);
    })
});