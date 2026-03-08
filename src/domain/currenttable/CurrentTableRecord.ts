import {PhaseType} from './enums/PhaseType';
import type { PlacementType } from './enums/PlacementType';
import {WireDiameter} from './enums/WireDiameter';
import type { WireType } from './enums/WireType';

export class CurrentTableRecord {
  constructor(public placement: PlacementType,
              public wireType: WireType,
              public phaseType: PhaseType,
              public wireDiameter: WireDiameter,
              public wireLoadCapacityCurrent: number) {
  }
}
