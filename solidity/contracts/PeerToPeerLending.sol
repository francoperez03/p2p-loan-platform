// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {IPeerToPeerLending} from "../interfaces/IPeerToPeerLending.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {PeerToPeerLendingLibrary} from "../libraries/PeerToPeerLendingLibrary.sol";

contract PeerToPeerLending is IPeerToPeerLending {
    IERC20 public token;
    mapping(address => PeerToPeerLendingLibrary.Deposit) public deposits;
    mapping(uint256 => PeerToPeerLendingLibrary.Loan) public loans;
    uint256 public loanCounter;

    constructor(IERC20 _token) {
        token = _token;
    }

    function deposit(uint256 _amount, uint256 _interestRate) external override {
        if (_amount <= 0) revert DepositAmountMustBeGreaterThanZero();
        if (_interestRate <= 0) revert InterestRateMustBeGreaterThanZero();

        token.transferFrom(msg.sender, address(this), _amount);

        deposits[msg.sender] = PeerToPeerLendingLibrary.Deposit({
            depositor: msg.sender,
            amount: _amount,
            interestRate: _interestRate,
            lastClaimed: block.timestamp
        });

        emit DepositMade(msg.sender, _amount, _interestRate);
    }

    function withdraw(uint256 _amount) external override {
        PeerToPeerLendingLibrary.Deposit storage deposit = deposits[msg.sender];
        if (_amount > deposit.amount) revert InsufficientDepositAmount();

        //TODO How many tokens should be transferred to the user?

        emit WithdrawalMade(msg.sender, _amount);
    }

    function requestLoan(address _lender, uint256 _amount, uint256 _interestRate, uint256 _duration) external override {
        if (_amount <= 0) revert LoanAmountMustBeGreaterThanZero();
        if (_interestRate <= 0) revert InterestRateMustBeGreaterThanZero();
        if (_duration <= 0) revert DurationMustBeGreaterThanZero();
        if (deposits[_lender].amount < _amount) revert LenderDoesNotHaveEnoughTokens();
        //TODO

        emit LoanRequested(msg.sender, _lender, _amount, _interestRate, _duration);
    }

    function approveLoan(address _borrower, uint256 _amount, uint256 _interestRate, uint256 _duration) external override {
        PeerToPeerLendingLibrary.Deposit storage deposit = deposits[msg.sender];
        if (deposit.amount < _amount) revert InsufficientDepositAmount();
        if (deposit.interestRate != _interestRate) revert InterestRateMismatch();

        deposit.amount -= _amount;

        //TODO

        loanCounter++;
    }

    function repayLoan(uint256 _loanId, uint256 _amount) external override {
        PeerToPeerLendingLibrary.Loan storage loan = loans[_loanId];
        if (msg.sender != loan.borrower) revert OnlyBorrowerCanRepay();
        if (_amount <= 0) revert RepaymentAmountMustBeGreaterThanZero();
        
       //TODO

        emit RepaymentMade(_loanId, _amount);
    }

    function calculateTotalAmountDue(uint256 _loanId) public view override returns (uint256) {
        PeerToPeerLendingLibrary.Loan storage loan = loans[_loanId];
        uint256 totalDue = 0;     //TODO
        return totalDue;
    }

    function getLoanDetails(uint256 _loanId) external view override returns (PeerToPeerLendingLibrary.Loan memory) {
        return loans[_loanId];
    }
}
