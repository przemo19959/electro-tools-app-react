import { PhaseType } from "../../currenttable/enums/PhaseType";
import { WireDiameter } from "../../currenttable/enums/WireDiameter";
import { Wire } from "../wire";

describe('wire tests', () => {
    it('power loss is calculated fine, Example 9.11', () => {
        const wire = new Wire(WireDiameter.D_15, 'UNDER_PLASTER', 'ONE_WIRE', PhaseType.ONE, 21.04704);

        expect(wire.shortImpedance(false).toFixed(4)).equal('0.3132');
        expect(wire.powerLoss(113.64).toFixed(4)).equal('4044.6803');
    });

    it('impedance is calculated fine - Markowicz page 50', () => {
        const wire = new Wire(WireDiameter.D_160, 'DIRECT_ON_WALL', 'MULTI_WIRE', PhaseType.ONE, 50);

        expect(wire.shortImpedance(false).toFixed(4)).equal('0.0698');
    });
});