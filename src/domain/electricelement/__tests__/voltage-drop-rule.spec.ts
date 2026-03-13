import { ElectricElement } from "../electric-element";
import uuid from 'react-native-uuid';
import { LoadElement } from "../concrete/load/load-element";
import { OvercurrentProtectionElement } from "../concrete/overcurrent-protection/overcurrent-protection-element";
import { PhaseType } from "../../currenttable/enums/PhaseType";
import { WireDiameter } from "../../currenttable/enums/WireDiameter";
import { MessageKey } from "../../elementmessage/element-message";
import { Wire } from "../../wire/wire";
import {it, expect} from 'vitest'

describe('VoltageDropRule', () => {
    it('should work as expected for simple example', () => {
        const root = ElectricElement.empty();
        root.wire.diameter = WireDiameter.D_40;
        root.id = uuid.v4();

        const load = LoadElement.empty();
        load.wire = new Wire(WireDiameter.D_25, 'IN_PIPE_ON_WALL', 'ONE_WIRE', PhaseType.ONE, 30);
        load.drawPower = 2500;
        load.zeroed = true;

        root.addChild(load);

        root.check(true);

        expect(root.messages.filter(v => v.key.isError()).length).toEqual(0);
        expect(root.getTotalPower()).toEqual(2500);
        expect(root.context.ownLength + root.context.parentLength).toEqual(5);
        expect(root.context.parentVoltageDrop).toEqual(0);
        expect(root.context.ownVoltageDrop).toEqual(root.voltageDrop());

        expect(load.messages.filter(v => v.key.isError()).length).toEqual(0);
        expect(load.getTotalPower()).toEqual(2500);
        expect(load.context.ownLength + load.context.parentLength).toEqual(load.wire.length + root.wire.length);
        expect(load.context.parentVoltageDrop).toEqual(root.voltageDrop());
        expect(load.context.ownVoltageDrop.toFixed(4)).toEqual('2.0254');
    });

    it(`should add voltage drop keys when necessary`, () => {
        const root = ElectricElement.empty();
        root.wire.diameter = WireDiameter.D_40;
        root.wire.length = 0;
        root.id = uuid.v4();

        const op2_lv1 = OvercurrentProtectionElement.predefined({});
        op2_lv1.id = uuid.v4();
        op2_lv1.wire = new Wire(WireDiameter.D_15, 'IN_PIPE_ON_WALL', 'ONE_WIRE', PhaseType.ONE, 5);
        op2_lv1.amperage = 10;

        const op1_lv2 = OvercurrentProtectionElement.predefined({});
        op1_lv2.id = uuid.v4();
        op1_lv2.wire = new Wire(WireDiameter.D_15, 'IN_PIPE_ON_WALL', 'ONE_WIRE', PhaseType.ONE, 5);
        op1_lv2.amperage = 16;

        const load1 = LoadElement.empty();
        load1.id = uuid.v4();
        load1.wire = new Wire(WireDiameter.D_25, 'IN_PIPE_ON_WALL', 'ONE_WIRE', PhaseType.ONE, 25);
        load1.drawPower = 1500;

        const load2 = LoadElement.empty();
        load2.id = uuid.v4();
        load2.wire = new Wire(WireDiameter.D_15, 'IN_PIPE_ON_WALL', 'ONE_WIRE', PhaseType.THREE, 5);
        load2.drawPower = 7500;
        load2.powerFactor = .8;

        const load3_lv2 = LoadElement.empty();
        load3_lv2.id = uuid.v4();
        load3_lv2.wire = new Wire(WireDiameter.D_15, 'IN_PIPE_ON_WALL', 'ONE_WIRE', PhaseType.ONE, 5);
        load3_lv2.drawPower = 1002;

        root.addChild(op2_lv1);
        op2_lv1.addChild(op1_lv2);
        op2_lv1.addChild(load3_lv2);
        op1_lv2.addChild(load1);
        op1_lv2.addChild(load2);

        root.check(true);

        const voltageDropKeys = [MessageKey.TOO_BIG_VOLTAGE_DROP_THIS, MessageKey.TOO_BIG_VOLTAGE_DROP_PREV].map(v => v.id);

        expect(root.messages.length).toEqual(0);
        expect(root.getTotalPower()).toEqual(10002);
        expect(root.context.ownLength + root.context.parentLength).toEqual(0);
        expect(root.context.parentVoltageDrop).toEqual(0);
        expect(root.context.ownVoltageDrop).toEqual(0);

        expect(op2_lv1.messages.some(v => voltageDropKeys.includes(v.id))).toBeFalsy();
        expect(op2_lv1.getTotalPower()).toEqual(10002);
        expect(op2_lv1.context.ownLength + op2_lv1.context.parentLength).toEqual(5);
        expect(op2_lv1.context.parentVoltageDrop).toEqual(0);
        expect(op2_lv1.context.ownVoltageDrop.toFixed(4)).toEqual('2.2509');

        expect(load3_lv2.messages.length).toEqual(1);
        expect(load3_lv2.messages[0].id).toEqual(MessageKey.NO_ZEROING_TNC.id);
        expect(load3_lv2.getTotalPower()).toEqual(1002);
        expect(load3_lv2.context.ownLength + load3_lv2.context.parentLength).toEqual(10);
        expect(load3_lv2.context.parentVoltageDrop.toFixed(4)).toEqual('2.2509');
        expect(load3_lv2.context.ownVoltageDrop.toFixed(4)).toEqual('0.2255');
        //0.2255

        expect(op1_lv2.messages.length).not.toEqual(0);
        expect(op1_lv2.messages[1].id).toEqual(MessageKey.TOO_BIG_VOLTAGE_DROP_THIS.id);
        expect(op1_lv2.messages[1].params).toEqual({ ownVoltageDrop: '2.03', matchingDiameter: '6mm\u00B2', maxLength: '1.85' });
        expect(op1_lv2.getTotalPower()).toEqual(9000);
        expect(op1_lv2.context.ownLength + op1_lv2.context.parentLength).toEqual(10);
        expect(op1_lv2.context.parentVoltageDrop.toFixed(4)).toEqual('2.2509');
        expect(op1_lv2.context.ownVoltageDrop.toFixed(4)).toEqual('2.0254');
        //2.0254

        expect(load1.messages.length).not.toEqual(0);
        expect(load1.messages[1].id).toEqual(MessageKey.TOO_BIG_VOLTAGE_DROP_PREV.id);
        expect(load1.messages[1].params).toEqual({ parentVoltageDrop: '4.28' });
        expect(load1.getTotalPower()).toEqual(1500);
        expect(load1.context.ownLength + load1.context.parentLength).toEqual(35);
        expect(load1.context.parentVoltageDrop.toFixed(4)).toEqual('4.2763');
        expect(load1.context.ownVoltageDrop.toFixed(4)).toEqual('1.0127');
        //1.0127

        expect(load2.messages.length).toEqual(2);
        expect(load2.messages[0].id).toEqual(MessageKey.TOO_BIG_VOLTAGE_DROP_PREV.id);
        expect(load2.messages[0].params).toEqual({ parentVoltageDrop: '4.28' });
        expect(load2.messages[1].id).toEqual(MessageKey.NO_ZEROING_TNC.id);
        expect(load2.getTotalPower()).toEqual(7500);
        expect(load2.context.ownLength + load2.context.parentLength).toEqual(15);
        expect(load2.context.parentVoltageDrop.toFixed(4)).toEqual('4.2763');
        expect(load2.context.ownVoltageDrop.toFixed(4)).toEqual('0.2790');
        //0.2790
    });
});
