import React from 'react';
import { ILoanExtended, LoanCreator, LoanStatus } from '../../types';
import { Alert, Box, Button, Typography } from '@mui/material';
import Emoji from '../Emoji/Emoji';
import { useRecoilState } from 'recoil';
import { accessTokenAtom } from '../../state';
import { updateLoanStatus } from '../../utils/api';

interface LoanDetailsAcceptanceAlertProps {
  loan: ILoanExtended;
  isBorrower: boolean;
}

const LoanDetailsAcceptanceAlert = ({
  loan,
  isBorrower,
}: LoanDetailsAcceptanceAlertProps) => {
  // Recoil State
  const [accessToken, setAccessToken] = useRecoilState(accessTokenAtom);

  const handleLoanAcceptance = async () => {
    await updateLoanStatus(
      accessToken as string,
      loan.uid,
      LoanStatus.APPROVED
    );
    window.location.reload();
  };

  const handleLoanRejection = async () => {
    await updateLoanStatus(
      accessToken as string,
      loan.uid,
      LoanStatus.REJECTED
    );
    window.location.href = '/';
  };

  const isCurrentUserOppositeParty = () => {
    if (loan.createdBy === LoanCreator.BORROWER) {
      return !isBorrower;
    } else {
      return isBorrower;
    }
  };

  return (
    <Box>
      {loan.status === LoanStatus.PENDING && isCurrentUserOppositeParty() && (
        <Box sx={{ m: 1, mt: 2, mb: 2 }}>
          <Alert
            severity="info"
            sx={{ border: '1px solid rgba(0, 0, 0, 0.12)' }}
          >
            This is a newly created loan and is pending your approval.
            <br />
            <br />
            <Typography variant="body2">
              <Emoji symbol="👉" label="point-right" size="h6" />
              &nbsp;You can either approve or reject this loan.
            </Typography>
            <Typography variant="body2">
              <Emoji symbol="✅" label="point-right" size="h6" />
              &nbsp;If you approve, the loan will be created and you will be
              able to start repaying it.
            </Typography>
            <Typography variant="body2">
              <Emoji symbol="❌" label="point-right" size="h6" />
              &nbsp;If you reject, the loan will be deleted.
            </Typography>
            <br />
            <Button
              color="success"
              variant="contained"
              size="small"
              onClick={() => handleLoanAcceptance()}
            >
              APPROVE
            </Button>
            &nbsp;&nbsp;
            <Button size="small" onClick={() => handleLoanRejection()}>
              REJECT
            </Button>
          </Alert>
        </Box>
      )}

      {loan.status === LoanStatus.PENDING && !isCurrentUserOppositeParty() && (
        <Box sx={{ m: 1, mt: 2, mb: 2 }}>
          <Alert
            severity="info"
            sx={{ border: '1px solid rgba(0, 0, 0, 0.12)' }}
          >
            This is a newly created loan and is pending approval from the
            opposite party.
            <br />
            <br />
            <Typography variant="body2">
              <Emoji symbol="👉" label="point-right" size="h6" />
              &nbsp;The opposite party can either approve or reject this loan.
            </Typography>
            <Typography variant="body2">
              <Emoji symbol="✅" label="point-right" size="h6" />
              &nbsp;If they approve, the loan will be created and you will be
              able to start repaying it.
            </Typography>
            <Typography variant="body2">
              <Emoji symbol="❌" label="point-right" size="h6" />
              &nbsp;If they reject, the loan will be deleted.
            </Typography>
          </Alert>
        </Box>
      )}
    </Box>
  );
};

export default LoanDetailsAcceptanceAlert;
