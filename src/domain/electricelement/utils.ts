import { ElectricElement } from "./electric-element";
import type { ElectricElementIdPair } from "./types";
import type { OrphansResult } from "../../hooks/element/use-element-api-mediator";

const setChildren = (
    parent: ElectricElement,
    groupedByParentId: Record<string, ElectricElement[]>
) => {
    const elements = groupedByParentId[parent.id];
    if (elements && elements.length > 0) {
        parent.children.push(...elements);
        parent.children.forEach((v) => {
            setChildren(v, groupedByParentId);
        });
    }
}

export const flatListToTree = (elements: ElectricElement[]): ElectricElement => {
    const groupedByParentId = elements.reduce((acc, next) => {
        const parentId = next.parentId ?? '';
        if (acc[parentId] === undefined)
            acc[parentId] = [];

        acc[parentId].push(next);
        return acc;
    }, {} as Record<string, ElectricElement[]>);

    const root = elements.find(v => v.parentId === null || v.parentId === undefined);
    if (root) {
        setChildren(root, groupedByParentId);
        return root;
    }

    throw new Error('No Root element found during flatting tree...');
}

export const groupPairsByType = (pairs: ElectricElementIdPair[]): OrphansResult => pairs.reduce((acc, next) => {
    if (acc[next.type] === undefined)
        acc[next.type] = [];

    acc[next.type].push(next.id);
    return acc;
}, {} as OrphansResult)