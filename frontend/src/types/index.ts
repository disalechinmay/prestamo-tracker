export interface IUser {
  uid: string;
  email: string;
  loansTaken?: ILoan[];
  loansGiven?: ILoan[];
}

export interface ILoan {
  oppositeParty: string;
  uid: string;
  amount: number;
  interest: number;
  date: Date;
  repayments: IRepayment[];
}

export interface IRepayment {
  uid: string;
  amount: number;
  date: Date;
  comments: string;
}

export interface ILoanExtended extends ILoan {
  borrower: string;
  lender: string;
  currentOutstandingAmount: number;
}
