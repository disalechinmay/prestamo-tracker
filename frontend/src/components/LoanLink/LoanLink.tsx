import React from 'react';
import { formatMoney } from '../../utils/accessories';
import Emoji from '../Emoji/Emoji';
import { Box, Typography } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface Loan {
  uid: string;
  amount: number;
  oppositeParty: string;
}

interface LoanLinkProps {
  loan: Loan;
  type: 'borrower' | 'lender';
}

const LoanLink = ({
  loan: { uid, amount, oppositeParty },
  type,
}: LoanLinkProps) => {
  return (
    <Box
      key={uid}
      sx={{
        pt: 1,
        pb: 1,
        transition: 'all 0.2s ease-in-out',
        border: '1px solid white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pr: 1,
        '&:hover': {
          border: '1px solid lightgrey',
          cursor: 'pointer',
          borderRadius: 1,
          paddingLeft: 2,
          transition: 'all 0.2s ease-in-out',
        },
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Typography variant="h6">
          <Emoji symbol="₹" label="rupee" size="h6" />
          {formatMoney(amount)}
        </Typography>
        <Typography variant="body2">
          {type === 'borrower' ? 'From' : 'To'} {oppositeParty}
        </Typography>
      </Box>

      <ChevronRightIcon />
    </Box>
  );
};

export default LoanLink;
