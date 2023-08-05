import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { accessTokenAtom } from '../../state';
import moment, { Moment } from 'moment';
import { UserSearchResult } from '../../utils/accessories';
import { debounce } from 'lodash';
import { createRepaymentAgainstALoan, searchUsers } from '../../utils/api';
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import Emoji from '../Emoji/Emoji';
import { DatePicker } from '@mui/x-date-pickers';
import { ILoanExtended } from '../../types';

interface NewRepaymentDialogProps {
  open: boolean;
  setOpen: (v: boolean) => void;
  loanId: string;
  loan: ILoanExtended;
}

const NewRepaymentDialog = ({
  open,
  setOpen,
  loanId,
  loan,
}: NewRepaymentDialogProps) => {
  const [accessToken, setAccessToken] = useRecoilState(accessTokenAtom);

  const [amount, setAmount] = useState<number>(1);
  const [comments, setComments] = useState<string>('');
  const [date, setDate] = useState<Moment | null>(moment());
  const [error, setError] = useState<string>('');
  const [formDisabled, setFormDisabled] = useState<boolean>(false);

  const closeDialog = () => {
    if (formDisabled) return;
    setOpen(false);
    setAmount(0);
    setDate(moment());
    setError('');
    setFormDisabled(false);
  };

  const handleCreateRepayment = async () => {
    setFormDisabled(true);
    if (!comments || !amount || !date) {
      setError(
        'Please fill in all the fields. Ensure amount is greater than 0.'
      );
      setFormDisabled(false);
      return;
    }

    // date cannot be in future
    if (date && date.isAfter(moment())) {
      setError('Transaction date cannot be in future.');
      setFormDisabled(false);
      return;
    }

    // date cannot be on or before loan start date
    if (date && loan.date && date.isSameOrBefore(loan.date)) {
      setError('Transaction date cannot be on or before loan start date.');
      setFormDisabled(false);
      return;
    }

    setError('');

    let repayment = null;
    try {
      repayment = await createRepaymentAgainstALoan(
        accessToken as string,
        loanId,
        amount,
        comments,
        date?.toDate() as Date
      );
      window.location.reload();
    } catch (e) {
      setError('Something went wrong. Please try again. [' + e + ']');
    }

    setFormDisabled(false);
  };

  return (
    <Box>
      <Dialog
        open={open}
        onClose={() => closeDialog()}
        PaperProps={{
          sx: {
            width: '100%',
          },
        }}
      >
        <DialogTitle>
          New Repayment &nbsp;
          <Emoji symbol="🚀" label="new-loan" size="h6" />
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Fill in the below details to create a new repayment record.
          </DialogContentText>

          <Box sx={{ mt: 2, mb: 1 }}>
            <TextField
              label="Amount (INR)"
              variant="standard"
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              disabled={formDisabled}
              InputProps={{ inputProps: { min: 1 } }}
              required
              fullWidth
            />
            <br />
            <br />
            <TextField
              label="Comments (Example: Paid via UPI; Transaction ID: 1234567890)"
              variant="standard"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              disabled={formDisabled}
              required
              fullWidth
            />
            <br />
            <br />
            <br />
            <DatePicker
              label={'Transaction Date'}
              value={date}
              onChange={(nv) => setDate(nv)}
              disabled={formDisabled}
            />
          </Box>

          <DialogContentText color="red">{error}</DialogContentText>
          {!error && formDisabled && (
            <DialogContentText color="green">
              Creating repayment record...
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            variant="outlined"
            size="small"
            onClick={() => handleCreateRepayment()}
            disabled={formDisabled}
          >
            Save
          </Button>
          <Button
            onClick={() => closeDialog()}
            color="secondary"
            size="small"
            disabled={formDisabled}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NewRepaymentDialog;
