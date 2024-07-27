// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {PeerToPeerLendingLibrary} from "../libraries/PeerToPeerLendingLibrary.sol";

/*
* @title IPeerToPeerLending
* @dev Interface for the PeerToPeerLending contract
*/
interface IPeerToPeerLending {

    /*///////////////////////////////////////////////////////////////
                              EVENTS
    //////////////////////////////////////////////////////////////*/

    event DepositMade(address indexed depositor, uint256 amount, uint256 interestRate);
    event LoanRequested(address indexed borrower, address indexed lender, uint256 amount, uint256 interestRate, uint256 duration);
    event LoanApproved(uint256 indexed loanId, address indexed lender, address indexed borrower, uint256 amount, uint256 interestRate, uint256 duration);
    event RepaymentMade(uint256 indexed loanId, uint256 amount);
    event WithdrawalMade(address indexed depositor, uint256 amount);
    event LoanStateChanged(uint256 indexed loanId, PeerToPeerLendingLibrary.LoanState newState);

    /*///////////////////////////////////////////////////////////////
                            ERRORS
    //////////////////////////////////////////////////////////////*/

    error DepositAmountMustBeGreaterThanZero();
    error InterestRateMustBeGreaterThanZero();
    error InsufficientDepositAmount();
    error InterestRateMismatch();
    error LoanAmountMustBeGreaterThanZero();
    error DurationMustBeGreaterThanZero();
    error LenderDoesNotHaveEnoughTokens();
    error OnlyBorrowerCanRepay();
    error RepaymentAmountMustBeGreaterThanZero();
    error RepaymentExceedsLoanAmount();
  
    /*///////////////////////////////////////////////////////////////
                            LOGIC
    //////////////////////////////////////////////////////////////*/

    function deposit(uint256 _amount) external returns (uint256 _depositId);
    function depositWithPermit(
        uint256 _amount,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    )  external returns (uint256 _depositId);
    function withdraw(uint256 _amount) external;
    function requestLoan(address _lender, uint256 _amount, uint256 _duration) external;
    function approveLoan(uint256 _loanId)  external;
    function repayLoan(uint256 _loanId, uint256 _amount) external;

    /*///////////////////////////////////////////////////////////////
                    GETTERS (PURE AND VIEW)
    //////////////////////////////////////////////////////////////*/

    function getDeposit(uint256 _depositId) external view returns (PeerToPeerLendingLibrary.Deposit memory, uint256 interestEarned);
    function getAllDepositors() external view returns (address[] memory, uint256[] memory);
    function getDepositIdsByAddress(address user) external view returns (uint256[] memory);
    function getLoan(uint256 _loanId) external view returns (PeerToPeerLendingLibrary.Loan memory, uint256 totalAmountDue);
    function getLoansRequestedByAddress(address _borrower) external view returns (PeerToPeerLendingLibrary.Loan[] memory requestedLoans);
    function getLoansEmittedByAddress(address _lender) external view returns (PeerToPeerLendingLibrary.Loan[] memory emittedLoans);
    function getAvailableAmountAndRate() external pure returns (uint256 availableAmount, uint256 interestRate);
    function getAllAvailableFunds() external view returns (address[] memory, uint256[] memory);
}
