import React, { useState } from 'react';
import { ILoanExtended, LoanStatus, RepaymentStatus } from '../../types';
import { useRecoilState } from 'recoil';
import { accessTokenAtom, userAtom } from '../../state';
import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import Emoji from '../Emoji/Emoji';
import NewRepaymentDialog from '../NewRepaymentDialog/NewRepaymentDialog';
import { formatMoney } from '../../utils/accessories';
import moment from 'moment';
import VerifiedIcon from '@mui/icons-material/Verified';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ErrorIcon from '@mui/icons-material/Error';
import { updateRepaymentStatus } from '../../utils/api';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  ErrorRounded,
  Warning,
  WarningOutlined,
  WarningRounded,
} from '@mui/icons-material';

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

  const approveRepayment = async (repaymentId: string) => {
    await updateRepaymentStatus(
      accessToken as string,
      repaymentId,
      RepaymentStatus.APPROVED
    );
    window.location.reload();
  };

  const rejectRepayment = async (repaymentId: string) => {
    await updateRepaymentStatus(
      accessToken as string,
      repaymentId,
      RepaymentStatus.REJECTED
    );
    window.location.reload();
  };

  return (
    <Box>
      <Box sx={{ m: 1, mt: 3, display: 'flex', alignItems: 'center' }}>
        <Typography
          variant="h6"
          color="initial"
          sx={{ display: 'inline-block', flex: 1 }}
        >
          Repayments Made So Far
        </Typography>

        {loan.status !== LoanStatus.APPROVED && (
          <Box sx={{ mr: 1 }}>
            <Tooltip
              title="No repayment will be allowed until the loan is approved"
              enterTouchDelay={0}
            >
              <ErrorRounded color="warning" />
            </Tooltip>
          </Box>
        )}

        <Button
          variant="outlined"
          size="small"
          sx={{ float: 'right' }}
          onClick={() => setNewRepaymentDialogOpen(true)}
          disabled={loan.status !== LoanStatus.APPROVED}
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
            transition: 'all 0.2s ease-in-out',
            backgroundColor: 'white',
            borderRadius: '5px',
            borderTop: '1px solid rgba(0, 0, 0, 0.12)',
            borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
            borderRight: '1px solid rgba(0, 0, 0, 0.12)',
            borderLeft: '5px solid #3f51b5',
            '&:hover': {
              transition: 'all 0.2s ease-in-out',
              borderRadius: '5px',
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="overline">
              Repayment #{repayment.uid}
            </Typography>
            {repayment.status === RepaymentStatus.APPROVED && (
              <Chip
                icon={<VerifiedIcon />}
                label={'APPROVED'}
                color="success"
                variant="filled"
                size="small"
              />
            )}
            {repayment.status === RepaymentStatus.REJECTED && (
              <Chip
                icon={<ErrorIcon />}
                label={'REJECTED'}
                color="error"
                variant="filled"
                size="small"
              />
            )}
            {repayment.status === RepaymentStatus.PENDING && isBorrower && (
              <Chip
                icon={<AccessTimeIcon />}
                label={'PENDING APPROVAL'}
                color="default"
                variant="filled"
                size="small"
              />
            )}
            {repayment.status === RepaymentStatus.PENDING && !isBorrower && (
              <ButtonGroup variant="outlined" size="small">
                <Button
                  startIcon={<VerifiedIcon />}
                  color="success"
                  onClick={() => approveRepayment(repayment.uid)}
                >
                  APPROVE
                </Button>
                <Button
                  endIcon={<ErrorIcon />}
                  color="error"
                  onClick={() => rejectRepayment(repayment.uid)}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      display: {
                        xs: 'none',
                        sm: 'none',
                        md: 'block',
                      },
                    }}
                  >
                    REJECT
                  </Typography>
                </Button>
              </ButtonGroup>
            )}
          </Box>

          <Typography variant="h6" color="initial">
            <Emoji symbol="₹" label="start-date" size="h6" />
            {formatMoney(repayment.amount)}
          </Typography>
          <Typography
            variant="body1"
            color="initial"
            sx={{
              display: 'flex',
              flexDirection: {
                xs: 'column',
                sm: 'column',
                md: 'row',
              },
            }}
          >
            <Box sx={{ mr: 3 }}>
              <Emoji
                symbol="📅"
                label="start-date"
                size="body1"
                marginRight={1}
              />
              {moment(repayment.date).format('MMMM DD, YYYY')}
            </Box>
            <Box>
              <Emoji symbol="💬" label="comment" size="body1" marginRight={1} />
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
