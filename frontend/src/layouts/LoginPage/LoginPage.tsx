import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Box, Button, Container, Typography } from '@mui/material';
import Emoji from '../../components/Emoji/Emoji';
import { ArrowRightAlt, BuildCircle } from '@mui/icons-material';
import AirIcon from '@mui/icons-material/Air';
import ShieldIcon from '@mui/icons-material/Shield';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import HistoryIcon from '@mui/icons-material/History';
const IllustrationPath =
  require('../../assets/illustrations/LandingPageIllustration.svg') as any;

const LoginPage = () => {
  const {
    loginWithRedirect,
    isAuthenticated,
    isLoading: isAuth0Loading,
  } = useAuth0();

  const featuresStyle = {
    display: 'flex',
    alignItems: 'center',
    mb: 1,
  };

  if (isAuth0Loading) return <div>Loading...</div>;
  if (isAuthenticated) window.location.href = '/';

  return (
    <Container
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: {
          xs: 'inherit',
          sm: 'inherit',
          md: '100vh',
          lg: '100vh',
          xl: '100vh',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
          border: '1px solid rgba(0, 0, 0, 0.12)',
          borderRadius: {
            xs: '15px',
            sm: '15px',
            md: '15px',
            lg: '15px',
            xl: '15px',
          },
          p: {
            xs: 1,
            sm: 1,
            md: 3,
            lg: 3,
            xl: 3,
          },
          mt: 1,
          mb: 1,
          flexDirection: {
            xs: 'column-reverse',
            sm: 'column-reverse',
            md: 'row',
            lg: 'row',
            xl: 'row',
          },
        }}
      >
        <Box
          sx={{
            flex: 1,
            p: 3,
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontFamily: 'Oleo Script',
              fontSize: {
                xs: '3rem',
                sm: '3rem',
                md: '4rem',
              },
            }}
            color="primary"
          >
            Prestamo
          </Typography>
          <Typography variant="h5" color="initial">
            Manage Loans to Friends and Family with Ease!
          </Typography>
          <br />
          <Typography>
            Are you tired of keeping track of loans you've given to friends and
            family members on sticky notes or in your head? Prestamo is here to
            simplify your life and help you manage all your loans in one place.
          </Typography>

          <Box sx={{ mt: 3 }}>
            <Box sx={featuresStyle}>
              <AirIcon color="primary" />
              &nbsp;&nbsp; Effortless Loan Tracking
            </Box>

            <Box sx={featuresStyle}>
              <ShieldIcon color="primary" />
              &nbsp;&nbsp; Secure and Confidential
            </Box>

            <Box sx={featuresStyle}>
              <NotificationsActiveIcon color="primary" />
              &nbsp;&nbsp; Automated Reminders
            </Box>

            <Box sx={featuresStyle}>
              <HistoryIcon color="primary" />
              &nbsp;&nbsp; Detailed Loan History
            </Box>

            <Box sx={featuresStyle}>
              <BuildCircle color="primary" />
              &nbsp;&nbsp; Customizable Settings
            </Box>
          </Box>

          <Button
            sx={{
              mt: 3,
            }}
            onClick={() => loginWithRedirect()}
            variant="outlined"
            size="large"
            endIcon={<ArrowRightAlt />}
          >
            Jump Right In
          </Button>
        </Box>

        <Box
          sx={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            p: 3,
          }}
        >
          <img width={'100%'} src={IllustrationPath?.default} />
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
