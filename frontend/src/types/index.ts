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
}
