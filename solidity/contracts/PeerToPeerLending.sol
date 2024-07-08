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

    function requestLoan(address _lender, uint256 _amount, uint256 _interestRate, uint256 _duration) external override {
        if (_amount <= 0) revert LoanAmountMustBeGreaterThanZero();
        if (_interestRate <= 0) revert InterestRateMustBeGreaterThanZero();
        if (_duration <= 0) revert DurationMustBeGreaterThanZero();
        if (deposits[_lender].amount < _amount) revert LenderDoesNotHaveEnoughTokens();

        emit LoanRequested(msg.sender, _lender, _amount, _interestRate, _duration);
    }

    function approveLoan(address _borrower, uint256 _amount, uint256 _interestRate, uint256 _duration) external override {
        PeerToPeerLendingLibrary.Deposit storage deposit = deposits[msg.sender];
        if (deposit.amount < _amount) revert InsufficientDepositAmount();
        if (deposit.interestRate != _interestRate) revert InterestRateMismatch();

        deposit.amount -= _amount;

        loans[loanCounter] = PeerToPeerLendingLibrary.Loan({
            lender: msg.sender,
            borrower: _borrower,
            principal: _amount,
            interestRate: _interestRate,
            startTime: block.timestamp,
            duration: _duration,
            amountRepaid: 0
        });

        token.transfer(_borrower, _amount);

        emit LoanApproved(loanCounter, msg.sender, _borrower, _amount, _interestRate, _duration);
        loanCounter++;
    }

    function repayLoan(uint256 _loanId, uint256 _amount) external override {
        PeerToPeerLendingLibrary.Loan storage loan = loans[_loanId];
        if (msg.sender != loan.borrower) revert OnlyBorrowerCanRepay();
        if (_amount <= 0) revert RepaymentAmountMustBeGreaterThanZero();
        
        uint256 totalDue = loan.principal + (loan.principal * loan.interestRate / 100 * loan.duration / 365 days);
        if (loan.amountRepaid + _amount > totalDue) revert RepaymentExceedsLoanAmount();

        loan.amountRepaid += _amount;
        token.transferFrom(msg.sender, loan.lender, _amount);

        emit RepaymentMade(_loanId, _amount);
    }

    function calculateTotalAmountDue(uint256 _loanId) public view override returns (uint256) {
        PeerToPeerLendingLibrary.Loan storage loan = loans[_loanId];
        uint256 interest = loan.principal * loan.interestRate / 100 * loan.duration / 365 days;
        return loan.principal + interest;
    }

    function getLoanDetails(uint256 _loanId) external view override returns (PeerToPeerLendingLibrary.Loan memory) {
        return loans[_loanId];
    }

    function withdraw(uint256 _amount) external override {
        PeerToPeerLendingLibrary.Deposit storage deposit = deposits[msg.sender];
        if (_amount > deposit.amount) revert InsufficientDepositAmount();

        deposit.amount -= _amount;
        token.transfer(msg.sender, _amount);

        emit WithdrawalMade(msg.sender, _amount);
    }
}
