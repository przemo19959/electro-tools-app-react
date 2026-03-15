import { useForm } from "react-hook-form"
import { LightKind, LIGHT_KIND_KEY_VALUES, type RoomType, ROOM_TYPE_VALUES, type LightKindKey } from "./types"
import * as z from 'zod';
import { useEffect, useState } from "react"
import { AvgEfficiencyIndicator } from "./avg-efficiency-indicator"
import { customZodResolver } from "../../utils/zod-utils";
import { FormSelect } from "../form-select/form-select";
import { FormTextField } from "../form-text-field/form-text-field";
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import styled from "@emotion/styled";
import { ModalTransition } from "../modals/modal-transition";
import { useTranslation } from "react-i18next";
import { createTestIDsForComponent } from "../../utils/common-utils";

const EFFICIENCY_FIELD_KEY = 'efficiency';
const LIGHT_SELECTOR_SCHEMA = z.object({
    roomType: z.enum(ROOM_TYPE_VALUES),
    lightKind: z.enum(LIGHT_KIND_KEY_VALUES),
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

const LightPowerSelector_TestIDs = createTestIDsForComponent('LightPowerSelector', [
    'roomType',
    'lightKind',
    'efficiency',
    'avgTouchable',
    'roomArea',
    'requiredPower',
    'acceptBtn',
]);

type LightPowerSelectorForm = z.infer<typeof LIGHT_SELECTOR_SCHEMA>

type LightPowerSelectorProps = {
    initialLightKind?: LightKind,
    initialRoomArea?: number;
    initialRoomType?: RoomType;
    onSelect?: (power: number) => void;
    onCancel: () => void;
}

export const LightPowerSelector = ({
    initialRoomArea = 5,
    initialLightKind = LightKind.VALUES[0],
    initialRoomType = ROOM_TYPE_VALUES[0],
    onSelect,
    onCancel,
}: LightPowerSelectorProps) => {
    const { t } = useTranslation();

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
        setIsEffOutOfRange(max < eff || eff < min || eff !== lightKind.average());
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
        <Dialog
            open
            slots={{
                transition: ModalTransition,
            }}
            keepMounted
            onClose={onCancel}
        >
            <DialogTitle data-cy="light_power_selector_title">
                {t('COMMON.SELECT_LIGHT_POWER_TITLE')}
            </DialogTitle>
            <StyledDialogContent>
                <form>
                    <StyledCol>
                        <StyledRow>
                            <FormSelect<RoomType, LightPowerSelectorForm>
                                label={t('COMMON.ROOM_TYPE')}
                                items={ROOM_TYPE_VALUES as unknown as RoomType[]}
                                textMapper={e => t('COMMON.ROOMS.' + e)}
                                control={control}
                                errors={errors}
                                name="roomType"
                                testID={LightPowerSelector_TestIDs.roomType}
                            />
                        </StyledRow>
                        <StyledRow>
                            <FormSelect<LightKindKey, LightPowerSelectorForm>
                                label={t('COMMON.LIGHT_KIND')}
                                items={LIGHT_KIND_KEY_VALUES}
                                textMapper={e => t('COMMON.LIGHT_KINDS.' + e)}
                                control={control}
                                errors={errors}
                                name="lightKind"
                                testID={LightPowerSelector_TestIDs.lightKind}
                            />
                            <FormTextField
                                label={t('COMMON.LIGHT_EFFICIENCY')}
                                type='number'
                                control={control}
                                name={EFFICIENCY_FIELD_KEY}
                                testID={LightPowerSelector_TestIDs.efficiency}
                                tooltip={t('COMMON.LIGHT_EFFICIENCY_TOOLTIP')}
                                appendSlot={
                                    <AvgEfficiencyIndicator
                                        active={isEffOutOfRange}
                                        onClick={setAvgEfficencyByCurrentLightKind}
                                        testID={LightPowerSelector_TestIDs.avgTouchable}
                                    />
                                }
                            />
                        </StyledRow>
                        <StyledRow>
                            <FormTextField
                                label={t('COMMON.ROOM_AREA')}
                                type='number'
                                control={control}
                                name='roomArea'
                                testID={LightPowerSelector_TestIDs.roomArea}
                            />
                            <TextField
                                style={{ flex: 1 }}
                                size="small"
                                label={t('COMMON.REQUIRED_LOAD_POWER')}
                                value={`${requiredPower.toFixed(2)}`}
                                disabled
                                data-cy={LightPowerSelector_TestIDs.requiredPower}
                            />
                        </StyledRow>
                    </StyledCol>
                </form>
            </StyledDialogContent>
            <DialogActions>
                <Button onClick={onCancel} variant='outlined' color='secondary' data-cy="light_power_selector_cancel_btn">
                    {t('COMMON.CANCEL')}
                </Button>
                <Button
                    onClick={() => onSelect?.(Number(requiredPower.toFixed(2)))}
                    color="primary"
                    disabled={!isValid}
                    data-cy={LightPowerSelector_TestIDs.acceptBtn}
                >
                    {t('COMMON.SELECT')}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

const StyledCol = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const StyledRow = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
`;

const StyledDialogContent = styled(DialogContent)`
    padding-top: 20px !important;
`;
