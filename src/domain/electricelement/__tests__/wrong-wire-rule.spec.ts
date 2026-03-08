import { PhaseType } from "../../currenttable/enums/PhaseType";
import { WireDiameter } from "../../currenttable/enums/WireDiameter";
import { MessageKey } from "../../elementmessage/element-message";
import { Wire } from "../../wire/wire";
import { LoadElement } from "../concrete/load/load-element";

describe('WrongWireRule', () => {
    it(`should not add ${MessageKey.WRONG_WIRE_DIAMETER.id} when wire is ok`, () => {
        const wire = new Wire(WireDiameter.D_40, 'IN_PIPE_ON_WALL', 'ONE_WIRE', PhaseType.THREE, 5);
        const load = LoadElement.empty();
        load.drawPower = 15870;
        load.wire = wire;

        load.check();

        expect(load.messages.length).toEqual(1);
        expect(load.messages[0].id).toEqual(MessageKey.NO_ZEROING_TNC.id);
    });

    it(`should add ${MessageKey.WRONG_WIRE_DIAMETER.id} when wire is not ok`, () => {
        const wire = new Wire(WireDiameter.D_25, 'IN_PIPE_ON_WALL', 'ONE_WIRE', PhaseType.THREE, 5);
        const load = LoadElement.empty();
        load.drawPower = 15870;
        load.wire = wire;

        load.check();

        expect(load.messages.length).toEqual(2);
        expect(load.messages[0].id).toEqual(MessageKey.WRONG_WIRE_DIAMETER.id);
        expect(load.messages[0].params).toEqual({ matchingDiameter: '4mm\u00B2', maxPower: '15180.00' });
        expect(load.messages[1].id).toEqual(MessageKey.NO_ZEROING_TNC.id);
        expect(load.drawPower).not.toEqual(15180);

        load.drawPower = 15180;
        load.check();
        
        expect(load.messages.length).toEqual(1);
        expect(load.messages[0].id).toEqual(MessageKey.NO_ZEROING_TNC.id);
        expect(load.drawPower).toEqual(15180);

        load.powerFactor = 0.8
        load.check();

        expect(load.messages.length).toEqual(2);
        expect(load.messages[0].id).toEqual(MessageKey.NO_ZEROING_TNC.id);
        expect(load.messages[1].id).toEqual(MessageKey.WRONG_WIRE_DIAMETER.id);
        expect(load.messages[1].params).toEqual({ matchingDiameter: '4mm\u00B2', maxPower: '12144.00' });
        expect(load.drawPower).toEqual(15180);

        load.drawPower = 12144;
        load.check();

        expect(load.messages.length).toEqual(1);
        expect(load.messages[0].id).toEqual(MessageKey.NO_ZEROING_TNC.id);
        expect(load.drawPower).toEqual(12144);
    });

    it('works fine, when load with two extra as children', () => {
        const wire = new Wire(WireDiameter.D_25, 'IN_PIPE_ON_WALL', 'ONE_WIRE', PhaseType.ONE, 5);
        const load = LoadElement.empty();
        load.drawPower = 5000;
        load.wire = wire;

        const load2 = LoadElement.empty(load.id);
        load2.drawPower = 1000;
        load.children.push(load2);

        const load3 = LoadElement.empty(load.id);
        load3.drawPower = 1500;
        load.children.push(load3);

        load.check(true);

        expect(load.messages.length).toEqual(2);
        expect(load.messages[0].id).toEqual(MessageKey.WRONG_WIRE_DIAMETER.id);
        expect(load.messages[0].params).toEqual({ matchingDiameter: '4mm\u00B2', maxPower: '5750.00' });
        expect(load.messages[1].id).toEqual(MessageKey.NO_ZEROING_TNC.id);
        expect(load.getTotalPower()).not.toEqual(5750);
        expect(load.getTotalCurrent()).not.toEqual(25);

        expect(load2.messages.length).toEqual(1);
        expect(load2.messages[0].id).toEqual(MessageKey.NO_ZEROING_TNC.id);

        expect(load3.messages.length).toEqual(1);
        expect(load3.messages[0].id).toEqual(MessageKey.NO_ZEROING_TNC.id);

        load2.drawPower -= 500;
        load3.drawPower -= 1308;
        load.check(true);

        expect(load.messages.length).toEqual(1);
        expect(load.messages[0].id).toEqual(MessageKey.NO_ZEROING_TNC.id);
        expect(load2.messages.length).toEqual(1);
        expect(load2.messages[0].id).toEqual(MessageKey.NO_ZEROING_TNC.id);
        expect(load3.messages.length).toEqual(1);
        expect(load3.messages[0].id).toEqual(MessageKey.NO_ZEROING_TNC.id);
        expect(load.getTotalPower()).toEqual(5692);
        expect(load.getTotalCurrent().toFixed(2)).toEqual('24.75');
    });
});