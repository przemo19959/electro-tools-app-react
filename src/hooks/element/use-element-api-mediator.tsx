import { useTerminalElementApi } from "./use-terminal-element-api";
import { ElectricElement } from "../../domain/electricelement/electric-element";
import { type ElectricElementType } from "../../domain/electricelement/types";
import { useElectricElementApi } from "./use-electric-element-api"
import { useLoadElementApi } from "./use-load-element-api";
import { useRcdElementApi } from "./use-rcd-element-api";
import { useOvercurrentProtectionElementApi } from "./use-overcurrent-protection-element-api";

export type OrphansResult = Record<ElectricElementType, string[]>;

export const useElementApiMediator = () => {
    const generic = useElectricElementApi();
    const load = useLoadElementApi();
    const overcurrent = useOvercurrentProtectionElementApi();
    const terminal = useTerminalElementApi();
    const rcd = useRcdElementApi();

    const create = (projectId: string, element: ElectricElement) => {
        switch (element.type) {
            case 'UNKNOWN': return generic.create(element.toCreateDto(projectId));
            case 'LOAD': return load.create(element.toCreateDto(projectId));
            case 'OVER_CURRENT_PROTECTION': return overcurrent.create(element.toCreateDto(projectId));
            case 'TERMINAL': return terminal.create(element.toCreateDto(projectId));
            case 'RCD': return rcd.create(element.toCreateDto(projectId));
        }
    }
    
    const update = (element: ElectricElement) => {
        switch (element.type) {
            case 'UNKNOWN': return generic.update(element.id, element.toUpdateDto());
            case 'LOAD': return load.update(element.id, element.toUpdateDto());
            case 'OVER_CURRENT_PROTECTION': return overcurrent.update(element.id, element.toUpdateDto());
            case 'TERMINAL': return terminal.update(element.id, element.toUpdateDto());
            case 'RCD': return rcd.update(element.id, element.toUpdateDto());
        }
    }

    return {
        create,
        update,
    }
}