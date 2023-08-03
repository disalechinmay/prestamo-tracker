import { Box, Card, Typography } from '@mui/material';
import React from 'react';
import { ILoan, ILoanExtended } from '../../types';
import Emoji from '../Emoji/Emoji';
import { formatMoney } from '../../utils/accessories';
import moment, { Moment } from 'moment';

interface LoanDetailsMainFactsProps {
  loan: ILoanExtended;
  isBorrower: boolean;
}

const LoanDetailsMainFacts = ({
  loan,
  isBorrower,
}: LoanDetailsMainFactsProps) => {
  const [date, setDate] = React.useState<Moment>(moment(loan.date));

  return (
    <Box>
      <Box
        sx={{
          mt: 1,
          display: {
            xs: 'block',
            md: 'flex',
          },
        }}
      >
        <Box flex={1} m={1}>
          <Card sx={{ p: 2 }} variant="outlined">
            <Typography variant="overline">
              Principal Amount
              <Emoji symbol="💰" label="principal-amount" size="h6" />
            </Typography>
            <Typography
              variant="h6"
              sx={{
                display: {
                  xs: 'block',
                  sm: 'block',
                  md: 'none',
                },
              }}
            >
              <Emoji symbol="₹" label="rupee" size="h6" />
              {formatMoney(loan.amount)}
            </Typography>
            <Typography
              variant="h3"
              sx={{
                display: {
                  xs: 'none',
                  sm: 'none',
                  md: 'block',
                },
              }}
            >
              <Emoji symbol="₹" label="rupee" size="h3" />
              {formatMoney(loan.amount)}
            </Typography>
          </Card>
        </Box>
        <Box flex={1} m={1}>
          <Card sx={{ p: 2 }} variant="outlined">
            <Typography variant="overline">
              Current Outstanding
              <Emoji symbol="💸" label="start-date" size="h6" />
            </Typography>
            <Typography
              variant="h6"
              sx={{
                display: {
                  xs: 'block',
                  sm: 'block',
                  md: 'none',
                },
              }}
            >
              <Emoji symbol="₹" label="rupee" size="h6" />
              {formatMoney(loan.currentOutstandingAmount)}
            </Typography>
            <Typography
              variant="h3"
              sx={{
                display: {
                  xs: 'none',
                  sm: 'none',
                  md: 'block',
                },
              }}
            >
              <Emoji symbol="₹" label="rupee" size="h3" />
              {formatMoney(loan.currentOutstandingAmount)}
            </Typography>
          </Card>
        </Box>
      </Box>

      <Box
        sx={{
          mt: 1,
          display: {
            xs: 'block',
            md: 'flex',
          },
        }}
      >
        <Box flex={1} m={1}>
          <Card sx={{ p: 2 }} variant="outlined">
            <Typography variant="overline">
              {isBorrower ? 'Borrowed From' : 'Lent To'}
              <Emoji symbol="🧔" label="opposite-party" size="h6" />
            </Typography>
            <Typography variant="h6">
              {isBorrower ? loan.lender : loan.borrower}
            </Typography>
          </Card>
        </Box>
        <Box flex={1} m={1}>
          <Card sx={{ p: 2 }} variant="outlined">
            <Typography variant="overline">
              Start Date
              <Emoji symbol="📅" label="start-date" size="h6" />
            </Typography>
            <Typography variant="h6">{date.format('MMMM DD, YYYY')}</Typography>
          </Card>
        </Box>
        <Box flex={1} m={1}>
          <Card sx={{ p: 2 }} variant="outlined">
            <Typography variant="overline">
              Interest Rate
              <Emoji symbol="⏲" label="principal-amount" size="h6" />
            </Typography>
            <Typography variant="h6">{loan.interest}%</Typography>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default LoanDetailsMainFacts;
