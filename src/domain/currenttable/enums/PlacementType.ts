import type { ReadWireDto } from "../../../api/api";

export type PlacementType = NonNullable<ReadWireDto['placement']>;
export const PLACEMENT_TYPE_VALUES: PlacementType[] = [
    'UNDER_PLASTER',
    'IN_PIPE_ON_WALL',
    'DIRECT_ON_WALL',
];

export const SWITCHBOARD_PLACEMENT_TYPE: PlacementType = 'DIRECT_ON_WALL';
