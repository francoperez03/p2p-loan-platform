import { Abi } from "viem";

const lendingContractABI: Abi = [
  {
    type: "constructor",
    inputs: [
      { name: "_token", type: "address", internalType: "address" },
      { name: "_depositInterestRate", type: "uint256", internalType: "uint256" }
    ],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "approveLoan",
    inputs: [{ name: "_loanId", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "calculateInterestEarned",
    inputs: [{ name: "_depositId", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "calculateTotalAmountDue",
    inputs: [{ name: "_loanId", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "deposit",
    inputs: [{ name: "_amount", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "_depositId", type: "uint256", internalType: "uint256" }],
    stateMutability: "nonpayable"
  },
  { type:"function",
    name:"depositWithPermit",
    inputs:[{"name":"_amount","type":"uint256","internalType":"uint256"},{"name":"deadline","type":"uint256","internalType":"uint256"},{"name":"v","type":"uint8","internalType":"uint8"},{"name":"r","type":"bytes32","internalType":"bytes32"},{"name":"s","type":"bytes32","internalType":"bytes32"}],
    outputs:[{"name":"_depositId","type":"uint256","internalType":"uint256"}],
    stateMutability:"nonpayable"},
  {
    type: "function",
    name: "depositCounter",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "depositIdsByAddress",
    inputs: [
      { name: "", type: "address", internalType: "address" },
      { name: "", type: "uint256", internalType: "uint256" }
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "depositInterestRate",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "deposits",
    inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    outputs: [
      { name: "id", type: "uint256", internalType: "uint256" },
      { name: "depositor", type: "address", internalType: "address" },
      { name: "amount", type: "uint256", internalType: "uint256" },
      { name: "interestRate", type: "uint256", internalType: "uint256" },
      { name: "createdAt", type: "uint256", internalType: "uint256" },
      { name: "lastUpdated", type: "uint256", internalType: "uint256" }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "getAvailableAmountAndRate",
    inputs: [],
    outputs: [
      { name: "availableAmount", type: "uint256", internalType: "uint256" },
      { name: "interestRate", type: "uint256", internalType: "uint256" }
    ],
    stateMutability: "pure"
  },
  {
    type: "function",
    name: "getDeposit",
    inputs: [{ name: "_depositId", type: "uint256", internalType: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct PeerToPeerLendingLibrary.Deposit",
        components: [
          { name: "id", type: "uint256", internalType: "uint256" },
          { name: "depositor", type: "address", internalType: "address" },
          { name: "amount", type: "uint256", internalType: "uint256" },
          { name: "interestRate", type: "uint256", internalType: "uint256" },
          { name: "createdAt", type: "uint256", internalType: "uint256" },
          { name: "lastUpdated", type: "uint256", internalType: "uint256" }
        ]
      },
      { name: "interestEarned", type: "uint256", internalType: "uint256" }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "getDepositIdsByAddress",
    inputs: [{ name: "user", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "uint256[]", internalType: "uint256[]" }],
    stateMutability: "view"
  },
  {
    "type":"function","name":"getAllDepositors",
    "inputs":[],
    "outputs":[
      {"name":"","type":"address[]","internalType":"address[]"},
      {"name":"","type":"uint256[]","internalType":"uint256[]"}
    ],
    "stateMutability":"view"
  },
  {
    type: "function",
    name: "getLoan",
    inputs: [{ name: "_loanId", type: "uint256", internalType: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct PeerToPeerLendingLibrary.Loan",
        components: [
          { name: "id", type: "uint256", internalType: "uint256" },
          { name: "lender", type: "address", internalType: "address" },
          { name: "borrower", type: "address", internalType: "address" },
          { name: "principal", type: "uint256", internalType: "uint256" },
          { name: "interestRate", type: "uint256", internalType: "uint256" },
          { name: "startTime", type: "uint256", internalType: "uint256" },
          { name: "duration", type: "uint256", internalType: "uint256" },
          { name: "amountRepaid", type: "uint256", internalType: "uint256" },
          { name: "state", type: "uint8", internalType: "enum PeerToPeerLendingLibrary.LoanState" }
        ]
      },
      { name: "totalAmountDue", type: "uint256", internalType: "uint256" }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "loanCounter",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "loans",
    inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    outputs: [
      { name: "id", type: "uint256", internalType: "uint256" },
      { name: "lender", type: "address", internalType: "address" },
      { name: "borrower", type: "address", internalType: "address" },
      { name: "principal", type: "uint256", internalType: "uint256" },
      { name: "interestRate", type: "uint256", internalType: "uint256" },
      { name: "startTime", type: "uint256", internalType: "uint256" },
      { name: "duration", type: "uint256", internalType: "uint256" },
      { name: "amountRepaid", type: "uint256", internalType: "uint256" },
      { name: "state", type: "uint8", internalType: "enum PeerToPeerLendingLibrary.LoanState" }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "repayLoan",
    inputs: [
      { name: "_loanId", type: "uint256", internalType: "uint256" },
      { name: "_amount", type: "uint256", internalType: "uint256" }
    ],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "requestLoan",
    inputs: [
      { name: "_lender", type: "address", internalType: "address" },
      { name: "_amount", type: "uint256", internalType: "uint256" },
      { name: "_duration", type: "uint256", internalType: "uint256" }
    ],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "token",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "contract IERC20" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "withdraw",
    inputs: [{ name: "_depositId", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "getLoansEmittedByAddress",
    inputs: [{ name: "_lender", type: "address", internalType: "address" }],
    outputs: [
      { name: "emittedLoans", type: "tuple[]", internalType: "struct PeerToPeerLendingLibrary.Loan[]", components: [{ name: "id", type: "uint256", internalType: "uint256" }, { name: "lender", type: "address", internalType: "address" }, { name: "borrower", type: "address", internalType: "address" }, { name: "principal", type: "uint256", internalType: "uint256" }, { name: "interestRate", type: "uint256", internalType: "uint256" }, { name: "startTime", type: "uint256", internalType: "uint256" }, { name: "duration", type: "uint256", internalType: "uint256" }, { name: "amountRepaid", type: "uint256", internalType: "uint256" }, { name: "state", type: "uint8", internalType: "enum PeerToPeerLendingLibrary.LoanState" }] }], stateMutability: "view" },
  { 
    type: "function", 
    name: "getLoansRequestedByAddress", 
    inputs: [{ name: "_borrower", type: "address", internalType: "address" }],
    outputs: [{ name: "requestedLoans", type: "tuple[]", internalType: "struct PeerToPeerLendingLibrary.Loan[]", components: [{ name: "id", type: "uint256", internalType: "uint256" },
       { name: "lender", type: "address", internalType: "address" }, { name: "borrower", type: "address", internalType: "address" }, { name: "principal", type: "uint256", internalType: "uint256" }, { name: "interestRate", type: "uint256", internalType: "uint256" }, { name: "startTime", type: "uint256", internalType: "uint256" }, { name: "duration", type: "uint256", internalType: "uint256" }, { name: "amountRepaid", type: "uint256", internalType: "uint256" }, { name: "state", type: "uint8", internalType: "enum PeerToPeerLendingLibrary.LoanState" }] }], stateMutability: "view" },
  {
    type: "event",
    name: "DepositMade",
    inputs: [
      { name: "depositor", type: "address", indexed: true, internalType: "address" },
      { name: "amount", type: "uint256", indexed: false, internalType: "uint256" },
      { name: "interestRate", type: "uint256", indexed: false, internalType: "uint256" }
    ],
    anonymous: false
  },
  {
    type: "event",
    name: "LoanApproved",
    inputs: [
      { name: "loanId", type: "uint256", indexed: true, internalType: "uint256" },
      { name: "lender", type: "address", indexed: true, internalType: "address" },
      { name: "borrower", type: "address", indexed: true, internalType: "address" },
      { name: "amount", type: "uint256", indexed: false, internalType: "uint256" },
      { name: "interestRate", type: "uint256", indexed: false, internalType: "uint256" },
      { name: "duration", type: "uint256", indexed: false, internalType: "uint256" }
    ],
    anonymous: false
  },
  {
    type: "event",
    name: "LoanRequested",
    inputs: [
      { name: "borrower", type: "address", indexed: true, internalType: "address" },
      { name: "lender", type: "address", indexed: true, internalType: "address" },
      { name: "amount", type: "uint256", indexed: false, internalType: "uint256" },
      { name: "interestRate", type: "uint256", indexed: false, internalType: "uint256" },
      { name: "duration", type: "uint256", indexed: false, internalType: "uint256" }
    ],
    anonymous: false
  },
  {
    type: "event",
    name: "LoanStateChanged",
    inputs: [
      { name: "loanId", type: "uint256", indexed: true, internalType: "uint256" },
      { name: "newState", type: "uint8", indexed: false, internalType: "enum PeerToPeerLendingLibrary.LoanState" }
    ],
    anonymous: false
  },
  {
    type: "event",
    name: "RepaymentMade",
    inputs: [
      { name: "loanId", type: "uint256", indexed: true, internalType: "uint256" },
      { name: "amount", type: "uint256", indexed: false, internalType: "uint256" }
    ],
    anonymous: false
  },
  {
    type: "event",
    name: "WithdrawalMade",
    inputs: [
      { name: "depositor", type: "address", indexed: true, internalType: "address" },
      { name: "amount", type: "uint256", indexed: false, internalType: "uint256" }
    ],
    anonymous: false
  },
  {
    type: "error",
    name: "DepositAmountMustBeGreaterThanZero",
    inputs: []
  },
  {
    type: "error",
    name: "DurationMustBeGreaterThanZero",
    inputs: []
  },
  {
    type: "error",
    name: "InsufficientDepositAmount",
    inputs: []
  },
  {
    type: "error",
    name: "InterestRateMismatch",
    inputs: []
  },
  {
    type: "error",
    name: "InterestRateMustBeGreaterThanZero",
    inputs: []
  },
  {
    type: "error",
    name: "LenderDoesNotHaveEnoughTokens",
    inputs: []
  },
  {
    type: "error",
    name: "LoanAmountMustBeGreaterThanZero",
    inputs: []
  },
  {
    type: "error",
    name: "OnlyBorrowerCanRepay",
    inputs: []
  },
  {
    type: "error",
    name: "RepaymentAmountMustBeGreaterThanZero",
    inputs: []
  },
  {
    type: "error",
    name: "RepaymentExceedsLoanAmount",
    inputs: []
  }
];

export { lendingContractABI };
