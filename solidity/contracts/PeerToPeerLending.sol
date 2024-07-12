// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {IPeerToPeerLending} from "../interfaces/IPeerToPeerLending.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {PeerToPeerLendingLibrary} from "../libraries/PeerToPeerLendingLibrary.sol";

interface IInterestRateProvider {
    function getInterestRate(address lender) external view returns (uint256);
}

contract PeerToPeerLending is IPeerToPeerLending {
    IERC20 public token;
    mapping(address => uint256[]) public depositIdsByAddress;
    PeerToPeerLendingLibrary.Deposit[] public deposits;
    mapping(uint256 => PeerToPeerLendingLibrary.Loan) public loans;

    uint256 public depositCounter;
    uint256 public loanCounter;
    uint256 public depositInterestRate;

    uint256 constant DECIMALS = 1e18;

    constructor(address _token, uint256 _depositInterestRate) {
        token = IERC20(_token);
        depositInterestRate = _depositInterestRate;
    }


    function calculateInterestEarned(uint256 _depositId) public view returns (uint256) {
        PeerToPeerLendingLibrary.Deposit storage calculateDeposit = deposits[_depositId];
        uint256 timeElapsed = block.timestamp - calculateDeposit.lastUpdated;
        uint256 interestEarned = calculateDeposit.amount * calculateDeposit.interestRate * timeElapsed / (365 days * DECIMALS);
        return interestEarned;
    }

    function deposit(uint256 _amount) external override returns (uint256 _depositId) {
        if (_amount <= 0) revert DepositAmountMustBeGreaterThanZero();

        token.transferFrom(msg.sender, address(this), _amount);

        uint256 depositId = depositCounter++;
        deposits.push(PeerToPeerLendingLibrary.Deposit({
            id: depositId,
            depositor: msg.sender,
            amount: _amount,
            interestRate: depositInterestRate,
            lastUpdated: block.timestamp
        }));

        emit DepositMade(msg.sender, _amount, depositInterestRate);

        return depositId;
    }

    function withdraw(uint256 _depositId) external override {
        PeerToPeerLendingLibrary.Deposit storage withdrawDeposit = deposits[_depositId];

        uint256 interestEarned = calculateInterestEarned(_depositId);
        uint256 amountToWithdraw = withdrawDeposit.amount;
        withdrawDeposit.amount = 0;
        withdrawDeposit.lastUpdated = block.timestamp;


        token.transfer(msg.sender, amountToWithdraw + interestEarned);

        emit WithdrawalMade(msg.sender, amountToWithdraw + interestEarned);
    }

    function requestLoan(address _lender, uint256 _amount, uint256 _duration) external override {
        if (_amount <= 0) revert LoanAmountMustBeGreaterThanZero();
        if (_duration <= 0) revert DurationMustBeGreaterThanZero();

        uint256 interestRate = 10 ether;
        loanCounter++;
        loans[loanCounter] = PeerToPeerLendingLibrary.Loan({
            id: loanCounter,
            lender: _lender,
            borrower: msg.sender,
            principal: _amount,
            interestRate: interestRate,
            startTime: block.timestamp,
            duration: _duration,
            amountRepaid: 0,
            state: PeerToPeerLendingLibrary.LoanState.Pending
        });

        emit LoanRequested(msg.sender, _lender, _amount, interestRate, _duration);
    }

    function approveLoan(uint256 _loanId) external override {
        PeerToPeerLendingLibrary.Loan storage loan = loans[_loanId];
        require(msg.sender == loan.lender, "Only the lender can approve this loan.");
        require(loan.state == PeerToPeerLendingLibrary.LoanState.Pending, "Loan is not pending.");

        PeerToPeerLendingLibrary.Deposit storage approveDeposit = deposits[1];
        if (approveDeposit.amount < loan.principal) revert InsufficientDepositAmount();

        approveDeposit.amount -= loan.principal;
        loan.state = PeerToPeerLendingLibrary.LoanState.Active;
        loan.startTime = block.timestamp;

        token.transfer(loan.borrower, loan.principal);

        emit LoanApproved(_loanId, loan.lender, loan.borrower, loan.principal, loan.interestRate, loan.duration);
        emit LoanStateChanged(_loanId, PeerToPeerLendingLibrary.LoanState.Active);
    }

    function repayLoan(uint256 _loanId, uint256 _amount) external override {
        PeerToPeerLendingLibrary.Loan storage loan = loans[_loanId];
        if (msg.sender != loan.borrower) revert OnlyBorrowerCanRepay();
        if (_amount <= 0) revert RepaymentAmountMustBeGreaterThanZero();
        
        uint256 totalDue = calculateTotalAmountDue(_loanId);
        if (loan.amountRepaid + _amount > totalDue) revert RepaymentExceedsLoanAmount();

        loan.amountRepaid += _amount;
        if (loan.amountRepaid >= totalDue) {
            loan.state = PeerToPeerLendingLibrary.LoanState.Repaid;
            emit LoanStateChanged(_loanId, PeerToPeerLendingLibrary.LoanState.Repaid);
        }

        token.transferFrom(msg.sender, loan.lender, _amount);

        emit RepaymentMade(_loanId, _amount);
    }


    //PURE-VIEW

    function getDepositInformation(uint256 _depositId) external view override returns (uint256 principal, uint256 interestRate, uint256 lastUpdated, uint256 interestEarned) {
        PeerToPeerLendingLibrary.Deposit storage infoDeposit = deposits[_depositId];

        principal = infoDeposit.amount;
        interestRate = infoDeposit.interestRate;
        lastUpdated = infoDeposit.lastUpdated;
        interestEarned = calculateInterestEarned(_depositId);

        return (principal, interestRate, lastUpdated, interestEarned);
    }

    function calculateTotalAmountDue(uint256 _loanId) public view returns (uint256) {
        PeerToPeerLendingLibrary.Loan storage loan = loans[_loanId];
        uint256 interest = loan.principal * loan.interestRate / 100 * loan.duration / 365 days;
        return loan.principal + interest;
    }

    function getLoanDetails(uint256 _loanId) external view override returns (PeerToPeerLendingLibrary.Loan memory, uint256 totalAmountDue) {
        PeerToPeerLendingLibrary.Loan storage loan = loans[_loanId];
        totalAmountDue = calculateTotalAmountDue(_loanId);
        return (loan, totalAmountDue);
    }

    function getAvailableAmountAndRate() external pure override returns (uint256 availableAmount, uint256 interestRate) {

        return (1, 2);
    }
}
