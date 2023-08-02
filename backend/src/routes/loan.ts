import express from 'express';
import { BAD_REQ_RESPONSE } from '../constants';
import ApplicationPrismaClient from '../utils/db';
import { findEmailFromUid } from '../utils/users';

export const router = express.Router();

router.post('/', async (req, res) => {
  // Check if the request body is valid and contains loanAmount, interestRate, and borrowerId
  if (
    !('loanAmount' in req.body) ||
    !('interestRate' in req.body) ||
    !('borrowerId' in req.body)
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
    },
  });

  let transformedLoan = {
    ...loan,
    uid: loan.uid.toString(),
  };

  // Return the loan
  return res.json(transformedLoan);
});
