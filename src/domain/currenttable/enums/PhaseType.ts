import type { ReadWireDto } from "../../../api/api";

export type PhaseTypeVal = NonNullable<ReadWireDto['phase']>;
export const PHASE_TYPE_VALUES: PhaseTypeVal[] = [
  'ONE',
  'THREE',
];


export class PhaseType {
  static ONE = new PhaseType('ONE', 1, 200, 230);
  static THREE = new PhaseType('THREE', 3, 100, 400);

  static VALUES = [
    this.ONE,
    this.THREE,
  ];

  voltageSquared: number;

  private constructor(
    public id: PhaseTypeVal,
    public phaseCount: number,
    public voltageDropCoefficient: number,
    public voltage: number,
  ) {
    this.voltageSquared = Math.pow(voltage, 2);
  }

  static of(id: PhaseTypeVal | undefined) {
    return this.VALUES.find(v => v.id === id);
  }

  equals(other: PhaseType) {
    return this.id === other.id;
  }
}
