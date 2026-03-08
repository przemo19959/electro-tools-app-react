import styled from "@emotion/styled";
import { alpha } from "@mui/material/styles";
import { NavLink } from "react-router";

type SidenavProps = {
  open: boolean;
}

export const Sidenav = ({
  open,
}: SidenavProps) => {
  if (!open) return null;

  return (
    <StyledContainer>
      <NavLink to="/">Home</NavLink>
      <NavLink to="/projects">Projects</NavLink>
      <NavLink to="/planner" onClick={e => e.preventDefault()}>Planner</NavLink>
    </StyledContainer>
  );
};

const StyledContainer = styled.div(({ theme }) => ({
  width: 200,
  backgroundColor: theme.palette.background.paper,
  borderRight: `1px solid ${theme.palette.divider}`,
  display: "flex",
  flexDirection: "column",
  height: "calc(100vh - 48px)",
  padding: "0.5rem",
  gap: "0.25rem",
  "& a": {
    color: theme.palette.text.secondary,
    textDecoration: "none",
    borderRadius: 6,
    padding: "0.5rem 0.75rem",
  },
  "& a:hover": {
    backgroundColor: alpha(theme.palette.secondary.main, 0.16),
    color: theme.palette.text.primary,
  },
  "& a.active": {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    fontWeight: 600,
  },
}));
