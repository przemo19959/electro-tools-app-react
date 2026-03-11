export const ROOM_TYPE_VALUES = [
    'RESIDENTIAL',
    'CORRIDOR_OR_UTILITY',
] as const;

export type RoomType = typeof ROOM_TYPE_VALUES[number];
const ROOM_TYPE_TO_COEF: Record<RoomType, number> = {
    RESIDENTIAL: 100,
    CORRIDOR_OR_UTILITY: 50,
}

type LiminousEfficiency = {
    min: number; //lm/W
    max: number; //lm/W
}

export const LIGHT_KIND_KEY_VALUES = [
    'CLASSIC_BULB',
    'LINEAR_FLUORESCENT_LAMP',
    'INDUCTION_LAMP',
    'COMPACT_FLUORESCENT_LAMP',
    'LED'
];
export type LightKindKey = typeof LIGHT_KIND_KEY_VALUES[number];

export class LightKind {
    static CLASSIC_BULB = new LightKind('CLASSIC_BULB', { min: 6, max: 17 });
    static LINEAR_FLUORESCENT_LAMP = new LightKind('LINEAR_FLUORESCENT_LAMP', { min: 45, max: 100 });
    static INDUCTION_LAMP = new LightKind('INDUCTION_LAMP', { min: 60, max: 90 });
    static COMPACT_FLUORESCENT_LAMP = new LightKind('COMPACT_FLUORESCENT_LAMP', { min: 50, max: 70 });
    static LED = new LightKind('LED', { min: 80, max: 300 });

    static VALUES = [
        this.CLASSIC_BULB,
        this.LINEAR_FLUORESCENT_LAMP,
        this.INDUCTION_LAMP,
        this.COMPACT_FLUORESCENT_LAMP,
        this.LED,
    ];

    private constructor(
        public key: LightKindKey,
        public efficiency: LiminousEfficiency,
    ) { }

    static of(key: LightKindKey | undefined) {
        return this.VALUES.find(v => v.key === key);
    }

    public average() {
        return (this.efficiency.min + this.efficiency.max) / 2;
    }

    public requiredPowerByArea(
        roomArea: number,
        roomType: RoomType,
        luminousEff = this.average(),
    ): number {
        const unitPower = (4.3 * ROOM_TYPE_TO_COEF[roomType]) / luminousEff;
        return unitPower * roomArea;
    }
}