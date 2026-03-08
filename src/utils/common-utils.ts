export class CommonUtils {
    static rangeOverlap(r1: [number, number], r2: [number, number]): boolean {
        return r1[0] <= r2[1] && r2[0] <= r1[1];
    }

    static removeAlphabet(value: string) {
        const tmp = value.replaceAll(/[^\d.-]/g, '');
        if (tmp.includes('.')) {
            const parts = tmp.split('.');
            return [parts[0], '.', ...parts.slice(1)].join('');
        }

        return tmp;
    };
}

export const joinTestIDs = (...ids: (string | undefined)[]) => {
    return ids.filter(v => v).join(':');
}

export const createTestIDsForComponent = <C extends string, F extends string>(
    componentName: C,
    fields: readonly F[]
) => {
    return fields.reduce((acc, field) => {
        acc[field] = `${componentName}_TestIDs_${field}`;
        return acc;
    }, {} as Record<F, `${C}_TestIDs_${F}`>);
}
