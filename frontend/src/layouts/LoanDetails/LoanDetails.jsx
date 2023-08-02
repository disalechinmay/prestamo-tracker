import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useParams } from 'react-router-dom';

const LoanDetails = () => {
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

  useEffect(() => {
    if (!isAuth0Loading) {
      if (!isAuthenticated) window.location.href = '/login';
      //   else initializeAccessToken();
    }
  }, [isAuth0Loading]);

  return <div>LoanDetails - {id}</div>;
};

export default LoanDetails;
