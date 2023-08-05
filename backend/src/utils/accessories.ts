import { Repayment } from '@prisma/client';
import moment from 'moment';

export const getCompoundInterest = (
  initialPrincipal: number,
  compoundInterestRatePerYear: number,
  startDate: Date,
  endDate: Date
) => {
  const days = moment(endDate).diff(moment(startDate), 'days');
  const compoundInterestRatePerDay = compoundInterestRatePerYear / 100 / 365;
  return (
    initialPrincipal * Math.pow(1 + compoundInterestRatePerDay, days) -
    initialPrincipal
  );
};

export const getCurrentOutstandingAmount = (
  principalAmount: number,
  interestRate: number,
  startDate: Date,
  repayments: Repayment[]
) => {
  if (interestRate === 0) return principalAmount;

  let periods: Date[] = [];
  periods.push(startDate);

  let repaymentPeriods: Date[] = [];

  // Sort repayments by date ASCENDING
  repayments.sort((a, b) => {
    return moment(a.date).diff(moment(b.date));
  });

  repayments.forEach((repayment) => {
    repaymentPeriods.push(repayment.date);
  });

  // Add repayment periods to periods
  periods = periods.concat(repaymentPeriods);

  if (periods.length === 1) {
    return (
      principalAmount +
      getCompoundInterest(principalAmount, interestRate, startDate, new Date())
    );
  }

  let currentOutstandingAmount = principalAmount;

  for (let i = 0; i < periods.length - 1; i++) {
    const startDate = periods[i];
    const endDate = periods[i + 1];
    const interest = getCompoundInterest(
      currentOutstandingAmount,
      interestRate,
      startDate,
      endDate
    );

    currentOutstandingAmount += interest;

    if (repayments[i]?.status === 'approved')
      currentOutstandingAmount -= repayments[i]?.amount || 0;

    if (i === periods.length - 2)
      currentOutstandingAmount += getCompoundInterest(
        currentOutstandingAmount,
        interestRate,
        endDate,
        new Date()
      );
  }

  return currentOutstandingAmount;
};
