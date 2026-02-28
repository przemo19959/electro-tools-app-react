import styled from "@emotion/styled";
import { CircularProgress } from "@mui/material";
import { useAppSelector } from "../../store/hooks";
import { isZero } from "./overlay-spinner-slice";

export const OverlaySpinner = () => {
    const hide = useAppSelector(isZero)

    if (hide) {
        return null;
    }

    return (
        <StyledOverlay>
            <StyledCircularProgress />
        </StyledOverlay>
    );
};

const StyledCircularProgress = styled(CircularProgress)`
    position: relative;
    top: 50%;
`;

const StyledOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    text-align: center;
`;