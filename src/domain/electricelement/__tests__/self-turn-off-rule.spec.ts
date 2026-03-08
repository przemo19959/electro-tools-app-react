import uuid from 'react-native-uuid';
import { LoadElement } from '../concrete/load/load-element';
import { OvercurrentProtectionElement } from '../concrete/overcurrent-protection/overcurrent-protection-element';
import { OvercurrentProtectionType } from '../concrete/overcurrent-protection/overcurrent-protection-type';
import { TerminalElement } from '../concrete/terminal/terminal-element';
import { ElectricElement } from '../electric-element';
import { PhaseType } from '../../currenttable/enums/PhaseType';
import { WireDiameter } from '../../currenttable/enums/WireDiameter';
import { MessageKey } from '../../elementmessage/element-message';
import { Wire } from '../../wire/wire';

describe('SelfTurnOffRule', () => {
    it('case 1 - positive one', () => {
        const wire = new Wire(WireDiameter.D_15, 'UNDER_PLASTER', 'MULTI_WIRE', PhaseType.ONE, 70);
        const load = LoadElement.empty();
        load.id = uuid.v4();
        load.drawPower = 500;
        load.wire = wire;

        const op = OvercurrentProtectionElement.predefined({});
        op.id = uuid.v4();
        op.amperage = 10;
        op.addChild(load);

        const terminal = ElectricElement.empty();
        terminal.wire.length = 0;
        terminal.id = uuid.v4();
        terminal.addChild(op);

        terminal.check();

        expect(load.messages.length).toEqual(0);
        expect(load.context.closestOp?.id).toEqual(op.id);
        expect(op.messages.length).toEqual(0);
        expect(op.context.closestOp?.id).toEqual(op.id);
        expect(terminal.messages.length).toEqual(0);
        expect(terminal.context.closestOp).toEqual(undefined);
    });

    it('case 2 - message appears and disappears when settings like in hint', () => {
        const wire = new Wire(WireDiameter.D_15, 'UNDER_PLASTER', 'MULTI_WIRE', PhaseType.ONE, 200);
        const load = LoadElement.empty();
        load.drawPower = 250;
        load.id = uuid.v4();
        load.wire = wire;

        const op = OvercurrentProtectionElement.predefined({});
        op.id = uuid.v4();
        op.amperage = 10;
        op.addChild(load);

        const terminal = ElectricElement.empty();
        terminal.id = uuid.v4();
        terminal.wire.length = 0;
        terminal.addChild(op);

        terminal.check(true);

        expect(terminal.messages.length).toEqual(0);
        expect(op.messages.length).toEqual(0);
        expect(load.messages.length).toEqual(2);
        expect(load.messages[0].id).toEqual(MessageKey.SELF_TURN_OFF.id);
        expect(load.messages[0].params).toEqual({ maxLength: '149.56', minDiameter: '2.5', closestOpName: 'MCB, Zmax=4.60[Ω]' });
        expect(load.messages[1].id).toEqual(MessageKey.NO_ZEROING_TNC.id);

        load.wire.length = 129.4 - op.wire.length; //change length according to hint
        terminal.check(true);

        expect(terminal.messages.length).toEqual(0);
        expect(op.messages.length).toEqual(0);
        expect(load.messages.length).toEqual(1);
        expect(load.messages[0].id).toEqual(MessageKey.NO_ZEROING_TNC.id);

        load.wire.length = 200;
        load.wire.diameter = WireDiameter.D_25; //change diameter according to hint
        terminal.check(true);

        expect(terminal.messages.length).toEqual(0);
        expect(op.messages.filter(v => v.key.id !== MessageKey.DESCENDING_CAPACITY.id).length).toEqual(0);
        expect(load.messages.filter(v => v.key.id === MessageKey.SELF_TURN_OFF.id).length).toEqual(0);

        expect(load.context.closestOp?.id).toEqual(op.id);
        expect(op.context.closestOp?.id).toEqual(op.id);
        expect(terminal.context.closestOp).toEqual(undefined);
    });

    it('works fine when nested ops', () => {
        const wire = new Wire(WireDiameter.D_15, 'UNDER_PLASTER', 'MULTI_WIRE', PhaseType.ONE, 200);
        //impedance ~5.95 ohms
        const load = LoadElement.empty();
        load.id = uuid.v4();
        load.drawPower = 250;
        load.wire = wire;

        const op = OvercurrentProtectionElement.predefined({});
        op.id = uuid.v4();
        op.amperage = 10;
        op.addChild(load);

        const op2 = OvercurrentProtectionElement.predefined({});
        op2.id = uuid.v4();
        op2.amperage = 10;
        op2.addChild(op);

        const terminal = ElectricElement.empty();
        terminal.id = uuid.v4();
        terminal.wire.length = 0;
        terminal.addChild(op2);

        terminal.check(true);

        expect(terminal.messages.length).toEqual(0);
        expect(op.messages.length).toEqual(0);
        expect(op2.messages.length).toEqual(0);
        expect(load.messages.length).toEqual(2);
        expect(load.messages[0].id).toEqual(MessageKey.SELF_TURN_OFF.id);
        expect(load.messages[0].params).toEqual({ maxLength: '144.56', minDiameter: '2.5', closestOpName: 'MCB, Zmax=4.60[Ω]' });
        expect(load.messages[1].id).toEqual(MessageKey.NO_ZEROING_TNC.id);

        load.wire.length = 124.4 - op.wire.length - op2.wire.length; //change length according to hint
        terminal.check(true);

        expect(terminal.messages.length).toEqual(0);
        expect(op.messages.length).toEqual(0);
        expect(load.messages.length).toEqual(1);
        expect(load.messages[0].id).toEqual(MessageKey.NO_ZEROING_TNC.id);
    });

    it('case 3 - example from "Dla każdego"', () => {
        const terminal = TerminalElement.empty();
        terminal.wire.length = terminal.wire.lengthForShortImpedance(.6);

        const op = OvercurrentProtectionElement.predefined({});
        op.id = uuid.v4();
        op.amperage = 10;
        op.overCurrentProtectionType = OvercurrentProtectionType.B;
        op.wire.length = 0; //
        terminal.addChild(op);

        const load = LoadElement.empty();
        load.id = uuid.v4();
        load.wire.length = 70;
        load.wire.diameter = WireDiameter.D_15;
        op.addChild(load);

        terminal.check(true);

        expect(load.context.parentShortImpedance.toFixed(3)).toEqual('0.600');
        expect(load.context.ownShortImpedance.toFixed(3)).toEqual('2.083');
        expect(load.messages.filter(v => v.key.id === MessageKey.SELF_TURN_OFF.id).length).toEqual(0);

        //try to break rule
        load.wire.length = 500;
        terminal.check(true);

        expect(load.context.parentShortImpedance.toFixed(3)).toEqual('0.600');
        expect(load.context.ownShortImpedance.toFixed(3)).toEqual('14.881');

        const messages = load.messages.filter(v => v.key.id === MessageKey.SELF_TURN_OFF.id);
        expect(messages.length).toEqual(1);
        expect(messages[0].params).toEqual({ maxLength: '134.40', minDiameter: '6', closestOpName: 'MCB, Zmax=4.60[Ω]' });

        //try to resolve error by length
        load.wire.length = 134;
        terminal.check(true);

        expect(load.context.parentShortImpedance.toFixed(3)).toEqual('0.600');
        expect(load.messages.filter(v => v.key.id === MessageKey.SELF_TURN_OFF.id).length).toEqual(0);

        //break again and resolve by diameter
        load.wire.length = 500;
        load.wire.diameter = WireDiameter.D_60;
        terminal.check(true);

        expect(load.context.parentShortImpedance.toFixed(3)).toEqual('0.600');
        expect(load.messages.filter(v => v.key.id === MessageKey.SELF_TURN_OFF.id).length).toEqual(0);
    });
});