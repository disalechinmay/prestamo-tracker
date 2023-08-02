import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const LoginPage = () => {
  const {
    loginWithRedirect,
    isAuthenticated,
    isLoading: isAuth0Loading,
  } = useAuth0();

  if (isAuth0Loading) return <div>Loading...</div>;
  if (isAuthenticated) window.location.href = '/';

  return (
    <div>
      LoginPage
      <button onClick={() => loginWithRedirect()}>Login</button>
    </div>
  );
};

export default LoginPage;
