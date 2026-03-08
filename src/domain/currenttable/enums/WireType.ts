import type { ReadWireDto } from "../../../api/api";

export type WireType = NonNullable<ReadWireDto['type']>;
export const WIRE_TYPE_VALUES = [
    'ONE_WIRE',
    'MULTI_WIRE',
];

export const SWITCHBOARD_WIRE_TYPE: WireType = 'MULTI_WIRE';