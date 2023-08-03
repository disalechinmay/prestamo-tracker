import React, { useState } from 'react';
import { ILoanExtended } from '../../types';
import { useRecoilState } from 'recoil';
import { accessTokenAtom, userAtom } from '../../state';
import { Box, Button, Divider, Typography } from '@mui/material';
import Emoji from '../Emoji/Emoji';
import NewRepaymentDialog from '../NewRepaymentDialog/NewRepaymentDialog';
import { formatMoney } from '../../utils/accessories';
import moment from 'moment';

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

  const [newRepaymentDialogOpen, setNewRepaymentDialogOpen] =
    useState<boolean>(false);

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
        <Button
          variant="outlined"
          size="small"
          sx={{ float: 'right' }}
          onClick={() => setNewRepaymentDialogOpen(true)}
        >
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

      {loan.repayments.map((repayment) => (
        <Box
          key={repayment.uid}
          sx={{
            m: 1,
            mb: 3,
            p: 1,
            borderLeft: '5px solid transparent',
            '&:hover': {
              borderLeft: '5px solid #3f51b5',
            },
          }}
        >
          <Typography variant="overline">Repayment #{repayment.uid}</Typography>
          <Typography variant="h6" color="initial">
            <Emoji symbol="₹" label="start-date" size="h6" />
            {formatMoney(repayment.amount)}
          </Typography>
          <Typography variant="body1" color="initial" sx={{ display: 'flex' }}>
            <Box sx={{ mr: 3 }}>
              <Emoji symbol="📅" label="start-date" size="body1" />
              {moment(repayment.date).format('MMMM DD, YYYY')}
            </Box>
            <Box>
              <Emoji symbol="💬" label="comment" size="body1" />
              {repayment.comments}
            </Box>
          </Typography>
        </Box>
      ))}

      <NewRepaymentDialog
        open={newRepaymentDialogOpen}
        setOpen={(v) => setNewRepaymentDialogOpen(v)}
        loanId={loan.uid}
      />
    </Box>
  );
};

export default LoanDetailsRepayments;
