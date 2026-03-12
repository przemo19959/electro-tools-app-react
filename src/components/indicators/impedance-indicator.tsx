import { IndicatorWrapper } from "./indicator-wrapper";
import { type ImpedanceContextData, type ElectricContextVariant, type ElectricElementContext, getImpedance } from "../../domain/electricelement/types";
import { createTestIDsForComponent, joinTestIDs } from "../../utils/common-utils";
import { useTheme } from "@mui/material";
import { StyledIndicatorText } from "./styles";
import { useTranslation } from "react-i18next";

export const ImpedanceIndicator_TestIDs = createTestIDsForComponent('ImpedanceIndicator', [
    'text',
]);

type ImpedanceIndicatorProps = ImpedanceContextData & {
    variant?: ElectricContextVariant;
    testID: string;
} & Pick<ElectricElementContext, 'closestOp'>;

export const ImpedanceIndicator = ({
    ownShortImpedance,
    parentShortImpedance,
    variant = 'OWN',
    testID,
    closestOp,
}: ImpedanceIndicatorProps) => {
    const { t } = useTranslation();
    const { palette } = useTheme();
    const impedance = getImpedance(variant, { ownShortImpedance, parentShortImpedance });
    const shortImpedance = closestOp !== undefined ? 230 / closestOp.getFireCurrentByClass() : 0;
    const isValid = closestOp === undefined || impedance <= shortImpedance;


    return (
        <IndicatorWrapper
            color={isValid ? palette.info.light : palette.error.main}
            tooltipContent={t('WIRE.SHORT_IMPEDANCE_INF0',
                {
                    ownImpedance: ownShortImpedance.toFixed(2),
                    parentImpedance: parentShortImpedance.toFixed(2),
                    totalImpedance: (ownShortImpedance + parentShortImpedance).toFixed(2),
                },
            )}
        >
            <StyledIndicatorText>{'Z[\u2126]'}</StyledIndicatorText>
            <StyledIndicatorText
                data-cy={joinTestIDs(testID, ImpedanceIndicator_TestIDs.text)}
            >
                {impedance.toFixed(2)}
            </StyledIndicatorText>
        </IndicatorWrapper>
    );
};