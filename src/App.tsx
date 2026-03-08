import './App.css'
import { AppBar, Button, IconButton, Toolbar } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { Sidenav } from "./components/sidenav/Sidenav";
import { useState } from "react";
import { Outlet } from 'react-router';
import { OverlaySpinner } from './components/overlay-spinner/overlay-spinner';
import { AlertStack } from './components/alert-stack/alert-stack';
import styled from "@emotion/styled";

function App() {
  const [sidenavOpen, setSidenavOpen] = useState(true);

  return (
    <div>
      <StyledAppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => setSidenavOpen(!sidenavOpen)}
          >
            <MenuIcon />
          </IconButton>
          <div>News</div>
          <div style={{ flex: 1 }} />
          <Button color="primary">Login</Button>
        </Toolbar>
      </StyledAppBar>
      <StyledRow>
        <Sidenav open={sidenavOpen} />
        <StyledContainer>
          <Outlet />
          <AlertStack />
        </StyledContainer>
      </StyledRow>
      <OverlaySpinner />
    </div>
  )
}

export default App

const StyledAppBar = styled(AppBar)`
  height: 48px !important;
  
  .MuiToolbar-root {
    min-height: 48px !important;
  }
`;

const StyledRow = styled.div`
  display: flex;
  align-items: center;
`;

const StyledContainer = styled.div(({ theme }) => ({
  height: "calc(100vh - 48px)",
  overflow: "auto",
  display: "flex",
  flexDirection: "column",
  flex: 1,
  position: "relative",
  backgroundColor: theme.palette.background.default,
}));
