import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import Emoji from '../Emoji/Emoji';
import { formatMoney } from '../../utils/accessories';
import LoanLink from '../LoanLink/LoanLink';
import { Divider } from '@mui/material';
import NewLoanDialog from '../NewLoanDialog/NewLoanDialog';

const MoneyLent = () => {
  const [user] = useRecoilState(userAtom);
  const [totalMoneyLent, setTotalMoneyLent] = useState('');
  const [newLoadDialogOpen, setNewLoadDialogOpen] = useState(false);

  useEffect(() => {
    if (user && user.loansGiven) {
      const totalMoneyLent = user.loansGiven.reduce((total, current) => {
        return total + current.amount;
      }, 0);
      setTotalMoneyLent(formatMoney(totalMoneyLent));
    }
  }, [user]);

  return (
    <Box>
      <Card variant="outlined">
        <Container sx={{ p: 1 }}>
          <Typography variant="overline">
            Money Lent
            <Emoji symbol="💸" label="money-lent" size="h6" />
            <Button
              sx={{ float: 'right' }}
              onClick={() => setNewLoadDialogOpen(true)}
            >
              Add New
            </Button>
          </Typography>
          <Typography variant="h3">
            <Emoji symbol="₹" label="rupee" size="h3" />
            {totalMoneyLent}
          </Typography>

          <br />

          <Typography variant="overline">
            Loans Given Previously
            <Emoji symbol="🤑" label="money-borrowed" size="h6" />
          </Typography>
          <Divider />
          <List>
            {user?.loansGiven?.map((loan) => (
              <LoanLink loan={loan} type="lender" />
            ))}
            {user?.loansGiven?.length === 0 && (
              <Typography variant="body2" sx={{ textAlign: 'center' }}>
                You haven't given any loans yet.
                <Emoji symbol="😐" size="h6" label="party-popper" />
              </Typography>
            )}
          </List>
        </Container>
      </Card>

      <NewLoanDialog
        open={newLoadDialogOpen}
        setOpen={(v) => setNewLoadDialogOpen(v)}
      />
    </Box>
  );
};

export default MoneyLent;
