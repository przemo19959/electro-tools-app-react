import { LoadElement } from "../load/load-element";
import uuid from 'react-native-uuid';
import { OvercurrentProtectionElement } from "./overcurrent-protection-element";
import { ArrayUtils } from "../../../../utils/array-utils";
import { PhaseType } from "../../../currenttable/enums/PhaseType";
import { WireDiameter } from "../../../currenttable/enums/WireDiameter";
import { MessageKey } from "../../../elementmessage/element-message";
import { Wire } from "../../../wire/wire";

describe('OvercurrentProtectionRule', () => {
    it(`should add ${MessageKey.WRONG_OVERCURRENT_PROTECTION.id} when neccessary`, function () {
        const wire = new Wire(WireDiameter.D_40, 'UNDER_PLASTER', 'MULTI_WIRE', PhaseType.ONE, 30);
        const op = OvercurrentProtectionElement.predefined({});
        op.id = uuid.v4();
        op.amperage = 32;
        op.wire = wire;

        const load = LoadElement.empty(op.id);
        load.id = uuid.v4();
        load.drawPower = 3680;
        load.powerFactor = 1;

        op.children.push(load);
        op.check();

        expect(load.messages.length).toEqual(0);
        expect(op.messages.length).toEqual(2);
        expect(op.messages[0].id).toEqual(MessageKey.TOO_BIG_WIRE_DIAMETER.id);
        expect(op.messages[1].id).toEqual(MessageKey.WRONG_OVERCURRENT_PROTECTION.id);
        expect(op.messages[1].params).toEqual({ lower: '16.00', upper: '27.00' });
    });

    // it(`should add ${MessageKey.START_CURRENT_ISSUE.id} when necessary`, () => {
    //     const wire = new Wire(WireDiameter.D_60, PlacementType.UNDER_PLASTER, WireType.MULTI_WIRE, PhaseType.ONE, 30);
    //     const load = ReadLoadElementDto.create({
    //         id: UUID.uuidv4(),
    //         wire,
    //         drawPower: 3680,
    //         powerFactor: 1,
    //         highStartCurrent: true,
    //         children: [],
    //     });
    //     const op = ReadOvercurrentProtectionElementDto.create({
    //         id: UUID.uuidv4(),
    //         type: OvercurrentProtectionType.aClass,
    //         amperage: 20,
    //         children: [load],
    //     });

    //     op.check();

    //     expect(load.messages.length).toEqual(0);
    //     expect(op.messages.length).toEqual(1);
    //     expect(op.messages[0].getId()).toEqual(MessageKey.START_CURRENT_ISSUE.id);
    //     expect(op.messages[0].other.id).toEqual(load.id);
    //     expect(op.messages[0].other.label).toEqual(load.label);
    //     expect(op.messages[0].params).toEqual({ 0: '80.00' });
    // });

    it('should remove messages if rules are valid', () => {
        const wire = new Wire(WireDiameter.D_60, 'UNDER_PLASTER', 'MULTI_WIRE', PhaseType.ONE, 30);
        const op = OvercurrentProtectionElement.predefined({});
        op.id = uuid.v4();
        op.amperage = 20;
        op.wire = wire;

        const load = LoadElement.empty(op.id);
        load.id = uuid.v4();
        load.drawPower = 3680;
        load.powerFactor = 1;

        op.children.push(load);

        op.check();

        expect(load.messages.length).toEqual(0);
        expect(op.messages.length).toEqual(1);
        expect(op.messages[0].id).toEqual(MessageKey.TOO_BIG_WIRE_DIAMETER.id);
    });

    it('overcurrent split rule works fine', () => {
        const op = OvercurrentProtectionElement.predefined({});
        op.id = uuid.v4();
        op.amperage = 10;
        op.wire = new Wire(WireDiameter.D_60, 'IN_PIPE_ON_WALL', 'ONE_WIRE', PhaseType.ONE, 5);

        const load1 = LoadElement.empty(op.id);
        load1.id = uuid.v4();
        load1.drawPower = 1000;
        load1.powerFactor = 1;
        op.children.push(load1);

        const load2 = LoadElement.empty(op.id);
        load2.id = uuid.v4();
        load2.drawPower = 8000;
        load2.powerFactor = 1;
        load2.wire = new Wire(WireDiameter.D_60, 'IN_PIPE_ON_WALL', 'ONE_WIRE', PhaseType.ONE, 10);
        op.children.push(load2);
        
        op.check();

        expect(op.messages.length).toEqual(2);
        expect(op.messages[0].key).toEqual(MessageKey.WRONG_OVERCURRENT_PROTECTION);
        expect(op.messages[0].params).toEqual({ lower: '39.13', upper: '43.00' });
        expect(op.messages[1].key).toEqual(MessageKey.OVERCURRENT_SPLIT_POSSIBLE);

        //change according to first hint
        op.amperage = 40;
        op.check();

        expect(op.messages.length).toEqual(1);
        expect(op.messages[0].key).toEqual(MessageKey.OVERCURRENT_SPLIT_POSSIBLE);

        const op2 = OvercurrentProtectionElement.predefined({});
        op2.id = uuid.v4();
        op2.amperage = 10;

        ArrayUtils.removeById(op.children, load1.id);
        op2.children.push(load1);
        op.check();
        op2.check();

        expect(op.messages.length).toEqual(0);
        expect(op2.messages.length).toEqual(0);
    });
});