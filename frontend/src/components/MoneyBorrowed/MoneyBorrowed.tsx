import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { userAtom } from '../../state';
import {
  Box,
  Card,
  CardHeader,
  Avatar,
  IconButton,
  Typography,
  Container,
  List,
  ListItem,
  Button,
  Divider,
} from '@mui/material';
import Emoji from '../Emoji/Emoji';
import { formatMoney } from '../../utils/accessories';
import LoanLink from '../LoanLink/LoanLink';

const MoneyBorrowed = () => {
  const [user] = useRecoilState(userAtom);
  const [totalMoneyBorrowed, setTotalMoneyBorrowed] = React.useState('');

  useEffect(() => {
    if (user && user.loansTaken) {
      const totalMoneyBorrowed = user.loansTaken.reduce((total, current) => {
        return total + current.amount;
      }, 0);
      setTotalMoneyBorrowed(formatMoney(totalMoneyBorrowed));
    }
  }, [user]);

  console.log(user);

  return (
    <Box>
      <Card variant="outlined">
        <Container sx={{ p: 1 }}>
          <Typography variant="overline">
            Money Borrowed
            <Emoji symbol="💰" label="money-borrowed" size="h6" />
          </Typography>
          <Typography variant="h3">
            <Emoji symbol="₹" label="rupee" size="h3" />
            {totalMoneyBorrowed}
          </Typography>

          <br />

          <Typography variant="overline">
            Loans Taken Previously
            <Emoji symbol="🙇" label="money-borrowed" size="h6" />
          </Typography>
          <Divider />
          <List>
            {user?.loansTaken?.map((loan) => (
              <LoanLink loan={loan} type="borrower" />
            ))}
            {user?.loansTaken?.length === 0 && (
              <Typography variant="body2" sx={{ textAlign: 'center' }}>
                You haven't taken any loans yet.
                <Emoji symbol="🎉" size="h6" label="party-popper" />
              </Typography>
            )}
          </List>
        </Container>
      </Card>
    </Box>
  );
};

export default MoneyBorrowed;
