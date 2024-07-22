// types.ts

export interface Deposit {
  id: bigint;
  depositor: string;
  amount: bigint;
  interestRate: bigint;
  createdAt: bigint;
  lastUpdated: bigint;
}

export interface DepositWithInterest {
  deposit: Deposit;
  interestEarned: bigint;
}

export interface DepositDataResult {
  result: [Deposit, bigint];
  isLoading: boolean
}

export interface LocalDeposit {
  deposit: Deposit;
  interestEarned: bigint;
}