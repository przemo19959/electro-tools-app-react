import { PhaseType } from "../currenttable/enums/PhaseType";
import { WireDiameter } from "../currenttable/enums/WireDiameter";
import type { LoadElementSubType } from "../electricelement/types";
import { Wire } from "./wire";

const SOCKET_PREDEFINITION: Wire = Wire.createFromRaw({
    diameter: WireDiameter.D_25,
    placement: 'UNDER_PLASTER',
    type: 'MULTI_WIRE',
    phase: PhaseType.ONE,
} as Wire);

export const WIRE_PREDEFINED_MAP: Record<LoadElementSubType, Wire> = {
    'LOAD_LIGHT': Wire.createFromRaw({
        diameter: WireDiameter.D_15,
        placement: 'UNDER_PLASTER',
        type: 'MULTI_WIRE',
        phase: PhaseType.ONE,
    } as Wire),
    'LOAD_SOCKET': SOCKET_PREDEFINITION,
    'LOAD_WASHING_MACHINE': SOCKET_PREDEFINITION,
    'LOAD_OVEN': SOCKET_PREDEFINITION,
};