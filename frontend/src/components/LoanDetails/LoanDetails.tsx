import React from 'react';
import { useRecoilState } from 'recoil';
import { accessTokenAtom, userAtom } from '../../state';
import { Box } from '@mui/material';
import { ILoan, ILoanExtended } from '../../types';
import LoanDetailsGreeting from '../LoanDetailsGreeting/LoanDetailsGreeting';
import LoanDetailsMainFacts from '../LoanDetailsMainFacts/LoanDetailsMainFacts';
import LoanDetailsRepayments from '../LoanDetailsRepayments/LoanDetailsRepayments';
import LoanDetailsAcceptanceAlert from '../LoanDetailsAcceptanceAlert/LoanDetailsAcceptanceAlert';

interface LoanDetailsProps {
  loan: ILoanExtended;
  isBorrower: boolean;
}

const LoanDetailsComponent = ({ loan, isBorrower }: LoanDetailsProps) => {
  // Recoil State
  const [accessToken, setAccessToken] = useRecoilState(accessTokenAtom);
  const [user, setUser] = useRecoilState(userAtom);

  return (
    <Box>
      <LoanDetailsGreeting loanId={loan.uid} />
      <LoanDetailsAcceptanceAlert loan={loan} isBorrower={isBorrower} />
      <LoanDetailsMainFacts loan={loan} isBorrower={isBorrower} />
      <LoanDetailsRepayments loan={loan} isBorrower={isBorrower} />
    </Box>
  );
};

export default LoanDetailsComponent;
