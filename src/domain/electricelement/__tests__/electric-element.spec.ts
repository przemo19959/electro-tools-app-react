import { ElectricElement } from "../electric-element";
import uuid from 'react-native-uuid';
import { OvercurrentProtectionElement } from "../concrete/overcurrent-protection/overcurrent-protection-element";
import { LoadElement } from "../concrete/load/load-element";
import { TerminalElement } from "../concrete/terminal/terminal-element";
import { TerminalType } from "../concrete/terminal/terminal-type";
import { RcdElement } from "../concrete/rcd/rcd-element";
import { WireDiameter } from "../../currenttable/enums/WireDiameter";
import { MessageKey } from "../../elementmessage/element-message";
import { PhaseType } from "../../currenttable/enums/PhaseType";
import { Wire } from "../../wire/wire";
import cloneDeep from "lodash.clonedeep";
import merge from "lodash.merge";
import {it, expect} from 'vitest'

describe('Electric element tests', () => {
    it('should collect values corretly through collector', () => {
        const terminal = ElectricElement.empty();
        terminal.id = uuid.v4();
        terminal.label = 'terminal';
        terminal.parentId = undefined;

        const op1 = OvercurrentProtectionElement.predefined({});
        op1.id = uuid.v4();
        const op2 = OvercurrentProtectionElement.predefined({});
        op2.id = uuid.v4();
        const op3 = OvercurrentProtectionElement.predefined({});
        op3.id = uuid.v4();

        const load = LoadElement.empty(op3.id);
        load.id = uuid.v4();
        load.drawPower = 1000;

        terminal.addChild(op1);
        terminal.addChild(op2);

        op2.addChild(op3);
        op3.addChild(load);

        terminal.check(true);

        expect(terminal.context.ownVoltageDrop).toEqual(terminal.voltageDrop());
        expect(terminal.context.parentVoltageDrop).toEqual(0);
        expect(terminal.context.closestOp).toEqual(undefined);
        expect(terminal.context.ownShortImpedance).toEqual(terminal.wire.shortImpedance());
        expect(terminal.context.parentShortImpedance).toEqual(0);
        expect(terminal.context.ownLength).toEqual(terminal.wire.length);
        expect(terminal.context.parentLength).toEqual(0);

        expect(op1.context.ownVoltageDrop).toEqual(op1.voltageDrop());
        expect(op1.context.parentVoltageDrop).toEqual(terminal.voltageDrop());
        expect(op1.context.closestOp?.id).toEqual(op1.id);
        expect(op1.context.ownShortImpedance).toEqual(op1.wire.shortImpedance());
        expect(op1.context.parentShortImpedance).toEqual(terminal.wire.shortImpedance());
        expect(op1.context.ownLength).toEqual(op1.wire.length);
        expect(op1.context.parentLength).toEqual(terminal.wire.length);

        expect(op2.context.ownVoltageDrop).toEqual(op2.voltageDrop());
        expect(op2.context.parentVoltageDrop).toEqual(terminal.voltageDrop());
        expect(op2.context.closestOp?.id).toEqual(op2.id);
        expect(op2.context.ownShortImpedance).toEqual(op2.wire.shortImpedance());
        expect(op2.context.parentShortImpedance).toEqual(terminal.wire.shortImpedance());
        expect(op2.context.ownLength).toEqual(op2.wire.length);
        expect(op2.context.parentLength).toEqual(terminal.wire.length);

        expect(op3.context.ownVoltageDrop).toEqual(op3.voltageDrop());
        expect(op3.context.parentVoltageDrop).toEqual(op2.voltageDrop() + terminal.voltageDrop());
        expect(op3.context.closestOp?.id).toEqual(op3.id);
        expect(op3.context.ownShortImpedance).toEqual(op3.wire.shortImpedance());
        expect(op3.context.parentShortImpedance).toEqual(op2.wire.shortImpedance() + terminal.wire.shortImpedance());
        expect(op3.context.ownLength).toEqual(op3.wire.length);
        expect(op3.context.parentLength).toEqual(op2.wire.length + terminal.wire.length);

        expect(load.context.ownVoltageDrop).toEqual(load.voltageDrop());
        expect(load.context.parentVoltageDrop).toEqual(op2.voltageDrop() + op3.voltageDrop() + terminal.voltageDrop());
        expect(load.context.closestOp?.id).toEqual(op3.id);
        expect(load.context.ownShortImpedance).toEqual(load.wire.shortImpedance());
        expect(load.context.parentShortImpedance).toEqual(op2.wire.shortImpedance() + op3.wire.shortImpedance() + terminal.wire.shortImpedance());
        expect(load.context.ownLength).toEqual(load.wire.length);
        expect(load.context.parentLength).toEqual(op2.wire.length + op3.wire.length + terminal.wire.length);
    });

    it('case 1 - descending capacity rule works fine - increment upward case', () => {
        //no need for descending capacity rule downward tests. There is already tooBigWireRule which tells the same.
        const terminal = TerminalElement.empty();
        terminal.terminalType = TerminalType.TN_C_S;

        const rcd = RcdElement.empty();
        rcd.nominalCurrent = 20;
        terminal.addChild(rcd);

        const load = LoadElement.empty();
        load.wire.diameter = WireDiameter.D_40;
        rcd.addChild(load);

        terminal.check(true);

        expect(terminal.messages.length).toEqual(0);
        expect(rcd.messages.length).toEqual(1);
        expect(rcd.messages[0].id).toEqual(MessageKey.DESCENDING_CAPACITY.id);
        expect(rcd.messages[0].params).toEqual({ minDiameter: '4' });
        expect(load.messages.filter(v => v.key.isError()).length).toEqual(0);

        rcd.wire.diameter = WireDiameter.D_40;
        terminal.check(true);

        expect(terminal.messages.length).toEqual(1);
        expect(terminal.messages[0].id).toEqual(MessageKey.DESCENDING_CAPACITY.id);
        expect(terminal.messages[0].params).toEqual({ minDiameter: '4' });
        expect(rcd.messages.filter(v => v.key.isError()).length).toEqual(1);
        expect(rcd.messages.filter(v => v.key.isError())[0].id).toEqual(MessageKey.RCD_TOTAL_CURRENT.id);
        expect(rcd.messages.filter(v => v.key.isError())[0].params).toEqual({ minNominationCurrent: '40' });
        expect(load.messages.filter(v => v.key.isError()).length).toEqual(0);

        terminal.wire.diameter = WireDiameter.D_40;
        rcd.nominalCurrent = 40;
        terminal.check(true);

        expect(terminal.messages.filter(v => v.key.isError()).length).toEqual(0);
        expect(rcd.messages.filter(v => v.key.isError()).length).toEqual(0);
        expect(load.messages.filter(v => v.key.isError()).length).toEqual(0);
    });

    it('short current calc works fine, Markiewicz page 52', () => {
        const terminal = TerminalElement.empty();
        terminal.terminalType = TerminalType.TN_C_S;
        terminal.wire.length = terminal.wire.lengthForShortImpedance(.1114);

        const load = LoadElement.empty();
        load.id = uuid.v4();
        load.wire = new Wire(WireDiameter.D_160, 'DIRECT_ON_WALL', 'MULTI_WIRE', PhaseType.ONE, 50);
        terminal.addChild(load);

        terminal.check(true);

        expect((load.context.ownShortImpedance / 2).toFixed(4)).toEqual('0.0698');
        expect(load.context.parentShortImpedance).toEqual(terminal.wire.shortImpedance());
        expect((load.context.parentShortImpedance + load.context.ownShortImpedance).toFixed(3)).toEqual('0.251');
        expect(load.shortCurrent().toFixed(3)).toEqual('870.834');
    });

    it('findByElementId works fine for read and update', () => {
        const terminal = TerminalElement.empty();

        const load = LoadElement.empty();
        load.id = uuid.v4();
        terminal.addChild(load);

        terminal.check(true);

        let loadOpt = terminal.findElementById(load.id);
        expect(loadOpt.isPresent()).toEqual(true);
        expect(loadOpt.get()).toEqual(load);

        const newLoad = cloneDeep(load);
        newLoad.wire.diameter = WireDiameter.D_40;
        // lodash merge must be used, otherwise every field must be rewritten recursively, consumer of form v=>v=newLoad is not working
        terminal.findElementById(load.id).ifPresent(v => merge(v, newLoad));

        loadOpt = terminal.findElementById(load.id);
        expect(loadOpt.isPresent()).toEqual(true);
        expect(loadOpt.get()).toEqual(newLoad);
        expect(loadOpt.get()).toEqual(load);
    });
});