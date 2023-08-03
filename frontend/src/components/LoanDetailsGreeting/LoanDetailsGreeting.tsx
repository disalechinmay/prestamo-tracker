import { Box, Typography } from '@mui/material';
import React from 'react';
import Emoji from '../Emoji/Emoji';

interface LoanDetailsGreetingProps {
  loanId: string;
}

const LoanDetailsGreeting = ({ loanId }: LoanDetailsGreetingProps) => {
  return (
    <Box sx={{ mt: 3, ml: 1 }}>
      <Typography variant="h6">
        Details for Loan #{loanId}
        <Emoji label="grinning-face" symbol="🔎" size="h6" />
      </Typography>
    </Box>
  );
};

export default LoanDetailsGreeting;
