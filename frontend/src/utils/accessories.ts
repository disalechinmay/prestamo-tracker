export const formatMoney = (amount: number): string => {
  // If there are any decimals, round to 2 decimal places. Add commas to separate thousands.
  return amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
};
