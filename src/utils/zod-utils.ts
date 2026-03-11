
import type { FieldValues, ResolverOptions, ResolverResult } from 'react-hook-form';
import { ZodType } from 'zod';

export const customZodResolver = async <T extends FieldValues>(
    values: T,
    _context: any,
    _options: ResolverOptions<T>,
    schema: ZodType,
): Promise<ResolverResult<T>> => {
    const result = schema.safeParse(values);

    if (result.success) {
        return {
            values: result.data as T,
            errors: {},
        };
    }

    const formattedErrors: Record<string, any> = {};

    for (const issue of result.error.issues) {
        const path = issue.path.join('.') || '_global';
        if (!formattedErrors[path]) {
            formattedErrors[path] = {
                type: issue.code,
                message: issue.message,
                params: (issue as any).params ?? {},
            };
        }
    }

    return {
        values: {},
        errors: formattedErrors,
    };
};