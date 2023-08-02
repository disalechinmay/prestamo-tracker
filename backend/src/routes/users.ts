import express from 'express';
import { BAD_REQ_RESPONSE } from '../constants';
import ApplicationPrismaClient from '../utils/db';
import { findEmailFromUid } from '../utils/users';

export const router = express.Router();

router.post('/:id', async (req, res) => {
  if (!req.params.id) return res.status(400).send(BAD_REQ_RESPONSE);
  if (!req.body.uid || !req.body.email)
    return res.status(400).send(BAD_REQ_RESPONSE);

  let user = await ApplicationPrismaClient.user.findUnique({
    where: {
      uid: req.params.id,
    },
    include: {
      loansGiven: true,
      loansTaken: true,
    },
  });

  if (!user) {
    user = await ApplicationPrismaClient.user.create({
      data: {
        uid: req.body.uid,
        email: req.body.email,
      },
      include: {
        loansGiven: true,
        loansTaken: true,
      },
    });
  }

  let transformedUser = {
    ...user,
    loansGiven: user.loansGiven.map(
      (loan) =>
        ({
          ...loan,
          uid: loan.uid.toString(),
        } as any)
    ),
    loansTaken: user.loansTaken.map(
      (loan) =>
        ({
          ...loan,
          uid: loan.uid.toString(),
        } as any)
    ),
  };

  for (let loanGiven of transformedUser.loansGiven) {
    loanGiven.oppositeParty = await findEmailFromUid(loanGiven.borrowerId);
  }

  for (let loanTaken of transformedUser.loansTaken) {
    loanTaken.oppositeParty = await findEmailFromUid(loanTaken.lenderId);
  }

  return res.json(transformedUser);
});

router.get('/search/:searchQuery', async (req, res) => {
  if (!req.params.searchQuery) return res.status(400).send(BAD_REQ_RESPONSE);

  const users = await ApplicationPrismaClient.user.findMany({
    where: {
      email: {
        contains: req.params.searchQuery,
      },
    },
    include: {
      loansGiven: false,
      loansTaken: false,
    },
    take: 10,
  });

  // Remove user if they are the same as the current user
  const filteredUsers = users.filter(
    (user) => user.uid !== req?.auth?.payload?.sub?.toString()
  );
  return res.json(filteredUsers);
});
