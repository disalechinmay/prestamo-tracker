import { Alert, Box, IconButton, Typography } from '@mui/material';
import React from 'react';
import Emoji from '../Emoji/Emoji';
import { ArrowBack } from '@mui/icons-material';
import { ILoan } from '../../types';

interface LoanDetailsGreetingProps {
  loan: ILoan;
}

const LoanDetailsGreeting = ({ loan }: LoanDetailsGreetingProps) => {
  const goToHomePage = () => {
    window.location.href = '/';
  };

  return (
    <Box>
      <Box sx={{ mt: 3, ml: 1, display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={() => goToHomePage()}>
          <ArrowBack />
        </IconButton>
        <Typography
          variant="h6"
          sx={{
            display: 'inline-block',
          }}
        >
          Details for Loan #{loan.uid}
          <Emoji label="grinning-face" symbol="🔎" size="h6" />
        </Typography>
      </Box>

      {loan.allPaid && (
        <Box sx={{ m: 1 }}>
          <Alert
            sx={{ border: '1px solid rgba(0, 0, 0, 0.12)' }}
            color="success"
          >
            <Typography variant="body1" color="initial">
              Congratulations! You have paid off this loan.{' '}
              <Emoji symbol="🎉" label="party-popper" size="body1" />
            </Typography>
          </Alert>
        </Box>
      )}
    </Box>
  );
};

export default LoanDetailsGreeting;
