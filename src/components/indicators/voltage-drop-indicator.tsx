import { IndicatorWrapper } from "./indicator-wrapper";
import { type VoltageDropContextData, type ElectricContextVariant, getDrop } from "../../domain/electricelement/types";
import { createTestIDsForComponent, joinTestIDs } from "../../utils/common-utils";
import { useTheme } from "@mui/material";
import { StyledIndicatorText } from "./styles";
import { useTranslation } from "react-i18next";

export const VoltageDropIndicator_TestIDs = createTestIDsForComponent('VoltageDropIndicator', [
    'text',
]);

type VoltageDropIndicatorProps = VoltageDropContextData & {
    variant?: ElectricContextVariant;
    testID: string;
};

export const VoltageDropIndicator = ({
    ownVoltageDrop,
    parentVoltageDrop,
    noLoad,
    variant = 'OWN',
    testID,
}: VoltageDropIndicatorProps) => {
    const { t } = useTranslation();
    const { palette } = useTheme();

    if (noLoad) return null;

    const drop = getDrop(variant, { ownVoltageDrop, parentVoltageDrop });

    return (
        <IndicatorWrapper
            color={drop < 3 ? palette.primary.main : palette.error.main}
            tooltipContent={t('WIRE.VOLTAGE_DROP_INF0',
                {
                    ownVoltageDrop: ownVoltageDrop.toFixed(2),
                    parentVoltageDrop: parentVoltageDrop.toFixed(2)
                }
            )}
        >
            <StyledIndicatorText>{'\u0394U'}<sub>%</sub></StyledIndicatorText>
            <StyledIndicatorText
                data-cy={joinTestIDs(testID, VoltageDropIndicator_TestIDs.text)}
            >
                {drop.toFixed(2)}
            </StyledIndicatorText>
        </IndicatorWrapper>
    );
};
