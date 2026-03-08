import Optional from "optional-js";
import type { ReadWireDto } from "../../../api/api";

type DiameterKey = NonNullable<ReadWireDto['diameter']>;

export class WireDiameter {
  static D_15 = new WireDiameter('D_15', 1.5);
  static D_25 = new WireDiameter('D_25', 2.5);
  static D_40 = new WireDiameter('D_40', 4);
  static D_60 = new WireDiameter('D_60', 6);
  static D_100 = new WireDiameter('D_100', 10);
  static D_160 = new WireDiameter('D_160', 16);
  static D_250 = new WireDiameter('D_250', 25);
  static D_350 = new WireDiameter('D_350', 35);
  static D_500 = new WireDiameter('D_500', 50);
  static D_700 = new WireDiameter('D_700', 70);
  static D_950 = new WireDiameter('D_950', 95);
  static D_1200 = new WireDiameter('D_1200', 120);

  static VALUES = [
    this.D_15, this.D_25, this.D_40, this.D_60,
    this.D_100, this.D_160, this.D_250, this.D_350,
    this.D_500, this.D_700, this.D_950, this.D_1200,
  ];

  private constructor(
    public key: DiameterKey,
    public value: number,
  ) {
  }

  static of(key: DiameterKey | undefined) {
    return this.VALUES.find(v => v.key === key);
  }

  static nextGteThan(than: WireDiameter): Optional<WireDiameter> {
    const greaterThanValues = this.VALUES.filter(v => v.value >= than.value);
    return greaterThanValues.length > 0
      ? Optional.of(greaterThanValues.sort()[0])
      : Optional.empty();
  }
}