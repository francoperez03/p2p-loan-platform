export enum LoanState {
  PENDING = 0,
  ACTIVE = 1,
  REPAID = 2
}

export const LoanStateEnum = {
  0: 'PENDING',
  1: 'ACTIVE',
  2: 'REPAID'
}
export interface Loan {
  id: bigint;
  lender: string;
  borrower: string;
  principal: bigint;
  interestRate: bigint;
  startTime: bigint;
  amountRepaid: bigint;
  state: LoanState;
}


export interface LoanWithAmountDue {
  loan: Loan;
  totalAmountDue: bigint;
}
