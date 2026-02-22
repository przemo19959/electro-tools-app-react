import type { AlertProps } from "@mui/material";

export type AlertItem = {
    id: number;
    type: AlertProps['severity'];
    message: string;
};