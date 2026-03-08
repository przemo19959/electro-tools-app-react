import { PhaseType } from '../currenttable/enums/PhaseType';
import { WireDiameter } from '../currenttable/enums/WireDiameter';
import Optional from 'optional-js';
import type { CreateWireDto, ReadWireDto, UpdateWireDto } from '../../api/api';
import type { PlacementType } from '../currenttable/enums/PlacementType';
import type { WireType } from '../currenttable/enums/WireType';

export class Wire {
  constructor(
    public diameter: WireDiameter,
    public placement: PlacementType,
    public type: WireType,
    public phase: PhaseType,
    public length: number,
  ) {
  }

  clone() {
    return new Wire(this.diameter, this.placement, this.type, this.phase, this.length);
  }

  toCreate(): CreateWireDto {
    return {
      diameter: this.diameter.key,
      placement: this.placement,
      type: this.type,
      phase: this.phase.id,
      length: this.length,
    }
  }

  toUpdate(): UpdateWireDto {
    return {
      diameter: this.diameter.key,
      placement: this.placement,
      type: this.type,
      phase: this.phase.id,
      length: this.length,
    }
  }

  static createFromDB(data: ReadWireDto) {
    return new Wire(
      WireDiameter.of(data.diameter) ?? WireDiameter.D_15,
      data.placement ?? 'IN_PIPE_ON_WALL',
      data.type ?? 'MULTI_WIRE',
      PhaseType.of(data.phase) ?? PhaseType.ONE,
      data.length ?? 5,
    );
  }

  static createFromRaw(data: any) {
    if (data) {
      return new Wire(
        data.diameter,
        data.placement,
        data.type,
        data.phase,
        data.length,
      );
    }
    return this.empty();
  }

  static empty() {
    return new Wire(WireDiameter.D_15, 'IN_PIPE_ON_WALL', 'MULTI_WIRE', PhaseType.ONE, 5);
  }

  /**
   * Percentage value of drop. For 1% and starting voltage 230[V] we have 230-2.3=227.7[V]
   */
  voltageDrop(power: number) {
    return (this.phase.voltageDropCoefficient * this.length * power) / (56 * this.diameter.value * this.phase.voltageSquared);
  }

  /**
   * Get matching diameter of wire for given load power so that resulting voltage drop will equal second argument. This method
   * helps to determine required wire diameter to meet expected voltage drop at given load power.
   */
  diameterForDrop(power: number, expectedVoltageDrop: number): Optional<WireDiameter> {
    const minDiameter = (this.phase.voltageDropCoefficient * this.length * power) / (56 * expectedVoltageDrop * this.phase.voltageSquared);
    return Optional.ofNullable(WireDiameter.VALUES.find(v => v.value >= minDiameter));
  }

  lengthForDrop(power: number, expectedVoltageDrop: number): number {
    return (expectedVoltageDrop * 56 * this.phase.voltageSquared * this.diameter.value) / (this.phase.voltageDropCoefficient * power);
  }

  /**
   * math formula for impedance Z=1.25*(2*L)/(56*D) => L/(22.4*D). Here specifically length L is taken twice (2*L), cause we want to get impedance
   * of wire of returning path also. It's about path of current from terminal to load and way back.
   * 
   * Generally formula for resistivity is R=(p*L)/S, which is quite similar. Aditinally we have formula R(T)=Ro[1+alpha*(T-To)]. 
   * To is regular temperature i.e. 25 degress and Ro is resistance of element at that temperature (calculated by first formula).
   * When we have short event, current is high and so temperature may raise rapidlly. We assume it will reach 80 degrees very fast.
   * Also alpha is temperature coeff for materials. For Cu it equals ~4e-3. 
   * 
   * If we put all that into formula we get R(T)=Ro[1+4e-3 * (80-25)] and then R(T)=1.22Ro=1.22*(p*L)/S.
   * p is resistivity of element. For Cu it equals 1.77e-8. Reverse of that is condictivity, and it equals 56e6. Also in formula line
   * above cross-section S is given in meters. For wires we use mm unit (1[m]=1e3[mm]). So finally we get R(T)~1.22*L/(56e6*D*e-6), where
   * now D is in square mm unit. And then we get R(T)~1.22*L/(56*D), which is formula used at the beginning.
   */
  shortImpedance(bothWays = true) {
    return ((bothWays ? 2.5 : 1.25) * this.length) / (56 * this.diameter.value);
  }


  /**
   * Power loss dissipated on wire, when current runs through it. That power loss should be minimal, otherwise supply must deliver it.
   * If supply does not account for that loss, then less real power will reach actual load, that power will be lost on wire.
   */
  powerLoss(current: number) {
    //here impedance is used for 80 degrees (at short). Normally temperature will be lower, so power losses. So we assume worst case scenerio
    return current * current * this.shortImpedance(false);
  }

  /**
   * Transforming formula for impedance we get D = L/(22.4*Z)
   */
  diameterForShortImpedance(impedance: number): Optional<WireDiameter> {
    const minDiameter = this.length / (22.4 * impedance);
    return Optional.ofNullable(WireDiameter.VALUES.find(v => v.value >= minDiameter));
  }

  /**
   * Formula after transform -> L=D*22.4*Z
   */
  lengthForShortImpedance(impedance: number): number {
    return this.diameter.value * 22.4 * impedance;
  }

  labelForDiff() {
    return `${this.phase.id === 'THREE' ? '3x' : ''}${this.diameter.value}mm\u00B2`;
  }

  getLabel() {
    return `${this.labelForDiff()} ${this.length}m`;
  }

  phaseVoltageCoefficient() {
    return this.phase.phaseCount * 230;
  }

  isDifferent(other: Wire): boolean {
    if (this.diameter.key !== other.diameter.key
      || this.placement !== other.placement
      || this.type !== other.type
      || !this.phase.equals(other.phase)
    ) return true;
    return false;
  }
}
