import type { PropsWithChildren } from "react";
import { css, Tooltip } from "@mui/material";
import styled from "@emotion/styled";

type IndicatorWrapperProps = {
    color: string;
    tooltipContent: string;
} & PropsWithChildren;

export const IndicatorWrapper = ({
    color,
    tooltipContent,
    children,
}: IndicatorWrapperProps) => {
    return (
        <Tooltip title={tooltipContent}>
            <StyledIndicator color={color}>
                {children}
            </StyledIndicator>
        </Tooltip>
    );
}

const StyledIndicator = styled.div<{ color: string }> `
    display: flex;
    flex-direction: column;
    border-radius: 5px;
    padding-left: 3px;
    padding-right: 3px;
    margin: 5px;
    ${({ color }) => css`
        background-color: ${color};
    `}
`;
