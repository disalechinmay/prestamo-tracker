import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Header from '../../components/Header/Header';
import { useRecoilState } from 'recoil';
import { accessTokenAtom, userAtom } from '../../state';
import { backendServerUrl, fetchUserInformation } from '../../utils/api';
import Loader from '../../components/Loader/Loader';
import Greeting from '../../components/Greeting/Greeting';
import Container from '@mui/material/Container';
import MoneyBorrowed from '../../components/MoneyBorrowed/MoneyBorrowed';
import { Box } from '@mui/material';
import MoneyLent from '../../components/MoneyLent/MoneyLent';

const HomePage = () => {
  // Auth0
  const {
    user: userFromAuth0,
    isAuthenticated,
    isLoading: isAuth0Loading,
    getAccessTokenSilently,
    getAccessTokenWithPopup,
  } = useAuth0();

  // Recoil State
  const [accessToken, setAccessToken] = useRecoilState(accessTokenAtom);
  const [user, setUser] = useRecoilState(userAtom);

  // Local State
  const [isLoading, setIsLoading] = React.useState(true);

  // Effects
  useEffect(() => {
    if (!isAuth0Loading && accessToken && isLoading) {
      initializeHomePage();
    }
  }, [accessToken]);

  useEffect(() => {
    if (!isAuth0Loading) {
      if (!isAuthenticated) window.location.href = '/login';
      else initializeAccessToken();
    }
  }, [isAuth0Loading]);

  const initializeAccessToken = async () => {
    if (!accessToken) {
      let token = null;
      try {
        token = (await getAccessTokenSilently({
          authorizationParams: {
            audience: backendServerUrl,
            scope: 'read:profile',
          },
        })) as string;
      } catch (ignored) {}

      if (token) setAccessToken(token);
      else {
        token = (await getAccessTokenWithPopup({
          authorizationParams: {
            audience: backendServerUrl,
            scope: 'read:profile',
          },
        })) as string;
        setAccessToken(token);
      }
    }
  };

  const initializeHomePage = async () => {
    const userInformation = await fetchUserInformation(
      accessToken as string,
      userFromAuth0?.sub as string,
      userFromAuth0?.email as string
    );
    setUser(userInformation);
    setIsLoading(false);
  };

  if (isAuth0Loading || isLoading) return <Loader containerHeight="95vh" />;
  return (
    <div>
      <Header />

      <Container>
        <Greeting />

        <Box
          sx={{
            mt: 1,
            display: {
              xs: 'block',
              md: 'flex',
            },
          }}
        >
          <Box flex={1} m={1}>
            <MoneyBorrowed />
          </Box>
          <Box flex={1} m={1}>
            <MoneyLent />
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default HomePage;
