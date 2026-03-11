import styled from "@emotion/styled";

export const StyledIndicatorText = styled.span`
    font-size: 10px;
    line-height: 14px;
    font-weight: bold;
    color: ${({ theme }) => theme.palette.primary.contrastText}
`