import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { Alert, Box, Container } from '@mui/material';
import { backendServerUrl, getLoan } from '../../utils/api';
import { ILoan, ILoanExtended } from '../../types';
import { useRecoilState } from 'recoil';
import { accessTokenAtom, userAtom } from '../../state';
import Loader from '../../components/Loader/Loader';
import LoanDetailsComponent from '../../components/LoanDetails/LoanDetails';

const LoanDetails = () => {
  // Auth0
  // Auth0
  const {
    user: userFromAuth0,
    isAuthenticated,
    isLoading: isAuth0Loading,
    getAccessTokenSilently,
    getAccessTokenWithPopup,
  } = useAuth0();

  // Get ID from URL slug /loan/:id
  const { id } = useParams();

  // Recoil State
  const [accessToken, setAccessToken] = useRecoilState(accessTokenAtom);
  const [user, setUser] = useRecoilState(userAtom);

  // Local State
  const [error, setError] = useState<string>('');
  const [loan, setLoan] = useState<ILoanExtended | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isBorrower, setIsBorrower] = useState<boolean>(false);

  // Effects
  useEffect(() => {
    if (!isAuth0Loading && accessToken && isLoading) {
      initializePage();
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
      token = (await getAccessTokenSilently({
        authorizationParams: {
          audience: backendServerUrl,
          scope: 'read:profile',
        },
      })) as string;

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

  const initializePage = async () => {
    // Check if id is null
    if (id === null) {
      setError('Invalid loan ID');
      return;
    }

    // Get loan details
    let loanDetails = null;
    try {
      loanDetails = await getLoan(accessToken as string, id as string);
    } catch (e) {
      setError('Something went wrong. Please try again. [' + e + ']');
      setIsLoading(false);
      return;
    }

    if (!loanDetails || !('borrowerId' in loanDetails)) {
      setError('Loan not found');
      return;
    }

    // Check if user is borrower
    if (loanDetails.borrowerId === userFromAuth0?.sub) setIsBorrower(true);

    setLoan(loanDetails);
    setIsLoading(false);
    console.log(loanDetails);
  };

  return (
    <div>
      <Header />
      <Container>
        {isLoading && <Loader />}

        {error && (
          <Box
            sx={{
              width: '100%',
              mt: 5,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Alert
              severity="error"
              sx={{
                width: {
                  xs: '100%',
                  sm: '100%',
                  md: '70%',
                },
              }}
            >
              {error}
            </Alert>
          </Box>
        )}

        {loan && <LoanDetailsComponent loan={loan} isBorrower={isBorrower} />}
      </Container>
    </div>
  );
};

export default LoanDetails;
