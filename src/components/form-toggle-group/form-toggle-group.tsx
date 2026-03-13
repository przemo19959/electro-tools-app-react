import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import type { ReactNode } from "react";
import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import { createTestIDsForComponent, joinTestIDs } from "../../utils/common-utils";

const FormToggleGroup_TestIDs = createTestIDsForComponent('FormToggleGroup', [
    'button',
]);

type FormToggleGroupProps<T, R extends FieldValues> = {
    name: string;
    control: Control<R, any, R>;
    buttons: {
        value: T;
        label: ReactNode;
    }[];
    idMapper?: (v: T) => string;
}

export const FormToggleGroup = <T, R extends FieldValues>({
    name,
    control,
    buttons,
    idMapper = (v: T) => String(v),
}: FormToggleGroupProps<T, R>) => {
    return (
        <Controller
            name={name as Path<R>}
            control={control}
            render={({ field }) => {
                return (
                    <ToggleButtonGroup
                        size="small"
                        color="primary"
                        value={idMapper(field.value)}
                        exclusive
                        onChange={(_e, value) => {
                            const item = buttons.find(v => idMapper(v.value) === value);
                            console.log(item, value);

                            if (item) {
                                field.onChange(item.value);
                            }
                        }}
                    >
                        {buttons.map(v => {
                            const id = idMapper(v.value);
                            return (
                                <ToggleButton value={id} data-cy={joinTestIDs(FormToggleGroup_TestIDs.button, id)}>
                                    {v.label}
                                </ToggleButton>
                            );
                        })}
                    </ToggleButtonGroup>
                );
            }}
        />
    )
}