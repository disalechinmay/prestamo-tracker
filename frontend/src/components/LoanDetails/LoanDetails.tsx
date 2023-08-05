import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { accessTokenAtom, userAtom } from '../../state';
import { Box } from '@mui/material';
import { ILoan, ILoanExtended } from '../../types';
import LoanDetailsGreeting from '../LoanDetailsGreeting/LoanDetailsGreeting';
import LoanDetailsMainFacts from '../LoanDetailsMainFacts/LoanDetailsMainFacts';
import LoanDetailsRepayments from '../LoanDetailsRepayments/LoanDetailsRepayments';
import LoanDetailsAcceptanceAlert from '../LoanDetailsAcceptanceAlert/LoanDetailsAcceptanceAlert';
import confetti from 'canvas-confetti';

interface LoanDetailsProps {
  loan: ILoanExtended;
  isBorrower: boolean;
}

const LoanDetailsComponent = ({ loan, isBorrower }: LoanDetailsProps) => {
  // Recoil State
  const [accessToken, setAccessToken] = useRecoilState(accessTokenAtom);
  const [user, setUser] = useRecoilState(userAtom);

  // Local State
  const [confettiPopped, setConfettiPopped] = React.useState<boolean>(false);

  const popConfetti = async () => {
    setConfettiPopped(true);
    confetti({
      angle: 60,
      spread: 180,
      origin: { x: 0 },
    });
    confetti({
      angle: 120,
      spread: 180,
      origin: { x: 1 },
    });
  };

  useEffect(() => {
    if (!loan.allPaid) return;
    if (confettiPopped) return;
    popConfetti();
  }, [loan.allPaid]);

  return (
    <Box>
      <LoanDetailsGreeting loan={loan} />
      <LoanDetailsAcceptanceAlert loan={loan} isBorrower={isBorrower} />
      <LoanDetailsMainFacts loan={loan} isBorrower={isBorrower} />
      <LoanDetailsRepayments loan={loan} isBorrower={isBorrower} />
    </Box>
  );
};

export default LoanDetailsComponent;
