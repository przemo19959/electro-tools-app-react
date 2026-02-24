import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#69F0AE",
      light: "#7CF2B8",
      dark: "#52D79A",
      contrastText: "#0F1512",
    },
    secondary: {
      main: "#B388FF",
      light: "#C3A1FF",
      dark: "#8E6AC8",
      contrastText: "#150F1F",
    },
    background: {
      default: "#1A1A1A",
      paper: "#1E1E1E",
    },
    text: {
      primary: "#F3F6F8",
      secondary: "#B8C0C7",
      disabled: "#8A939B",
    },
    divider: "#33373D",
    info: { main: "#64B5F6" },
    success: { main: "#69F0AE" },
    warning: { main: "#FFCB6B" },
    error: { main: "#FF6B81" },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#252526",
          borderBottom: "1px solid #33373D",
          boxShadow: "none",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#1E1E1E",
          border: "1px solid #33373D",
        },
      },
    },
    MuiButton: {
      defaultProps: {
        variant: "contained",
      },
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#252526",
        },
      },
    },
  },
});

export type MyTheme = typeof theme;