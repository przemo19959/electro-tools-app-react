import { useForm } from "react-hook-form"
import { LightKind, LIGHT_KIND_KEY_VALUES, type RoomType, ROOM_TYPE_VALUES, type LightKindKey } from "./types"
import * as z from 'zod';
import { useEffect, useState } from "react"
import { AvgEfficiencyTouchable } from "./avg-efficiency-touchable"
import { customZodResolver } from "../../utils/zod-utils";
import { FormSelect } from "../form-select/form-select";
import { FormTextField } from "../form-text-field/form-text-field";
import { Button, TextField } from "@mui/material";
import styled from "@emotion/styled";

const EFFICIENCY_FIELD_KEY = 'efficiency';
const LIGHT_SELECTOR_SCHEMA = z.object({
    roomType: z.enum(ROOM_TYPE_VALUES),
    lightKind: z.enum(LIGHT_KIND_KEY_VALUES),
    // lightKind: z.object({
    //     key: z.enum(LIGHT_KIND_KEY_VALUES),
    //     efficiency: z.object({
    //         min: z.number(),
    //         max: z.number(),
    //     }),
    // }).required(),
    efficiency: z.number(),
    roomArea: z.number().refine(v => v >= 0, { message: 'VALIDATION.GREATER_THAN', params: { value: 0 } }),
})
    .required()
    .superRefine((schema, ctx) => {
        const lk = LightKind.of(schema.lightKind);
        if (lk === undefined) return;

        const { efficiency: { min, max } } = lk;
        const valid = max >= schema.efficiency && schema.efficiency >= min;

        if (!valid) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'VALIDATION.OUT_OF_RANGE',
                path: [EFFICIENCY_FIELD_KEY],
                params: {
                    min,
                    max,
                }
            });
        }
    });

enum LightPowerSelector_TestIDs {
    roomType = 'roomType',
    lightKind = 'lightKind',
    efficiency = 'efficiency',
    avgTouchable = 'avgTouchable',
    roomArea = 'roomArea',
    requiredPower = 'requiredPower',
    acceptBtn = 'acceptBtn',
};

type LightPowerSelectorForm = z.infer<typeof LIGHT_SELECTOR_SCHEMA>

type LightPowerSelectorProps = {
    initialLightKind?: LightKind,
    initialRoomArea?: number;
    initialRoomType?: RoomType;
    onSelect?: (power: number) => void;
}

export const LightPowerSelector = ({
    initialRoomArea = 5,
    initialLightKind = LightKind.VALUES[0],
    initialRoomType = ROOM_TYPE_VALUES[0],
    onSelect,
}: LightPowerSelectorProps) => {
    // const { t } = useTranslation();
    //FIXME: this must be modal

    const [requiredPower, setRequiredPower] = useState<number>(initialLightKind.requiredPowerByArea(initialRoomArea, initialRoomType));
    const [isEffOutOfRange, setIsEffOutOfRange] = useState<boolean>(false);

    const {
        control,
        formState: { errors, isValid },
        watch,
        setValue,
        getValues,
        trigger,
    } = useForm<LightPowerSelectorForm>({
        defaultValues: {
            roomType: initialRoomType,
            lightKind: initialLightKind.key,
            efficiency: initialLightKind.average(),
            roomArea: initialRoomArea,
        },
        resolver: (v, c, o) => customZodResolver(v, c, o, LIGHT_SELECTOR_SCHEMA),
        mode: 'onChange',
    });

    const onFormChange = (value: LightPowerSelectorForm, changedFieldName: string) => {
        const lightKind = LightKind.of(value.lightKind);
        if (lightKind === undefined) throw new Error();

        const eff = value.efficiency ?? 0;
        setRequiredPower(lightKind.requiredPowerByArea(value.roomArea!, value.roomType ?? 'RESIDENTIAL', eff));

        const { efficiency: { min, max } } = lightKind;
        setIsEffOutOfRange(max < eff || eff < min)
        if (changedFieldName !== EFFICIENCY_FIELD_KEY) {
            trigger(EFFICIENCY_FIELD_KEY);
        }
    }

    useEffect(() => {
        const subscription = watch((_, { name }) => {
            if (name) {
                onFormChange(getValues(), name);
            }
        });
        return () => subscription.unsubscribe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [watch]);

    const setAvgEfficencyByCurrentLightKind = () => {
        const lightKind = LightKind.of(getValues('lightKind'));
        if (lightKind === undefined) throw new Error();
        setValue(EFFICIENCY_FIELD_KEY, lightKind.average(), { shouldValidate: true });
    }

    return (
        <StyledCol>
            <StyledRow>
                <FormSelect<RoomType, LightPowerSelectorForm>
                    label={/*t('COMMON.ROOM_TYPE')*/'todo'}
                    items={ROOM_TYPE_VALUES as unknown as RoomType[]}
                    textMapper={e => /*t('COMMON.ROOMS.' + e)*/e}
                    control={control}
                    errors={errors}
                    name="roomType"
                    testID={LightPowerSelector_TestIDs.roomType}
                />
            </StyledRow>
            <StyledRow>
                <FormSelect<LightKindKey, LightPowerSelectorForm>
                    label={/*t('COMMON.LIGHT_KIND')*/ 'todo'}
                    items={LIGHT_KIND_KEY_VALUES}
                    textMapper={e => /*t('COMMON.LIGHT_KINDS.' + e?.key)*/ e}
                    control={control}
                    errors={errors}
                    name="lightKind"
                    testID={LightPowerSelector_TestIDs.lightKind}
                />
                <FormTextField
                    label={/*t('COMMON.LIGHT_EFFICIENCY')*/'todo'}
                    type='number'
                    control={control}
                    name={EFFICIENCY_FIELD_KEY}
                    testID={LightPowerSelector_TestIDs.efficiency}
                    appendSlot={
                        <AvgEfficiencyTouchable
                            active={isEffOutOfRange}
                            onClick={setAvgEfficencyByCurrentLightKind}
                            testID={LightPowerSelector_TestIDs.avgTouchable}
                        />
                    }
                />
            </StyledRow>
            <StyledRow>
                <FormTextField
                    label={/*t('COMMON.ROOM_AREA')*/'todo'}
                    type='number'
                    control={control}
                    name='roomArea'
                    testID={LightPowerSelector_TestIDs.roomArea}
                />
                <TextField
                    style={{ flex: 1 }}
                    label={/*t('COMMON.REQUIRED_LOAD_POWER')*/'todo'}
                    value={`${requiredPower.toFixed(2)}`}
                    disabled
                    data-cy={LightPowerSelector_TestIDs.requiredPower}
                />
                <Button
                    color="primary"
                    title={/*t('COMMON.SELECT')*/'todo'}
                    disabled={!isValid}
                    data-cy={LightPowerSelector_TestIDs.acceptBtn}
                    onClick={() => onSelect?.(Number(requiredPower.toFixed(2)))}
                >from title</Button>
            </StyledRow>
        </StyledCol>
    )
}

const StyledCol = styled.div`
    display: flex;
    flex-direction: column;
`;

const StyledRow = styled.div`
    display: flex;
    align-items: center;
`;
