import moment from 'moment';

export const getCompoundInterest = (
  amount: number,
  compoundInterestRatePerYear: number,
  startDate: Date,
  endDate: Date
) => {
  const days = moment(endDate).diff(moment(startDate), 'days');
  const compoundInterestRatePerDay = compoundInterestRatePerYear / 100 / 365;
  return amount * Math.pow(1 + compoundInterestRatePerDay, days);
};
