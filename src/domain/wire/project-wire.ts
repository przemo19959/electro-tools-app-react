import { PhaseType } from "../currenttable/enums/PhaseType";
import type { PlacementType } from "../currenttable/enums/PlacementType";
import { WireDiameter } from "../currenttable/enums/WireDiameter";
import type { WireType } from "../currenttable/enums/WireType";
import { Wire } from "./wire";

export class ProjectWire extends Wire {
    constructor(
        public projectId: number,
        public diameter: WireDiameter,
        public placement: PlacementType,
        public type: WireType,
        public phase: PhaseType,
        public length: number,
    ) {
        super(diameter, placement, type, phase, length);
    }

    static createFromDB(data: any) {
        return new ProjectWire(
            data.project_id,
            WireDiameter.of(data.diameter) ?? data.diameter,
            data.placement,
            data.wire_type,
            PhaseType.of(data.phase) ?? data.phase,
            data.length,
        );
    }

    static createFromRaw(data: any): ProjectWire {
        return new ProjectWire(
            data.projectId,
            data.diameter,
            data.placement,
            data.type,
            data.phase,
            data.length,
        );
    }
}