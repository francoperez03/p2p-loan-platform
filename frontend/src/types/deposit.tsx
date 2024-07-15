// types.ts

export interface Deposit {
  id: number;
  depositor: string;
  amount: bigint;
  interestRate: bigint;
  createdAt: bigint;
  lastUpdated: bigint;
}

export interface Loan {
  id: number;
  lender: string;
  borrower: string;
  principal: bigint;
  interestRate: bigint;
  startTime: bigint;
  duration: bigint;
  amountRepaid: bigint;
  state: LoanState;
}

export enum LoanState {
  Pending = 0,
  Active = 1,
  Repaid = 2,
}

export interface DepositWithInterest {
  deposit: Deposit;
  interestEarned: bigint;
}

export interface LoanWithAmountDue {
  loan: Loan;
  totalAmountDue: bigint;
}
