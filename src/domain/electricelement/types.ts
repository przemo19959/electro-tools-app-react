import type { ReadAbstractElementDto } from "../../api/api";
import type { OvercurrentProtectionElement } from "./concrete/overcurrent-protection/overcurrent-protection-element";
import { TerminalType } from "./concrete/terminal/terminal-type";
import type { ElectricElement } from "./electric-element";

export type ElectricElementType = NonNullable<ReadAbstractElementDto['elementType']>;
export const ELECTRIC_ELEMENT_TYPES: ElectricElementType[] = [
    'UNKNOWN',
    'LOAD',
    'OVER_CURRENT_PROTECTION',
    'TERMINAL',
    'RCD',
];

/**
 * Load sub types apart from load properties will predefine wire settings. This will
 * require extra logic during create/edit element process, that's why i put those in separate array. 
 */
export const LOAD_ELEMENT_SUB_TYPES = [
    'LOAD_LIGHT',
    'LOAD_SOCKET',
    'LOAD_WASHING_MACHINE',
    'LOAD_OVEN',
] as const;

/**
 * This subtypes must always be prefixed with ELECTRIC_ELEMENT_TYPES value
 */
export const ELECTRIC_ELEMENT_SUB_TYPES = [
    'OVERCURRENT_LIGHT',
    'OVERCURRENT_SOCKET',
    ...LOAD_ELEMENT_SUB_TYPES,
] as const;

export const ALL_ELECTRIC_ELEMENT_TYPES = [...ELECTRIC_ELEMENT_TYPES, ...ELECTRIC_ELEMENT_SUB_TYPES].sort();

export type LoadElementSubType = typeof LOAD_ELEMENT_SUB_TYPES[number];
export type ElectricElementSubType = typeof ELECTRIC_ELEMENT_SUB_TYPES[number];
export type AllElementType = ElectricElementType | ElectricElementSubType;

export type ElectricElementTreeData = {
    elements: ElectricElement[];
    root: ElectricElement;
};

export type ElectricElementIdPair = {
    id: string;
    type: ElectricElementType;
}

export type ElectricContextVariant = 'OWN' | 'PARENT' | 'TOTAL';

export type ElectricElementContext = {
    parentVoltageDrop: number;
    ownVoltageDrop: number;
    noLoad: boolean;
    parentShortImpedance: number;
    ownShortImpedance: number;
    ownLength: number;
    parentLength: number;
    closestOp: OvercurrentProtectionElement | undefined;
    terminalType: TerminalType;
}

export const EMPTY_CONTEXT = (): ElectricElementContext => ({
    parentVoltageDrop: 0,
    ownVoltageDrop: 0,
    noLoad: true,
    parentShortImpedance: 0,
    ownShortImpedance: 0,
    ownLength: 0,
    parentLength: 0,
    closestOp: undefined,
    terminalType: TerminalType.TN_C,
});

export type VoltageDropContextData = Pick<ElectricElementContext, 'ownVoltageDrop' | 'parentVoltageDrop' | 'noLoad'>;

export const getDrop = (variant: ElectricContextVariant, context: Omit<VoltageDropContextData, 'noLoad'>): number => {
    switch (variant) {
        case 'OWN': return context.ownVoltageDrop;
        case 'PARENT': return context.parentVoltageDrop;
        case 'TOTAL': return context.ownVoltageDrop + context.parentVoltageDrop;
    }
}

export type ImpedanceContextData = Pick<ElectricElementContext, 'ownShortImpedance' | 'parentShortImpedance'>;

export const getImpedance = (variant: ElectricContextVariant, context: ImpedanceContextData): number => {
    switch (variant) {
        case 'OWN': return context.ownShortImpedance;
        case 'PARENT': return context.parentShortImpedance;
        case 'TOTAL': return context.ownShortImpedance + context.parentShortImpedance;
    }
}

export const TYPE_TO_DEFAULT_LABEL: Record<AllElementType, string> = {
    UNKNOWN: 'Basic',
    LOAD: 'Load',
    LOAD_LIGHT: 'Load',
    LOAD_OVEN: 'Load',
    LOAD_SOCKET: 'Load',
    LOAD_WASHING_MACHINE: 'Load',
    OVER_CURRENT_PROTECTION: 'MCB',
    OVERCURRENT_LIGHT: 'MCB',
    OVERCURRENT_SOCKET: 'MCB',
    RCD: 'RCD',
    TERMINAL: 'Terminal',
}
