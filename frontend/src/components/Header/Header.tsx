import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Logout } from '@mui/icons-material';
import { useAuth0 } from '@auth0/auth0-react';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { Container } from '@mui/material';

const Header = () => {
  const { logout } = useAuth0();

  const handleLogout = () => {
    logout({
      logoutParams: { returnTo: window.location.origin },
    });
  };

  const redirectToHomePage = () => {
    // Check if current URL is home page, if not go to home page
    if (window.location.pathname !== '/') window.location.href = '/';
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Container>
          <Toolbar variant="dense">
            <AccountBalanceIcon sx={{ mr: 1 }} />
            <Typography
              variant="h5"
              component="div"
              sx={{ flexGrow: 1, cursor: 'pointer', fontFamily: 'Oleo Script' }}
              onClick={() => redirectToHomePage()}
            >
              Prestamo
            </Typography>
            <Button endIcon={<Logout />} color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
};

export default Header;
