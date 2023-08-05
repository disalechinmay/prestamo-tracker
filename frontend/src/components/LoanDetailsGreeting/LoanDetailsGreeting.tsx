import { Box, IconButton, Typography } from '@mui/material';
import React from 'react';
import Emoji from '../Emoji/Emoji';
import { ArrowBack } from '@mui/icons-material';

interface LoanDetailsGreetingProps {
  loanId: string;
}

const LoanDetailsGreeting = ({ loanId }: LoanDetailsGreetingProps) => {
  const goToHomePage = () => {
    window.location.href = '/';
  };

  return (
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
        Details for Loan #{loanId}
        <Emoji label="grinning-face" symbol="🔎" size="h6" />
      </Typography>
    </Box>
  );
};

export default LoanDetailsGreeting;
