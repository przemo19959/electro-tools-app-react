import styled from "@emotion/styled";
import { Alert } from "@mui/material";
import type { AlertItem } from "./types";
import { useAppSelector } from "../../store/hooks";
import { alerts } from "./alert-stack-slice";

export const AlertStack = () => {
    const items: AlertItem[] = useAppSelector(alerts);

    return (
        <StyledCol>
            {items.map((alert, index) => (
                <StyledAlert key={index} variant="filled" severity={alert.type}>
                    {alert.message}
                </StyledAlert>
            ))}
        </StyledCol>
    );
};

const StyledCol = styled.div`
    position: absolute;
    top: 2rem;
    left: 50%;

    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const StyledAlert = styled(Alert)`
    transform: translateX(-50%);
    z-index:9999;
`;