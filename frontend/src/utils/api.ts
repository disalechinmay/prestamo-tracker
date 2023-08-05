import { ILoan, ILoanExtended, IUser } from '../types';

export const backendServerUrl: string =
  process.env.REACT_APP_BACKEND_SERVER_LOCATION || '';

export const getDefaultHeaders = (token: string) => {
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const getDefaultPostHeaders = (token: string) => {
  return {
    ...getDefaultHeaders(token),
    'Content-Type': 'application/json;charset=utf-8',
  };
};

export const fetchUserInformation = async (
  accessToken: string,
  uid: string,
  email: string
): Promise<IUser | null> => {
  const res = await fetch(`${backendServerUrl}/api/users/${uid}`, {
    method: 'POST',
    headers: getDefaultPostHeaders(accessToken),
    body: JSON.stringify({ uid, email }),
  });

  const user = await res.json();
  return user;
};

export const searchUsers = async (
  accessToken: string,
  searchQuery: string
): Promise<IUser[]> => {
  const res = await fetch(
    `${backendServerUrl}/api/users/search/${searchQuery}`,
    {
      method: 'GET',
      headers: getDefaultHeaders(accessToken),
    }
  );

  const users = await res.json();
  return users;
};

export const createLoan = async (
  accessToken: string,
  borrowerId: string,
  loanAmount: number,
  interestRate: number,
  startDate: Date
) => {
  const res = await fetch(`${backendServerUrl}/api/loans`, {
    method: 'POST',
    headers: getDefaultPostHeaders(accessToken),
    body: JSON.stringify({
      borrowerId,
      loanAmount,
      interestRate,
      date: startDate,
    }),
  });
  // Check status code
  if (res.status !== 200) throw new Error(await res.text());

  const loan = await res.json();
  return loan;
};

export const getLoan = async (
  accessToken: string,
  loanId: string
): Promise<ILoanExtended | null> => {
  const res = await fetch(`${backendServerUrl}/api/loans/${loanId}`, {
    method: 'GET',
    headers: getDefaultHeaders(accessToken),
  });
  // Check status code
  if (res.status !== 200) throw new Error(await res.text());

  const loan = await res.json();
  loan.date = new Date(loan.date);
  return loan;
};

export const createRepaymentAgainstALoan = async (
  accessToken: string,
  loanId: string,
  amount: number,
  comments: string,
  date: Date
) => {
  const res = await fetch(`${backendServerUrl}/api/loans/${loanId}`, {
    method: 'PUT',
    headers: getDefaultPostHeaders(accessToken),
    body: JSON.stringify({ amount, comments, date }),
  });
  // Check status code
  if (res.status !== 200) throw new Error(await res.text());

  const repayment = await res.json();
  return repayment;
};

export const updateRepaymentStatus = async (
  accessToken: string,
  repaymentId: string,
  status: string
) => {
  const res = await fetch(
    `${backendServerUrl}/api/loans/repayment/${repaymentId}/action`,
    {
      method: 'POST',
      headers: getDefaultPostHeaders(accessToken),
      body: JSON.stringify({ status }),
    }
  );
  // Check status code
  if (res.status !== 200) throw new Error(await res.text());

  const repayment = await res.json();
  return repayment;
};

export const updateLoanStatus = async (
  accessToken: string,
  loanId: string,
  status: string
) => {
  const res = await fetch(`${backendServerUrl}/api/loans/${loanId}/action`, {
    method: 'POST',
    headers: getDefaultPostHeaders(accessToken),
    body: JSON.stringify({ status }),
  });
  // Check status code
  if (res.status !== 200) throw new Error(await res.text());

  const loan = await res.json();
  return loan;
};
