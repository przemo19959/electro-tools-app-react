import { css, useTheme } from "@mui/material";
import { joinTestIDs } from "../../utils/common-utils";
import styled from "@emotion/styled";

type AvgEfficiencyTouchableProps = {
    active: boolean;
    onClick?: () => void;
    testID?: string;
}

enum AvgEfficiencyTouchable_TestIDs {
    touchable = 'AvgEfficiencyTouchable_touchable',
}

export const AvgEfficiencyTouchable = ({
    active,
    onClick,
    testID,
}: AvgEfficiencyTouchableProps) => {
    const { palette } = useTheme();

    if (!active) return null;

    return (
        <StyledIndicator
            color={palette.error.main}
            onClick={onClick}
            data-cy={joinTestIDs(testID, AvgEfficiencyTouchable_TestIDs.touchable)}
        >
            <StyledText>Avg</StyledText>
        </StyledIndicator>
    );
}

const StyledIndicator = styled.div<{ color: string }> `
    display: flex;
    flex-direction: column;
    border-radius: 5px;

    ${({ color }) => css`
        background-color: ${color};
    `}
`;

const StyledText = styled.span`
    font-size: 10px;
    font-weight: bold;
`;