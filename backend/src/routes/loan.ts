import express from 'express';
import { BAD_REQ_RESPONSE } from '../constants';
import ApplicationPrismaClient from '../utils/db';
import { findEmailFromUid } from '../utils/users';
import { set } from 'date-fns';
import {
  getCompoundInterest,
  getCurrentOutstandingAmount,
} from '../utils/accessories';
import RepaymentStatus from '../types/RepaymentTypes';
import moment from 'moment';
import LoanStatus from '../types/LoanTypes';
import LoanCreator from '../types/LoanCreator';

export const router = express.Router();

router.post('/', async (req, res) => {
  // Check if the request body is valid and contains loanAmount, interestRate, borrowerId, and date
  if (
    !('loanAmount' in req.body) ||
    !('interestRate' in req.body) ||
    !('borrowerId' in req.body) ||
    !('date' in req.body)
  )
    return res.status(400).send(BAD_REQ_RESPONSE + '- Missing fields');

  // Check if the borrowerId is valid
  const borrower = await findEmailFromUid(req.body.borrowerId);
  if (!borrower)
    return res.status(400).send(BAD_REQ_RESPONSE + '- Borrower not found');

  // Check if the lenderId is not equal to the borrowerId
  if (req.body.borrowerId === req?.auth?.payload?.sub?.toString())
    return res.status(400).send(BAD_REQ_RESPONSE + '- Cannot lend to yourself');

  // Check if the loanAmount is a number
  if (isNaN(req.body.loanAmount))
    return res
      .status(400)
      .send(BAD_REQ_RESPONSE + '- Loan amount is not a number');

  // Check if the interestRate is a number
  if (isNaN(req.body.interestRate))
    return res
      .status(400)
      .send(BAD_REQ_RESPONSE + '- Interest rate is not a number');

  // Check if the loanAmount is greater than 0
  if (req.body.loanAmount <= 0)
    return res
      .status(400)
      .send(BAD_REQ_RESPONSE + '- Loan amount must be greater than 0');

  // Insert the loan into the database
  const loan = await ApplicationPrismaClient.loan.create({
    data: {
      amount: Number(req.body.loanAmount),
      interest: Number(req.body.interestRate),
      lenderId: req?.auth?.payload?.sub?.toString() as string,
      borrowerId: req.body.borrowerId.toString() as string,
      date: set(new Date(req.body.date), {
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      }),
      status: LoanStatus.PENDING,
      createdBy:
        req.body.borrowerId === req?.auth?.payload?.sub?.toString()
          ? LoanCreator.BORROWER
          : LoanCreator.LENDER,
    },
  });

  let transformedLoan = {
    ...loan,
    uid: loan.uid.toString(),
  };

  // Return the loan
  return res.json(transformedLoan);
});

router.get('/:id', async (req, res) => {
  // Check if ID is present and is a number
  if (!req.params.id || isNaN(Number(req.params.id)))
    return res.status(400).send(BAD_REQ_RESPONSE + '- Invalid ID');

  // Check if the loanId is valid
  const loan = await ApplicationPrismaClient.loan.findUnique({
    where: { uid: Number(req.params.id) },
    include: {
      repayments: true,
    },
  });
  if (!loan) return res.status(400).send('Loan not found');

  let transformedLoan = {
    ...loan,
    uid: loan.uid.toString(),
    date: new Date(loan.date),
    borrower: await findEmailFromUid(loan.borrowerId),
    lender: await findEmailFromUid(loan.lenderId),
    currentOutstandingAmount:
      loan.status === LoanStatus.REJECTED || loan.allPaid
        ? 0
        : getCurrentOutstandingAmount(
            loan.amount,
            loan.interest,
            loan.date,
            loan.repayments
          ),
    repayments: loan.repayments.map((repayment) => ({
      ...repayment,
      uid: repayment.uid.toString(),
      date: new Date(repayment.date),
      loanId: repayment.loanId.toString(),
    })),
  };

  // Sort repayments by date DESC
  transformedLoan.repayments.sort((a, b) => {
    return moment(b.date).diff(moment(a.date));
  });

  // Return the loan
  return res.json(transformedLoan);
});

