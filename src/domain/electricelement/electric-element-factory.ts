import { LoadElement } from "./concrete/load/load-element";
import { OvercurrentProtectionElement } from "./concrete/overcurrent-protection/overcurrent-protection-element";
import { RcdElement } from "./concrete/rcd/rcd-element";
import { TerminalElement } from "./concrete/terminal/terminal-element";
import { ElectricElement } from "./electric-element";
import type { AllElementType, ElectricElementType } from "./types";

export class ElectricElementFactory {
    static of(type: ElectricElementType, data: any): ElectricElement {
        switch (type) {
            case 'UNKNOWN':
                return ElectricElement.createFromDB(data);
            case 'LOAD':
                return LoadElement.createFromDB(data);
            case 'OVER_CURRENT_PROTECTION':
                return OvercurrentProtectionElement.createFromDB(data);
            case 'TERMINAL':
                return TerminalElement.createFromDB(data);
            case 'RCD':
                return RcdElement.createFromDB(data);
            default:
                throw new Error(`No of implementation for type: ${type}`);
        }
    }

    static empty(type: AllElementType, parentId: string | undefined, allElements: ElectricElement[]): ElectricElement {
        const existingCount = allElements.filter(v => v.type === type || type.startsWith(v.type)).length + 1; //plus 1, cause we want new element to be +1 than current
        switch (type) {
            case 'UNKNOWN':
                return ElectricElement.empty(parentId, existingCount);
            case 'LOAD':
                return LoadElement.empty(parentId, existingCount);
            case 'LOAD_LIGHT':
            case 'LOAD_OVEN':
            case 'LOAD_SOCKET':
            case 'LOAD_WASHING_MACHINE':
                return LoadElement.predefined({ parentId, existingCount, predefinedValue: type })
            case 'OVER_CURRENT_PROTECTION':
                return OvercurrentProtectionElement.predefined({ parentId, existingCount });
            case 'OVERCURRENT_LIGHT':
            case 'OVERCURRENT_SOCKET':
                return OvercurrentProtectionElement.predefined({ parentId, existingCount, predefinedValue: type });
            case 'TERMINAL':
                return TerminalElement.empty(parentId, existingCount);
            case 'RCD':
                return RcdElement.empty(parentId, existingCount);
            default:
                throw new Error(`No empty implementation for type: ${type}`);
        }
    }

    static fromRaw(data: { type: ElectricElementType }): ElectricElement {
        switch (data.type) {
            case 'UNKNOWN':
                return ElectricElement.createFromRaw(data);
            case 'LOAD':
                return LoadElement.createFromRaw(data);
            case 'OVER_CURRENT_PROTECTION':
                return OvercurrentProtectionElement.createFromRaw(data);
            case 'TERMINAL':
                return TerminalElement.createFromRaw(data);
            case 'RCD':
                return RcdElement.createFromRaw(data);
            default:
                throw new Error(`No empty implementation for type: ${data}`);
        }
    }
}