import { LightKind, type RoomType } from "../types";

describe('light-power-selector types spec', () => {

    test.each([
        [18.8, 'CORRIDOR_OR_UTILITY', '299.407'],
        [9.1, 'CORRIDOR_OR_UTILITY', '144.926'],
        [0, 'CORRIDOR_OR_UTILITY', '0.000'],
        [11, 'RESIDENTIAL', '350.370'],
        [36.3, 'RESIDENTIAL', '1156.222'],
        [0, 'RESIDENTIAL', '0.000'],
    ])('requiredPowerByArea works fine for %f area and type %s', (a, b, expected) => {
        expect(LightKind.CLASSIC_BULB.requiredPowerByArea(a, b as RoomType, 13.5)
            .toFixed(3))
            .toBe(expected);
    });
})