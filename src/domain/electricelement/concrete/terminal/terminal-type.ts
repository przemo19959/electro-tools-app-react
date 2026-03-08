import type { CreateTerminalElementDto } from "../../../../api/api";

export type TerminalTypeVal = NonNullable<CreateTerminalElementDto['type']>;
export const TERMINAL_TYPE_VALUES: TerminalTypeVal[] = [
  'TN_C',
  'TN_C_S',
  'TN_S',
  'TT',
];


export class TerminalType {
  static TN_C = new TerminalType('TN_C', 'TN-C');
  static TN_C_S = new TerminalType('TN_C_S', 'TN-C-S');
  static TN_S = new TerminalType('TN_S', 'TN-S');
  static TT = new TerminalType('TT', 'TT');

  static VALUES = [
    TerminalType.TN_C,
    TerminalType.TN_C_S,
    TerminalType.TN_S,
    TerminalType.TT,
  ];

  constructor(
    public type: TerminalTypeVal,
    public label: string,
  ) {
  }

  equals(other: TerminalType) {
    return this.type === other.type;
  }

  static create(type: TerminalTypeVal) {
    return this.VALUES.find(v => v.type === type);
  }
}