router.put('/:id', async (req, res) => {
  // Create a repayment against the loanId passed
  // Check if ID is present and is a number
  if (!req.params.id || isNaN(Number(req.params.id)))
    return res.status(400).send(BAD_REQ_RESPONSE + '- Invalid ID');

  // Check if the body has all fields - amount, comments, date
  if (
    !('amount' in req.body) ||
    !('comments' in req.body) ||
    !('date' in req.body)
  )
    return res.status(400).send(BAD_REQ_RESPONSE + '- Missing fields');

  // Check if the loanId is valid
  const loan = await ApplicationPrismaClient.loan.findUnique({
    where: { uid: Number(req.params.id) },
    include: {
      repayments: true,
    },
  });
  if (!loan) return res.status(400).send('Loan not found');

  // Check if the amount is a number
  if (isNaN(req.body.amount))
    return res.status(400).send(BAD_REQ_RESPONSE + '- Amount is not a number');

  // Check if the amount is greater than 0
  if (req.body.amount <= 0)
    return res
      .status(400)
      .send(BAD_REQ_RESPONSE + '- Amount must be greater than 0');

  // Insert repayment record
  const repayment = await ApplicationPrismaClient.repayment.create({
    data: {
      amount: Number(req.body.amount),
      loanId: Number(req.params.id),
      date: set(new Date(req.body.date), {
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      }),
      comments: req.body.comments,
      status:
        req?.auth?.payload?.sub === loan.lenderId
          ? RepaymentStatus.APPROVED
          : RepaymentStatus.PENDING,
    },
  });

  // Get currentOutstandingAmount on the loan
  const currentOutstandingAmount = getCurrentOutstandingAmount(
    loan.amount,
    loan.interest,
    loan.date,
    loan.repayments
  );

  // Check if the currentOutstandingAmount is less than the amount
  if (currentOutstandingAmount < req.body.amount) {
    // Mark loan as allPaid
    await ApplicationPrismaClient.loan.update({
      where: { uid: Number(req.params.id) },
      data: {
        allPaid: true,
      },
    });
  }

  // Return the repayment
  return res.json({ success: true });
});

router.post('/repayment/:id/action', async (req, res) => {
  // Check if POST body contains status
  if (!('status' in req.body))
    return res.status(400).send(BAD_REQ_RESPONSE + '- Missing fields');

  // Check if status is valid
  if (
    req.body.status !== RepaymentStatus.APPROVED &&
    req.body.status !== RepaymentStatus.REJECTED
  )
    return res.status(400).send(BAD_REQ_RESPONSE + '- Invalid status');

  // Check if ID is present and is a number
  if (!req.params.id || isNaN(Number(req.params.id)))
    return res.status(400).send(BAD_REQ_RESPONSE + '- Invalid ID');

  // Check if the repayment ID is valid
  const repayment = await ApplicationPrismaClient.repayment.findUnique({
    where: { uid: Number(req.params.id) },
  });

  if (!repayment) return res.status(400).send('Repayment not found');

  if (
    repayment.status === RepaymentStatus.APPROVED ||
    repayment.status === RepaymentStatus.REJECTED
  )
    return res.status(400).send('Repayment already actioned');

  // Find the loan
  const loan = await ApplicationPrismaClient.loan.findUnique({
    where: { uid: repayment.loanId },
  });

  if (req?.auth?.payload?.sub !== loan?.lenderId)
    return res.status(400).send('Only lender can action repayments');

  // Update the repayment status
  await ApplicationPrismaClient.repayment.update({
    where: { uid: Number(req.params.id) },
    data: {
      status: req.body.status,
    },
  });

  return res.json({ success: true });
});

router.post('/:id/action', async (req, res) => {
  // Check if POST body contains status
  if (!('status' in req.body))
    return res.status(400).send(BAD_REQ_RESPONSE + '- Missing fields');

  // Check if status is valid
  if (
    req.body.status !== LoanStatus.APPROVED &&
    req.body.status !== LoanStatus.REJECTED
  )
    return res.status(400).send(BAD_REQ_RESPONSE + '- Invalid status');

  // Check if ID is present and is a number
  if (!req.params.id || isNaN(Number(req.params.id)))
    return res.status(400).send(BAD_REQ_RESPONSE + '- Invalid ID');

  // Check if the loan ID is valid
  const loan = await ApplicationPrismaClient.loan.findUnique({
    where: { uid: Number(req.params.id) },
  });

  if (!loan) return res.status(400).send('Loan not found');

  if (
    loan.status === LoanStatus.APPROVED ||
    loan.status === LoanStatus.REJECTED
  )
    return res.status(400).send('Loan already actioned');

  // Find the opposite party. If the loan was created by the borrower, the opposite party is the lender and vice versa
  const oppositeParty =
    loan.createdBy === LoanCreator.BORROWER ? loan.lenderId : loan.borrowerId;

  // Check if the user is the opposite party
  if (req?.auth?.payload?.sub !== oppositeParty)
    return res.status(400).send('Only opposite party can action loans');

  // Delete loan if rejected
  if (req.body.status === LoanStatus.REJECTED) {
    await ApplicationPrismaClient.loan.delete({
      where: { uid: Number(req.params.id) },
    });
  } else {
    // Update the loan status
    await ApplicationPrismaClient.loan.update({
      where: { uid: Number(req.params.id) },
      data: {
        status: req.body.status,
      },
    });
  }

  return res.json({ success: true });
});
