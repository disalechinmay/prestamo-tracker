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
  status: LoanStatus;
  createdBy: LoanCreator;
}

export interface IRepayment {
  uid: string;
  amount: number;
  date: Date;
  comments: string;
  status: RepaymentStatus;
}

export interface ILoanExtended extends ILoan {
  borrower: string;
  lender: string;
  currentOutstandingAmount: number;
}

export enum RepaymentStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum LoanStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum LoanCreator {
  BORROWER = 'borrower',
  LENDER = 'lender',
}
