import type { ElectricElementSubType } from "../../types";
import { OvercurrentProtectionElement } from "./overcurrent-protection-element";
import { OvercurrentProtectionType, type OvercurrentProtectionTypeKey } from "./overcurrent-protection-type";

export type OvercurrentRangeResult = {
    lower: number;
    upper: number;
    elementLabel: string;
};

export type OvercurrentPredefinedValue = Extract<ElectricElementSubType, 'OVERCURRENT_LIGHT' | 'OVERCURRENT_SOCKET'>;
export const OVERCURRENT_PREDEFINED_MAP: Record<OvercurrentPredefinedValue, Pick<OvercurrentProtectionElement, 'amperage' | 'overCurrentProtectionType'>> = {
    OVERCURRENT_LIGHT: {
        amperage: 10,
        overCurrentProtectionType: OvercurrentProtectionType.B,
    },
    OVERCURRENT_SOCKET: {
        amperage: 16,
        overCurrentProtectionType: OvercurrentProtectionType.B,
    },
};

export const CLASS_TO_AMPERAGE_VALUES: Record<OvercurrentProtectionTypeKey, number[]> = {
    A: [],
    B: [2, 3, 4, 6, 10, 13, 16, 20, 25, 32, 40, 50, 63],
    C: [.5, 1, 2, 3, 4, 6, 10, 13, 16, 20, 25, 32, 40, 50, 63, 80],
    D: [.5, 1, 2, 3, 4, 6, 10, 13, 16, 20, 25, 32, 40, 50, 63],
}