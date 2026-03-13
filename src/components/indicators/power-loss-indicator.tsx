import { useTheme } from "@mui/material";
import { IndicatorWrapper } from "./indicator-wrapper";
import { StyledIndicatorText } from "./styles";
import { useTranslation } from "react-i18next";

type PowerLossIndicatorProps = {
    loss: number;
}

export const PowerLossIndicator = ({
    loss,
}: PowerLossIndicatorProps) => {
    const { t } = useTranslation();
    const { palette } = useTheme();

    return (
        <IndicatorWrapper
            color={palette.warning.main}
            tooltipContent={t('WIRE.POWER_LOSS_INF0')}
        >
            <StyledIndicatorText>P<sub>loss</sub>[W]</StyledIndicatorText>
            <StyledIndicatorText data-cy="power_loss_indicator_value">{loss.toFixed(2)}</StyledIndicatorText>
        </IndicatorWrapper>
    );
};