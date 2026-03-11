import { useTheme } from "@mui/material";
import { IndicatorWrapper } from "./indicator-wrapper";
import { StyledIndicatorText } from "./styles";

type PowerLossIndicatorProps = {
    loss: number;
}

export const PowerLossIndicator = ({
    loss,
}: PowerLossIndicatorProps) => {
    // const { t } = useTranslation();
    const { palette } = useTheme();

    // t('WIRE.POWER_LOSS_INF0')
    return (
        <IndicatorWrapper
            color={palette.warning.main}
            tooltipContent={'TODO'}
        >
            <StyledIndicatorText>P<sub>loss</sub>[W]</StyledIndicatorText>
            <StyledIndicatorText>{loss.toFixed(2)}</StyledIndicatorText>
        </IndicatorWrapper>
    );
};