import type { ReactNode } from "react";
import type { Control, FieldErrors, FieldValues } from "react-hook-form";
import { PhaseType } from "../../domain/currenttable/enums/PhaseType";
import { type PlacementType, PLACEMENT_TYPE_VALUES } from "../../domain/currenttable/enums/PlacementType";
import { WireDiameter } from "../../domain/currenttable/enums/WireDiameter";
import { WIRE_TYPE_VALUES } from "../../domain/currenttable/enums/WireType";
import styled from "@emotion/styled";
import { FormTextField } from "../form-text-field/form-text-field";
import { FormSelect } from "../form-select/form-select";

export const MAX_CAPACITY_FORM_KEY = 'wire.maxCapacity';

enum RawWireView_TestIDs {
    placement = 'placement',
    type = 'type',
    phase = 'phase',
    diameter = 'diameter',
    length = 'length',
    capacity = 'capacity',
};

export type RawWireViewProps<T extends FieldValues> = {
    control: Control<T, any, T>;
    errors: FieldErrors<T>;
    titlePrependSlot?: ReactNode;
    titleAppendSlot?: ReactNode;
    fieldIndicatorSlot?: ReactNode;
}

export const RawWireView = <T extends FieldValues,>({
    control,
    errors,
    titlePrependSlot,
    titleAppendSlot,
    fieldIndicatorSlot,
}: RawWireViewProps<T>) => {
    return (
        <StyledCol>
            <StyledRow style={{gap: 0}}>
                {titlePrependSlot}
                <StyledTitle>{/*t('TITLES.WIRE')*/'todo'}</StyledTitle>
                {titleAppendSlot}
            </StyledRow>
            <StyledRow>
                <FormSelect<PlacementType, T>
                    label={/*t('WIRE.PLACEMENT')*/ 'todo'}
                    items={PLACEMENT_TYPE_VALUES}
                    textMapper={e => /*t('WIRE.PLACEMENTS.' + e)*/ e}
                    control={control}
                    errors={errors}
                    name={'wire.placement'}
                    testID={RawWireView_TestIDs.placement}
                />
                <FormSelect
                    label={/*t('WIRE.TYPE')*/ 'todo'}
                    items={WIRE_TYPE_VALUES}
                    textMapper={e => /*t('WIRE.TYPES.' + e)*/ e}
                    control={control}
                    errors={errors}
                    name={'wire.type'}
                    tooltip={/*t('WIRE.TYPE_INFO')*/ 'todo'}
                    testID={RawWireView_TestIDs.type}
                />
            </StyledRow>
            <StyledRow>
                <FormSelect label={/*t('WIRE.PHASE')*/ 'todo'}
                    items={PhaseType.VALUES}
                    textMapper={e => /*t('WIRE.PHASES.' + e?.id)*/ e.id}
                    control={control}
                    errors={errors}
                    name={'wire.phase'}
                    idMapper={v => v.id}
                    testID={RawWireView_TestIDs.phase}
                />
                <FormSelect
                    label={/*t('WIRE.DIAMETER')*/ 'todo'}
                    items={WireDiameter.VALUES}
                    control={control}
                    textMapper={v => `${v?.value}`}
                    errors={errors}
                    name={'wire.diameter'}
                    idMapper={v => v.key}
                    appendSlot={fieldIndicatorSlot}
                    testID={RawWireView_TestIDs.diameter}
                />
            </StyledRow>
            <StyledRow>
                <FormTextField
                    label={/*t('WIRE.LENGTH')*/'todo'}
                    type='number'
                    control={control}
                    name='wire.length'
                    tooltip={/*t('WIRE.LENGTH_INFO')*/ 'todo'}
                    appendSlot={fieldIndicatorSlot}
                    testID={RawWireView_TestIDs.length}
                />
                <FormTextField
                    label={/*t('WIRE.MAX_CAPACITY')*/'todo'}
                    type='number'
                    control={control}
                    name={MAX_CAPACITY_FORM_KEY}
                    tooltip={/*t('WIRE.MAX_CAPACITY_INFO')*/ 'todo'}
                    disabled
                    testID={RawWireView_TestIDs.capacity}
                />
            </StyledRow>
        </StyledCol>
    );
}

const StyledTitle = styled.div`
    width: 100%;
    text-align: center;
    font-weight: bold;
    font-size: 1rem;
    flex: 1;
`;

const StyledRow = styled.div`
    display: flex;
    flex-direction: row;
    gap: 1rem;
    align-items: flex-start;
`;

const StyledCol = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;



