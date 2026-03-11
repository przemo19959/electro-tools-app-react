import type { ReactNode } from "react";
import { ImpedanceIndicator } from "../indicators/impedance-indicator";
import { PowerLossIndicator } from "../indicators/power-loss-indicator";
import { VoltageDropIndicator } from "../indicators/voltage-drop-indicator";
import { RawWireView, type RawWireViewProps } from "./raw-wire-view";
import type { ElectricElementContext } from "../../domain/electricelement/types";
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import styled from "@emotion/styled";
import type { FieldValues } from "react-hook-form";

enum WireView_TestIDs {
    voltageIndicator = 'WireView_voltageIndicator',
    impedanceIndicator = 'WireView_impedanceIndicator',
}

type WireViewProps<T extends FieldValues> = Pick<RawWireViewProps<T>, 'control' | 'errors'> & {
    // control: Control<T, any, T>;
    // errors: FieldErrors<T>;
    voltageDropIndicator: ReactNode;
    context: ElectricElementContext;
    impedanceIndicator: ReactNode;
    withoutParent?: boolean;
    loss: number;
    shortCurrentIndicator: ReactNode;
};

export const WireView = <T extends FieldValues,>({
    control,
    errors,
    voltageDropIndicator,
    context,
    impedanceIndicator,
    withoutParent = false,
    loss,
    shortCurrentIndicator,
}: WireViewProps<T>) => (
    <RawWireView
        control={control}
        errors={errors}
        titlePrependSlot={<>
            <PowerLossIndicator loss={loss} />
            {shortCurrentIndicator}
        </>}
        titleAppendSlot={!withoutParent && (
            <>
                <ArrowCircleUpIcon />
                <VoltageDropIndicator {...context} variant='PARENT' testID={WireView_TestIDs.voltageIndicator} />
                <ImpedanceIndicator {...context} variant='PARENT' testID={WireView_TestIDs.impedanceIndicator} />
            </>
        )}
        fieldIndicatorSlot={<StyledRow>
            {voltageDropIndicator}
            {impedanceIndicator}
        </StyledRow>} />
);

const StyledRow = styled.div`
    display: flex;
    align-items: center;
`