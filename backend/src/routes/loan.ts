import express from 'express';
import { BAD_REQ_RESPONSE } from '../constants';
import ApplicationPrismaClient from '../utils/db';
import { findEmailFromUid } from '../utils/users';
import { set } from 'date-fns';
import { getCompoundInterest } from '../utils/accessories';

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
    currentOutstandingAmount: getCompoundInterest(
      loan.amount,
      loan.interest,
      loan.date,
      new Date()
    ),
  };

  // Return the loan
  return res.json(transformedLoan);
});
