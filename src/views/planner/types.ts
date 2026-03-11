import type { NodeChange, Node } from "@xyflow/react";
import type { UpdateBasicElementPositionDto } from "../../api/api";
import * as z from 'zod';
import { PLACEMENT_TYPE_VALUES } from "../../domain/currenttable/enums/PlacementType";
import { WIRE_TYPE_VALUES } from "../../domain/currenttable/enums/WireType";
import { PHASE_TYPE_VALUES } from "../../domain/currenttable/enums/PhaseType";
import { ELECTRIC_ELEMENT_TYPES, type ElectricElementType } from "../../domain/electricelement/types";
import { LOAD_CONFIG_VALUES } from "../../domain/electricelement/concrete/load/load-config";
import { CLASS_TO_AMPERAGE_VALUES } from "../../domain/electricelement/concrete/overcurrent-protection/types";
import { TERMINAL_TYPE_VALUES } from "../../domain/electricelement/concrete/terminal/terminal-type";
import type { OvercurrentProtectionTypeKey } from "../../domain/electricelement/concrete/overcurrent-protection/overcurrent-protection-type";
import { RCD_NOMINAL_VALUES } from "../../domain/electricelement/concrete/rcd/types";

export const getPositionDragEndChanges = (changes: NodeChange<Node>[]): UpdateBasicElementPositionDto[] => changes
    .map(v => {
        if (v.type === 'position' && v.dragging === false) {
            return ({
                elementId: v.id,
                ...v.position,
            }) as UpdateBasicElementPositionDto
        }
        return {};
    }).filter(v => Boolean(v.elementId));

export const WIRE_SCHEMA = z.object({
    wire: z.object({
        diameter: z.object({
            value: z.number(),
            key: z.string(),
        }).required(),
        placement: z.enum(PLACEMENT_TYPE_VALUES),
        type: z.enum(WIRE_TYPE_VALUES),
        phase: z.object({
            id: z.enum(PHASE_TYPE_VALUES),
        }).required(),
        length: z.number().min(0),
        maxCapacity: z.number().min(1, 'Unresolved'), //FIXME: change message, cause it's not clear enough
    }),
}).required();

export type WireForm = z.infer<typeof WIRE_SCHEMA>;

const BASIC_SCHEMA = z.object({
    label: z.string().min(1, 'Field is required'),
    type: z.enum(ELECTRIC_ELEMENT_TYPES),
}).required();

export type BasicForm = z.infer<typeof BASIC_SCHEMA>;

export const LOAD_SCHEMA = z.object({
    drawPower: z.number(),
    powerFactor: z.number().min(0).max(1),
    highStartCurrent: z.boolean().optional(),
    zeroed: z.boolean().optional(),
    config: z.enum(LOAD_CONFIG_VALUES),
}).required();

export type LoadForm = z.infer<typeof LOAD_SCHEMA>;

const OVERCURRENT_SCHEMA = z.object({
    overCurrentProtectionType: z.object({
        name: z.string(),
        onValue: z.number(),
    }).required(),
    amperage: z.number().min(.5),
})
    .required()
    .refine(schema => CLASS_TO_AMPERAGE_VALUES[schema.overCurrentProtectionType.name as OvercurrentProtectionTypeKey]?.includes(schema.amperage));

const TERMINAL_SCHEMA = z.object({
    terminalType: z.object({
        type: z.enum(TERMINAL_TYPE_VALUES),
    }),
}).required();

const RCD_SCHEMA = z.object({
    nominalCurrent: z.number().min(1),
    diffCurrent: z.number().min(1),
})
    .required()
    .refine(schema => RCD_NOMINAL_VALUES.includes(schema.nominalCurrent));

export const routeElementToSchema = (type: ElectricElementType) => {
    switch (type) {
        case 'UNKNOWN': return BASIC_SCHEMA;
        case 'LOAD': return BASIC_SCHEMA.and(LOAD_SCHEMA);
        case 'OVER_CURRENT_PROTECTION': return BASIC_SCHEMA.and(OVERCURRENT_SCHEMA);
        case 'TERMINAL': return BASIC_SCHEMA.and(TERMINAL_SCHEMA);
        case 'RCD': return BASIC_SCHEMA.and(RCD_SCHEMA);
        default: throw new Error(`No schema for type ${type}`);
    }
}