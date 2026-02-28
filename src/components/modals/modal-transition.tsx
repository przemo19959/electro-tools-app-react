import type { TransitionProps } from "@mui/material/transitions";
import Slide from "@mui/material/Slide";
import React from 'react';
import type { ReactElement } from 'react';

export const ModalTransition = React.forwardRef<HTMLDivElement, TransitionProps & { children: ReactElement<unknown, any> }>((
    props,
    ref,
) => {
    return <Slide direction="up" ref={ref} {...props} />;
});