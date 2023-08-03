import React from 'react';
import { ILoanExtended } from '../../types';
import { useRecoilState } from 'recoil';
import { accessTokenAtom, userAtom } from '../../state';
import { Box, Button, Divider, Typography } from '@mui/material';
import Emoji from '../Emoji/Emoji';

interface LoanDetailsRepaymentsLoanDetailsProps {
  loan: ILoanExtended;
  isBorrower: boolean;
}

const LoanDetailsRepayments = ({
  loan,
  isBorrower,
}: LoanDetailsRepaymentsLoanDetailsProps) => {
  // Recoil State
  const [accessToken, setAccessToken] = useRecoilState(accessTokenAtom);
  const [user, setUser] = useRecoilState(userAtom);

  return (
    <Box>
      <Box sx={{ m: 1, mt: 3 }}>
        <Typography
          variant="h6"
          color="initial"
          sx={{ display: 'inline-block' }}
        >
          Repayments Made So Far
        </Typography>
        <Button variant="outlined" size="small" sx={{ float: 'right' }}>
          New
        </Button>
      </Box>
      <Divider />
      {loan.repayments.length === 0 && (
        <Box sx={{ m: 1 }}>
          <Typography variant="body1" color="initial">
            No repayments made yet.{' '}
            <Emoji symbol="😔" label="sad" size="body1" />
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default LoanDetailsRepayments;
