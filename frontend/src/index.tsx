import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import { RecoilRoot } from 'recoil';
import { Auth0Provider } from '@auth0/auth0-react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './layouts/HomePage/HomePage';
import LoginPage from './layouts/LoginPage/LoginPage';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { ThemeProvider } from '@mui/material';
import { theme } from './assets/theme';
import LoanDetails from './layouts/LoanDetails/LoanDetails';

const router = createBrowserRouter([
  {
    path: '*',
    element: <HomePage />,
  },
  {
    path: '/loan/:id',
    element: <LoanDetails />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <RecoilRoot>
      <Auth0Provider
        domain={process.env.REACT_APP_AUTH0_DOMAIN as string}
        clientId={process.env.REACT_APP_AUTH0_CLIENT_ID as string}
        authorizationParams={{
          redirect_uri: window.location.origin,
          audience: process.env.REACT_APP_AUTH0_AUDIENCE,
        }}
        cacheLocation="localstorage"
      >
        <ThemeProvider theme={theme}>
          <RouterProvider router={router} />
        </ThemeProvider>
      </Auth0Provider>
    </RecoilRoot>
  </React.StrictMode>
);
