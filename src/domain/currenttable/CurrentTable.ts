import { CurrentTableRecord } from './CurrentTableRecord';
import { WireDiameter } from './enums/WireDiameter';
import { Wire } from '../wire/wire';
import Optional from 'optional-js';
import { ArrayUtils } from '../../utils/array-utils';
import type { ElectricElement } from "../electricelement/electric-element";
import { PhaseType } from './enums/PhaseType';

export class CurrentTable {
  private static readonly table = [
    new CurrentTableRecord('UNDER_PLASTER', 'ONE_WIRE', PhaseType.ONE, WireDiameter.D_15, 16.5),
    new CurrentTableRecord('UNDER_PLASTER', 'ONE_WIRE', PhaseType.ONE, WireDiameter.D_25, 21),
    new CurrentTableRecord('UNDER_PLASTER', 'ONE_WIRE', PhaseType.ONE, WireDiameter.D_40, 28),
    new CurrentTableRecord('UNDER_PLASTER', 'ONE_WIRE', PhaseType.ONE, WireDiameter.D_60, 36),
    new CurrentTableRecord('UNDER_PLASTER', 'ONE_WIRE', PhaseType.ONE, WireDiameter.D_100, 49),
    new CurrentTableRecord('UNDER_PLASTER', 'ONE_WIRE', PhaseType.ONE, WireDiameter.D_160, 65),
    new CurrentTableRecord('UNDER_PLASTER', 'ONE_WIRE', PhaseType.ONE, WireDiameter.D_250, 85),
    new CurrentTableRecord('UNDER_PLASTER', 'ONE_WIRE', PhaseType.ONE, WireDiameter.D_350, 105),
    new CurrentTableRecord('UNDER_PLASTER', 'ONE_WIRE', PhaseType.ONE, WireDiameter.D_500, 126),
    new CurrentTableRecord('UNDER_PLASTER', 'ONE_WIRE', PhaseType.ONE, WireDiameter.D_700, 160),
    new CurrentTableRecord('UNDER_PLASTER', 'ONE_WIRE', PhaseType.ONE, WireDiameter.D_950, 193),
    new CurrentTableRecord('UNDER_PLASTER', 'ONE_WIRE', PhaseType.ONE, WireDiameter.D_1200, 223),

    new CurrentTableRecord('UNDER_PLASTER', 'ONE_WIRE', PhaseType.THREE, WireDiameter.D_15, 14.5),
    new CurrentTableRecord('UNDER_PLASTER', 'ONE_WIRE', PhaseType.THREE, WireDiameter.D_25, 19),
    new CurrentTableRecord('UNDER_PLASTER', 'ONE_WIRE', PhaseType.THREE, WireDiameter.D_40, 25),
    new CurrentTableRecord('UNDER_PLASTER', 'ONE_WIRE', PhaseType.THREE, WireDiameter.D_60, 33),
    new CurrentTableRecord('UNDER_PLASTER', 'ONE_WIRE', PhaseType.THREE, WireDiameter.D_100, 45),
    new CurrentTableRecord('UNDER_PLASTER', 'ONE_WIRE', PhaseType.THREE, WireDiameter.D_160, 59),
    new CurrentTableRecord('UNDER_PLASTER', 'ONE_WIRE', PhaseType.THREE, WireDiameter.D_250, 77),
    new CurrentTableRecord('UNDER_PLASTER', 'ONE_WIRE', PhaseType.THREE, WireDiameter.D_350, 94),
    new CurrentTableRecord('UNDER_PLASTER', 'ONE_WIRE', PhaseType.THREE, WireDiameter.D_500, 114),
    new CurrentTableRecord('UNDER_PLASTER', 'ONE_WIRE', PhaseType.THREE, WireDiameter.D_700, 144),
    new CurrentTableRecord('UNDER_PLASTER', 'ONE_WIRE', PhaseType.THREE, WireDiameter.D_950, 174),
    new CurrentTableRecord('UNDER_PLASTER', 'ONE_WIRE', PhaseType.THREE, WireDiameter.D_1200, 199),

    new CurrentTableRecord('UNDER_PLASTER', 'MULTI_WIRE', PhaseType.ONE, WireDiameter.D_15, 15.5),
    new CurrentTableRecord('UNDER_PLASTER', 'MULTI_WIRE', PhaseType.ONE, WireDiameter.D_25, 19.5),
    new CurrentTableRecord('UNDER_PLASTER', 'MULTI_WIRE', PhaseType.ONE, WireDiameter.D_40, 27),
    new CurrentTableRecord('UNDER_PLASTER', 'MULTI_WIRE', PhaseType.ONE, WireDiameter.D_60, 34),
    new CurrentTableRecord('UNDER_PLASTER', 'MULTI_WIRE', PhaseType.ONE, WireDiameter.D_100, 46),
    new CurrentTableRecord('UNDER_PLASTER', 'MULTI_WIRE', PhaseType.ONE, WireDiameter.D_160, 60),
    new CurrentTableRecord('UNDER_PLASTER', 'MULTI_WIRE', PhaseType.ONE, WireDiameter.D_250, 80),
    new CurrentTableRecord('UNDER_PLASTER', 'MULTI_WIRE', PhaseType.ONE, WireDiameter.D_350, 98),
    new CurrentTableRecord('UNDER_PLASTER', 'MULTI_WIRE', PhaseType.ONE, WireDiameter.D_500, 117),
    new CurrentTableRecord('UNDER_PLASTER', 'MULTI_WIRE', PhaseType.ONE, WireDiameter.D_700, 147),
    new CurrentTableRecord('UNDER_PLASTER', 'MULTI_WIRE', PhaseType.ONE, WireDiameter.D_950, 177),
    new CurrentTableRecord('UNDER_PLASTER', 'MULTI_WIRE', PhaseType.ONE, WireDiameter.D_1200, 204),

    new CurrentTableRecord('UNDER_PLASTER', 'MULTI_WIRE', PhaseType.THREE, WireDiameter.D_15, 14),
    new CurrentTableRecord('UNDER_PLASTER', 'MULTI_WIRE', PhaseType.THREE, WireDiameter.D_25, 18.5),
    new CurrentTableRecord('UNDER_PLASTER', 'MULTI_WIRE', PhaseType.THREE, WireDiameter.D_40, 24),
    new CurrentTableRecord('UNDER_PLASTER', 'MULTI_WIRE', PhaseType.THREE, WireDiameter.D_60, 31),
    new CurrentTableRecord('UNDER_PLASTER', 'MULTI_WIRE', PhaseType.THREE, WireDiameter.D_100, 41),
    new CurrentTableRecord('UNDER_PLASTER', 'MULTI_WIRE', PhaseType.THREE, WireDiameter.D_160, 55),
    new CurrentTableRecord('UNDER_PLASTER', 'MULTI_WIRE', PhaseType.THREE, WireDiameter.D_250, 72),
    new CurrentTableRecord('UNDER_PLASTER', 'MULTI_WIRE', PhaseType.THREE, WireDiameter.D_350, 88),
    new CurrentTableRecord('UNDER_PLASTER', 'MULTI_WIRE', PhaseType.THREE, WireDiameter.D_500, 105),
    new CurrentTableRecord('UNDER_PLASTER', 'MULTI_WIRE', PhaseType.THREE, WireDiameter.D_700, 133),
    new CurrentTableRecord('UNDER_PLASTER', 'MULTI_WIRE', PhaseType.THREE, WireDiameter.D_950, 159),
    new CurrentTableRecord('UNDER_PLASTER', 'MULTI_WIRE', PhaseType.THREE, WireDiameter.D_1200, 182),

    new CurrentTableRecord('IN_PIPE_ON_WALL', 'ONE_WIRE', PhaseType.ONE, WireDiameter.D_15, 18.5),
    new CurrentTableRecord('IN_PIPE_ON_WALL', 'ONE_WIRE', PhaseType.ONE, WireDiameter.D_25, 25),
    new CurrentTableRecord('IN_PIPE_ON_WALL', 'ONE_WIRE', PhaseType.ONE, WireDiameter.D_40, 34),
    new CurrentTableRecord('IN_PIPE_ON_WALL', 'ONE_WIRE', PhaseType.ONE, WireDiameter.D_60, 43),
    new CurrentTableRecord('IN_PIPE_ON_WALL', 'ONE_WIRE', PhaseType.ONE, WireDiameter.D_100, 60),
    new CurrentTableRecord('IN_PIPE_ON_WALL', 'ONE_WIRE', PhaseType.ONE, WireDiameter.D_160, 81),
    new CurrentTableRecord('IN_PIPE_ON_WALL', 'ONE_WIRE', PhaseType.ONE, WireDiameter.D_250, 107),
    new CurrentTableRecord('IN_PIPE_ON_WALL', 'ONE_WIRE', PhaseType.ONE, WireDiameter.D_350, 133),
    new CurrentTableRecord('IN_PIPE_ON_WALL', 'ONE_WIRE', PhaseType.ONE, WireDiameter.D_500, 160),
    new CurrentTableRecord('IN_PIPE_ON_WALL', 'ONE_WIRE', PhaseType.ONE, WireDiameter.D_700, 204),
    new CurrentTableRecord('IN_PIPE_ON_WALL', 'ONE_WIRE', PhaseType.ONE, WireDiameter.D_950, 246),
    new CurrentTableRecord('IN_PIPE_ON_WALL', 'ONE_WIRE', PhaseType.ONE, WireDiameter.D_1200, 285),

    new CurrentTableRecord('IN_PIPE_ON_WALL', 'ONE_WIRE', PhaseType.THREE, WireDiameter.D_15, 16.5),
    new CurrentTableRecord('IN_PIPE_ON_WALL', 'ONE_WIRE', PhaseType.THREE, WireDiameter.D_25, 22),
    new CurrentTableRecord('IN_PIPE_ON_WALL', 'ONE_WIRE', PhaseType.THREE, WireDiameter.D_40, 30),
    new CurrentTableRecord('IN_PIPE_ON_WALL', 'ONE_WIRE', PhaseType.THREE, WireDiameter.D_60, 38),
    new CurrentTableRecord('IN_PIPE_ON_WALL', 'ONE_WIRE', PhaseType.THREE, WireDiameter.D_100, 53),
    new CurrentTableRecord('IN_PIPE_ON_WALL', 'ONE_WIRE', PhaseType.THREE, WireDiameter.D_160, 72),
    new CurrentTableRecord('IN_PIPE_ON_WALL', 'ONE_WIRE', PhaseType.THREE, WireDiameter.D_250, 94),
    new CurrentTableRecord('IN_PIPE_ON_WALL', 'ONE_WIRE', PhaseType.THREE, WireDiameter.D_350, 117),
    new CurrentTableRecord('IN_PIPE_ON_WALL', 'ONE_WIRE', PhaseType.THREE, WireDiameter.D_500, 142),
    new CurrentTableRecord('IN_PIPE_ON_WALL', 'ONE_WIRE', PhaseType.THREE, WireDiameter.D_700, 181),
    new CurrentTableRecord('IN_PIPE_ON_WALL', 'ONE_WIRE', PhaseType.THREE, WireDiameter.D_950, 219),
    new CurrentTableRecord('IN_PIPE_ON_WALL', 'ONE_WIRE', PhaseType.THREE, WireDiameter.D_1200, 253),

    new CurrentTableRecord('IN_PIPE_ON_WALL', 'MULTI_WIRE', PhaseType.ONE, WireDiameter.D_15, 17.5),
    new CurrentTableRecord('IN_PIPE_ON_WALL', 'MULTI_WIRE', PhaseType.ONE, WireDiameter.D_25, 24),
    new CurrentTableRecord('IN_PIPE_ON_WALL', 'MULTI_WIRE', PhaseType.ONE, WireDiameter.D_40, 32),
    new CurrentTableRecord('IN_PIPE_ON_WALL', 'MULTI_WIRE', PhaseType.ONE, WireDiameter.D_60, 40),
    new CurrentTableRecord('IN_PIPE_ON_WALL', 'MULTI_WIRE', PhaseType.ONE, WireDiameter.D_100, 55),
    new CurrentTableRecord('IN_PIPE_ON_WALL', 'MULTI_WIRE', PhaseType.ONE, WireDiameter.D_160, 73),
    new CurrentTableRecord('IN_PIPE_ON_WALL', 'MULTI_WIRE', PhaseType.ONE, WireDiameter.D_250, 95),
    new CurrentTableRecord('IN_PIPE_ON_WALL', 'MULTI_WIRE', PhaseType.ONE, WireDiameter.D_350, 118),
    new CurrentTableRecord('IN_PIPE_ON_WALL', 'MULTI_WIRE', PhaseType.ONE, WireDiameter.D_500, 141),
    new CurrentTableRecord('IN_PIPE_ON_WALL', 'MULTI_WIRE', PhaseType.ONE, WireDiameter.D_700, 178),
    new CurrentTableRecord('IN_PIPE_ON_WALL', 'MULTI_WIRE', PhaseType.ONE, WireDiameter.D_950, 213),
    new CurrentTableRecord('IN_PIPE_ON_WALL', 'MULTI_WIRE', PhaseType.ONE, WireDiameter.D_1200, 246),

    new CurrentTableRecord('IN_PIPE_ON_WALL', 'MULTI_WIRE', PhaseType.THREE, WireDiameter.D_15, 16),
    new CurrentTableRecord('IN_PIPE_ON_WALL', 'MULTI_WIRE', PhaseType.THREE, WireDiameter.D_25, 21),
    new CurrentTableRecord('IN_PIPE_ON_WALL', 'MULTI_WIRE', PhaseType.THREE, WireDiameter.D_40, 29),
    new CurrentTableRecord('IN_PIPE_ON_WALL', 'MULTI_WIRE', PhaseType.THREE, WireDiameter.D_60, 36),
    new CurrentTableRecord('IN_PIPE_ON_WALL', 'MULTI_WIRE', PhaseType.THREE, WireDiameter.D_100, 49),
    new CurrentTableRecord('IN_PIPE_ON_WALL', 'MULTI_WIRE', PhaseType.THREE, WireDiameter.D_160, 66),
    new CurrentTableRecord('IN_PIPE_ON_WALL', 'MULTI_WIRE', PhaseType.THREE, WireDiameter.D_250, 85),
    new CurrentTableRecord('IN_PIPE_ON_WALL', 'MULTI_WIRE', PhaseType.THREE, WireDiameter.D_350, 105),
    new CurrentTableRecord('IN_PIPE_ON_WALL', 'MULTI_WIRE', PhaseType.THREE, WireDiameter.D_500, 125),
    new CurrentTableRecord('IN_PIPE_ON_WALL', 'MULTI_WIRE', PhaseType.THREE, WireDiameter.D_700, 158),
    new CurrentTableRecord('IN_PIPE_ON_WALL', 'MULTI_WIRE', PhaseType.THREE, WireDiameter.D_950, 190),
    new CurrentTableRecord('IN_PIPE_ON_WALL', 'MULTI_WIRE', PhaseType.THREE, WireDiameter.D_1200, 218),

    new CurrentTableRecord('DIRECT_ON_WALL', 'MULTI_WIRE', PhaseType.ONE, WireDiameter.D_15, 21),
    new CurrentTableRecord('DIRECT_ON_WALL', 'MULTI_WIRE', PhaseType.ONE, WireDiameter.D_25, 29),
    new CurrentTableRecord('DIRECT_ON_WALL', 'MULTI_WIRE', PhaseType.ONE, WireDiameter.D_40, 38),
    new CurrentTableRecord('DIRECT_ON_WALL', 'MULTI_WIRE', PhaseType.ONE, WireDiameter.D_60, 49),
    new CurrentTableRecord('DIRECT_ON_WALL', 'MULTI_WIRE', PhaseType.ONE, WireDiameter.D_100, 67),
    new CurrentTableRecord('DIRECT_ON_WALL', 'MULTI_WIRE', PhaseType.ONE, WireDiameter.D_160, 90),
    new CurrentTableRecord('DIRECT_ON_WALL', 'MULTI_WIRE', PhaseType.ONE, WireDiameter.D_250, 119),
    new CurrentTableRecord('DIRECT_ON_WALL', 'MULTI_WIRE', PhaseType.ONE, WireDiameter.D_350, 146),
    new CurrentTableRecord('DIRECT_ON_WALL', 'MULTI_WIRE', PhaseType.ONE, WireDiameter.D_500, 178),
    new CurrentTableRecord('DIRECT_ON_WALL', 'MULTI_WIRE', PhaseType.ONE, WireDiameter.D_700, 226),
    new CurrentTableRecord('DIRECT_ON_WALL', 'MULTI_WIRE', PhaseType.ONE, WireDiameter.D_950, 273),
    new CurrentTableRecord('DIRECT_ON_WALL', 'MULTI_WIRE', PhaseType.ONE, WireDiameter.D_1200, 317),

    new CurrentTableRecord('DIRECT_ON_WALL', 'MULTI_WIRE', PhaseType.THREE, WireDiameter.D_15, 18.5),
    new CurrentTableRecord('DIRECT_ON_WALL', 'MULTI_WIRE', PhaseType.THREE, WireDiameter.D_25, 25),
    new CurrentTableRecord('DIRECT_ON_WALL', 'MULTI_WIRE', PhaseType.THREE, WireDiameter.D_40, 34),
    new CurrentTableRecord('DIRECT_ON_WALL', 'MULTI_WIRE', PhaseType.THREE, WireDiameter.D_60, 43),
    new CurrentTableRecord('DIRECT_ON_WALL', 'MULTI_WIRE', PhaseType.THREE, WireDiameter.D_100, 60),
    new CurrentTableRecord('DIRECT_ON_WALL', 'MULTI_WIRE', PhaseType.THREE, WireDiameter.D_160, 81),
    new CurrentTableRecord('DIRECT_ON_WALL', 'MULTI_WIRE', PhaseType.THREE, WireDiameter.D_250, 102),
    new CurrentTableRecord('DIRECT_ON_WALL', 'MULTI_WIRE', PhaseType.THREE, WireDiameter.D_350, 126),
    new CurrentTableRecord('DIRECT_ON_WALL', 'MULTI_WIRE', PhaseType.THREE, WireDiameter.D_500, 153),
    new CurrentTableRecord('DIRECT_ON_WALL', 'MULTI_WIRE', PhaseType.THREE, WireDiameter.D_700, 195),
    new CurrentTableRecord('DIRECT_ON_WALL', 'MULTI_WIRE', PhaseType.THREE, WireDiameter.D_950, 236),
    new CurrentTableRecord('DIRECT_ON_WALL', 'MULTI_WIRE', PhaseType.THREE, WireDiameter.D_1200, 275),
  ];

