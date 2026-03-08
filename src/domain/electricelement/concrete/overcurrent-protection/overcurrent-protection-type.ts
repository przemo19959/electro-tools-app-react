import type { CreateOvercurrentProtectionElementDto } from "../../../../api/api";

export type OvercurrentProtectionTypeKey = NonNullable<CreateOvercurrentProtectionElementDto['type']>;

export class OvercurrentProtectionType {
    // class A exists, but i couldn't find any to buy, so i will remove it from app
    static B = new OvercurrentProtectionType('B', 5);
    static C = new OvercurrentProtectionType('C', 10);
    static D = new OvercurrentProtectionType('D', 20);
    static VALUES = [
        OvercurrentProtectionType.B,
        OvercurrentProtectionType.C,
        OvercurrentProtectionType.D,
    ];

    constructor(
        public name: OvercurrentProtectionTypeKey,
        public onValue: number,
    ) {
    }

    static of(name: OvercurrentProtectionTypeKey) {
        return this.VALUES.find(v => v.name === name);
    }
}