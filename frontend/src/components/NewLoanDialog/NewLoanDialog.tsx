import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { Autocomplete, Box, TextField } from '@mui/material';
import { createLoan, searchUsers } from '../../utils/api';
import { useRecoilState } from 'recoil';
import { accessTokenAtom } from '../../state';
import { debounce } from 'lodash';
import Emoji from '../Emoji/Emoji';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import moment, { Moment } from 'moment';

interface NewLoanDialogProps {
  open: boolean;
  setOpen: (v: boolean) => void;
}

interface UserSearchResult {
  uid: string;
  email: string;
}

const NewLoanDialog = ({ open, setOpen }: NewLoanDialogProps) => {
  const [accessToken, setAccessToken] = useRecoilState(accessTokenAtom);

  const [userOptions, setUserOptions] = useState<UserSearchResult[]>([]);
  const [loanAmount, setLoanAmount] = useState<number>(0);
  const [interestRate, setInterestRate] = useState<number>(0);
  const [borrower, setBorrower] = useState<string>('');
  const [loanStartDate, setLoanStartDate] = useState<Moment | null>(moment());
  const [error, setError] = useState<string>('');
  const [formDisabled, setFormDisabled] = useState<boolean>(false);

  const closeDialog = () => {
    if (formDisabled) return;
    setOpen(false);
    setLoanAmount(0);
    setInterestRate(0);
    setBorrower('');
    setError('');
    setFormDisabled(false);
  };

  const debouncedSearch = debounce(async (searchQuery: string) => {
    let users = await searchUsers(accessToken as string, searchQuery);
    setUserOptions(users);
  }, 1000);

  const handleSearchQueryChange = (searchQuery: string) => {
    debouncedSearch(searchQuery);
  };

  const handleCreateLoan = async () => {
    setFormDisabled(true);
    if (!loanAmount || !borrower) {
      setError(
        'Please fill in all the fields. Make sure that the amount is greater than 0 and a borrower is selected.'
      );
      setFormDisabled(false);
      return;
    }

    // loanStartDate cannot be in future
    if (loanStartDate && loanStartDate.isAfter(moment())) {
      setError('Loan start date cannot be in future.');
      setFormDisabled(false);
      return;
    }

    setError('');

    let loan = null;
    try {
      loan = await createLoan(
        accessToken as string,
        borrower,
        loanAmount,
        interestRate,
        loanStartDate?.toDate() as Date
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
          New Loan &nbsp;
          <Emoji symbol="🚀" label="new-loan" size="h6" />
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Fill in the below details to create a new loan record.
          </DialogContentText>

          <Box sx={{ mt: 2, mb: 1 }}>
            <TextField
              label="Loan Amount (INR)"
              variant="standard"
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              disabled={formDisabled}
              required
              fullWidth
            />
            <br />
            <br />
            <TextField
              label="Interest Rate (%)"
              variant="standard"
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              disabled={formDisabled}
              required
              fullWidth
            />
            <br />
            <br />
            <Autocomplete
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Borrower"
                  variant="standard"
                  required
                  fullWidth
                />
              )}
              options={userOptions}
              onInputChange={(e, nv) => handleSearchQueryChange(nv)}
              onChange={(e, nv) => setBorrower(nv?.uid as string)}
              getOptionLabel={(option) => option.email}
              disabled={formDisabled}
            />
            <br />
            <br />
            <DatePicker
              label={'Loan Start Date'}
              value={loanStartDate}
              onChange={(nv) => setLoanStartDate(nv)}
              disabled={formDisabled}
            />
          </Box>

          <DialogContentText color="red">{error}</DialogContentText>
          {!error && formDisabled && (
            <DialogContentText color="green">
              Creating loan record...
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            variant="outlined"
            size="small"
            onClick={() => handleCreateLoan()}
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

export default NewLoanDialog;
