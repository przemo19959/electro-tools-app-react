import { IndicatorWrapper } from "./indicator-wrapper";
import { ElectricElement } from "../../domain/electricelement/electric-element";
import { useTheme } from "@mui/material";
import { StyledIndicatorText } from "./styles";

type ShortCurrentIndicatorProps = {
    element: ElectricElement;
};

export const ShortCurrentIndicator = ({
    element,
}: ShortCurrentIndicatorProps) => {
    const opFireCurrent = element.context.closestOp?.getFireCurrentByClass() ?? 0;
    // const { t } = useTranslation();
    const { palette } = useTheme();
    const shortCurrent = element.shortCurrent();
    const isValid = opFireCurrent !== 0 && shortCurrent >= opFireCurrent;

    if (element.type === 'TERMINAL') return null;

    // t(`OVERCURRENT.${opFireCurrent !== 0 ? 'SHORT_CURRENT_INFO1' : 'SHORT_CURRENT_INFO2'}`,
    //             {
    //                 opFireCurrent,
    //                 shortCurrent: shortCurrent.toFixed(0),
    //             })

    return (
        <IndicatorWrapper
            color={isValid ? palette.warning.light : palette.error.main}
            tooltipContent={'TODO'}
        >
            <StyledIndicatorText >I<sub>sh</sub>[A]</StyledIndicatorText>
            <StyledIndicatorText >{shortCurrent.toFixed(0)}</StyledIndicatorText>
        </IndicatorWrapper>
    );
}