  //sort (a,b) => a-b  <=== asc
  //sort (a,b) => b-a  <=== desc

  static findMinDiameterForLoad(wire: Wire, element: ElectricElement): Optional<number> {
    const tmp = this.applyCommonFilter(wire)
      .filter(v => element.getTotalCurrent() <= v.wireLoadCapacityCurrent)
      .sort((a, b) => a.wireLoadCapacityCurrent - b.wireLoadCapacityCurrent)
      .map(v => v.wireDiameter);
    return ArrayUtils.getFirst(tmp).map(v => v.value);
  }

  static findLoadCapacityByWire(wire: Wire): Optional<number> {
    return ArrayUtils.getFirst(this.applyCommonFilter(wire)
      .filter(v => wire.diameter.value === v.wireDiameter.value)
      .map(v => v.wireLoadCapacityCurrent));
  }

  static findSmallerWirePossible(wire: Wire, element: ElectricElement): Optional<number> {
    return ArrayUtils.getFirst(this.applyCommonFilter(wire)
      .filter(v => element.getTotalCurrent() < v.wireLoadCapacityCurrent && v.wireDiameter.value < wire.diameter.value)
      .sort((a, b) => a.wireLoadCapacityCurrent - b.wireLoadCapacityCurrent)
      .map(v => v.wireDiameter.value));
  }

  private static applyCommonFilter(wire: Wire): CurrentTableRecord[] {
    return this.table
      .filter(v => wire.placement === v.placement)
      .filter(v => wire.type === v.wireType)
      .filter(v => wire.phase.id === v.phaseType.id);
  }
}

