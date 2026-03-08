import type { CreateLoadElementDto } from "../../../../api/api";

export type LoadConfig = NonNullable<CreateLoadElementDto['config']>;
export const LOAD_CONFIG_VALUES: LoadConfig[] = [
    'STAR',
    'DELTA',
];

