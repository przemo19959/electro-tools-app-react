import { type ReactNode, useState } from "react";
import type { Control, FieldValues } from "react-hook-form";
import { LoadElement } from "../../domain/electricelement/concrete/load/load-element";
import styled from "@emotion/styled";
import { FormTextField } from "../form-text-field/form-text-field";
import { IconButton, InputAdornment, TextField, Tooltip } from "@mui/material";
import HelpIcon from '@mui/icons-material/Help';
import { FormToggleGroup } from "../form-toggle-group/form-toggle-group";
import type { LoadConfig } from "../../domain/electricelement/concrete/load/load-config";
import ChangeHistoryIcon from '@mui/icons-material/ChangeHistory';
import StarIcon from '@mui/icons-material/Star';
import BoltIcon from '@mui/icons-material/Bolt';
import { FormCheckbox } from "../form-checkbox/form-checkbox";
import { LightPowerSelector } from "../light-power-selector/light-power-selector";

type LoadViewProps<T extends FieldValues,> = {
    load: LoadElement;
    control: Control<T, any, T>;
    voltageDropIndicator: ReactNode;
    onPowerChange?: (power: number) => void;
};

export const LoadView = <T extends FieldValues,>({
    load,
    control,
    voltageDropIndicator,
    onPowerChange,
}: LoadViewProps<T>) => {
    // const { t } = useTranslation();
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    return (
        <StyledCol>
            <StyledRow>
                <StyledTitle>{/*t('TITLES.LOAD')*/'todo'}</StyledTitle>
            </StyledRow>
            <StyledRow>
                <FormTextField
                    label={/*t('LOAD.DRAW_POWER')*/'todo'}
                    type='number'
                    control={control}
                    name={'drawPower'}
                    appendSlot={(<>
                        {voltageDropIndicator}
                        <IconButton onClick={() => setModalOpen(true)} size="small">
                            <BoltIcon color="info"/>
                        </IconButton>
                    </>)}
                    testID="draw_power_tf"
                />
                <FormTextField
                    label={/*t('LOAD.POWER_FACTOR')*/'todo'}
                    type='number'
                    control={control}
                    name={'powerFactor'}
                    tooltip={/*t('LOAD.POWER_FACTOR_INFO')*/'todo'}
                    testID="power_factor_tf"
                />
            </StyledRow>
            <StyledRow>
                <TextField
                    style={{ flex: 1 }}
                    size="small"
                    label={/*t('LOAD.LINE_CURRENT')*/'todo'}
                    value={`${load.getLineCurrent().toFixed(2)}`}
                    disabled
                    slotProps={{
                        input: {
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Tooltip title={/*t('LOAD.LINE_CURRENT_INFO')*/'todo'}>
                                        <HelpIcon />
                                    </Tooltip>
                                </InputAdornment>
                            )
                        }
                    }}
                    data-cy="line_current_tf"
                />
                {load.is3Phase() && (
                    <>
                        <TextField
                            style={{ flex: 1 }}
                            size="small"
                            label={/*t('LOAD.PHASE_CURRENT')*/'todo'}
                            value={`${load.getPhaseCurrent().toFixed(2)}`}
                            disabled
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Tooltip title={/*t('LOAD.PHASE_CURRENT_INFO')*/'todo'}>
                                                <HelpIcon />
                                            </Tooltip>
                                        </InputAdornment>
                                    )
                                }
                            }}
                            data-cy="phase_current_tf"
                        />
                        <FormToggleGroup<LoadConfig, T>
                            name="config"
                            control={control}
                            buttons={[
                                {
                                    value: 'DELTA',
                                    label: <ChangeHistoryIcon />
                                },
                                {
                                    value: 'STAR',
                                    label: <StarIcon />
                                }
                            ]}
                        />
                    </>
                )}
            </StyledRow>
            <FormCheckbox
                label={/*t('LOAD.IS_HIGH_CURRENT')*/'todo'}
                control={control}
                name='highStartCurrent'
            />
            <FormCheckbox
                label={/*t('LOAD.IS_ZEROED')*/'todo'}
                control={control}
                name='zeroed'
            />
            {modalOpen && (
                <LightPowerSelector onSelect={v => {
                    onPowerChange?.(v);
                    setModalOpen(false);
                }} />
                // t('COMMON.LIGHT_POWER_SELECTOR')
            )}
        </StyledCol>
    );
}

const StyledTitle = styled.div`
    width: 100%;
    text-align: center;
    font-weight: bold;
    font-size: 1rem;
`;

const StyledCol = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const StyledRow = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
    align-items: flex-start;
`;