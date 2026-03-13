import { OvercurrentProtectionElement } from "../overcurrent-protection/overcurrent-protection-element";
import { OvercurrentProtectionType } from "../overcurrent-protection/overcurrent-protection-type";
import { LoadElement } from "./load-element";
import { PhaseType } from "../../../currenttable/enums/PhaseType";
import { MessageKey } from "../../../elementmessage/element-message";
import uuid from 'react-native-uuid';
import {it, expect} from 'vitest'

describe('LoadElement tests', () => {
    it('line current is calculated corretly for single phase connection', () => {
        const load = LoadElement.empty();
        load.wire.phase = PhaseType.ONE;
        load.drawPower = 750;
        load.powerFactor = .6;

        expect(load.getLineCurrent().toFixed(4)).toEqual('5.4348');
    });

    it('currents are correctly calculated for 3F-star config', () => {
        const load = LoadElement.empty();
        load.wire.phase = PhaseType.THREE;
        load.drawPower = 750;
        load.powerFactor = .6;
        load.config = 'STAR';

        expect(load.getLineCurrent().toFixed(4)).toEqual('1.8116');
        expect(load.getPhaseCurrent().toFixed(4)).toEqual('1.8116');
    });

    it('currents are correctly calculated for 3F-delta config', () => {
        const load = LoadElement.empty();
        load.wire.phase = PhaseType.THREE;
        load.drawPower = 750;
        load.powerFactor = .6;
        load.config = 'DELTA';

        expect(load.getLineCurrent().toFixed(4)).toEqual('1.8116');
        expect(load.getPhaseCurrent().toFixed(4)).toEqual('1.0460');
    });

    it('Example 9.11', () => {
        //in book they set 220V, in app I assume 230V
        const load = LoadElement.empty();
        load.drawPower = 20e3;
        load.powerFactor = .8;

        expect(load.getLineCurrent().toFixed(2)).toEqual('108.70');
    })

    it('Example 11.5, p.558', () => {
        //in book they set 208V, in app I assume 230V
        const load = LoadElement.empty();
        load.wire.phase = PhaseType.THREE;
        load.config = 'DELTA';
        load.drawPower = 1200;
        load.powerFactor = .9396;

        expect(load.getLineCurrent().toFixed(4)).toEqual('1.8509');
        expect(load.getPhaseCurrent().toFixed(4)).toEqual('1.0687');
    });

    it.each([
        [1, 8],
        [.8, 10],
        [.4, 20],
    ])('Example 3 - basic, %powerFactor', (powerFactor: number, expected: number) => {
        const load = LoadElement.empty();
        load.drawPower = 1840;
        load.powerFactor = powerFactor;

        expect(load.getLineCurrent().toFixed(4)).toEqual(expected.toFixed(4));
        expect(load.getPhaseCurrent().toFixed(4)).toEqual(expected.toFixed(4));
    });

    it('Example 2, p.228', () => {
        const load = LoadElement.empty();
        load.drawPower = 20e3;
        load.powerFactor = .8;
        load.config = 'DELTA';
        load.wire.phase = PhaseType.THREE;

        expect(load.getLineCurrent().toFixed(2)).toEqual('36.23');
        expect(load.getPhaseCurrent().toFixed(2)).toEqual('20.92');
    });

    it('start current issue warning works fine', () => {
        const op = OvercurrentProtectionElement.predefined({});
        op.overCurrentProtectionType = OvercurrentProtectionType.B;

        const load = LoadElement.empty();
        load.id = uuid.v4();
        load.zeroed = true;
        load.highStartCurrent = true;
        op.addChild(load);

        op.check(true);

        expect(op.messages.length).toEqual(0);
        expect(load.messages.length).toEqual(1);
        expect(load.messages[0].id).toEqual(MessageKey.START_CURRENT_ISSUE.id);
        expect(load.messages[0].params).toEqual({
            opFireCurrent: '80.00',
            maxStartCurrent: '86.96',
            maxPower: '2299.00',
        });

        //follow power hint to resolve
        load.drawPower = 2299;
        op.check(true);

        expect(op.messages.length).toEqual(0);
        expect(load.messages.length).toEqual(0);

        //go again and increase op class
        load.drawPower = 2500;
        op.overCurrentProtectionType = OvercurrentProtectionType.C;
        op.check(true);

        expect(op.messages.length).toEqual(0);
        expect(load.messages.length).toEqual(0);
    });
});