// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import { IPeerToPeerLending } from "../interfaces/IPeerToPeerLending.sol";
import { IERC20Permit } from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Permit.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { PeerToPeerLendingLibrary } from "../libraries/PeerToPeerLendingLibrary.sol";
import { Sfs } from "../interfaces/ISfs.sol";

contract PeerToPeerLending is IPeerToPeerLending {
    IERC20 public token;

    address[] public allDepositors;
    mapping(address => bool) public isDepositor;
    mapping(address => uint256) public totalDeposits;
    mapping(address => uint256) public availableFunds;

    address[] public allLenders;
    mapping(address => uint256[]) public depositIdsByAddress;
    PeerToPeerLendingLibrary.Deposit[] public deposits;

    mapping(uint256 => PeerToPeerLendingLibrary.Loan) public loans;
    mapping(address => uint256[]) public loanIdsByLender;
    mapping(address => uint256[]) public loanIdsByBorrower;

    uint256 public depositCounter;
    uint256 public loanCounter;
    uint256 public depositInterestRate;

    uint256 constant DECIMALS = 1e18;
    uint256 constant LOAN_INTEREST_RATE = 12e16;
  
    constructor(address _token, uint256 _depositInterestRate) {
        token = IERC20(_token);
        depositInterestRate = _depositInterestRate;
        Sfs sfsContract = Sfs(0xBBd707815a7F7eb6897C7686274AFabd7B579Ff6);
        sfsContract.register(msg.sender);
    }


    function calculateInterestEarned(uint256 _depositId) public view returns (uint256) {
        PeerToPeerLendingLibrary.Deposit storage calculateDeposit = deposits[_depositId];
        uint256 timeElapsed = block.timestamp - calculateDeposit.lastUpdated;
        uint256 interestEarned = calculateDeposit.amount * calculateDeposit.interestRate * timeElapsed / (365 days * DECIMALS);
        return interestEarned;
    }


    function _deposit(uint256 _amount) internal returns(uint256 _depositId) {
        uint256 depositId = depositCounter++;
        deposits.push(PeerToPeerLendingLibrary.Deposit({
            id: depositId,
            depositor: msg.sender,
            amount: _amount,
            interestRate: depositInterestRate,
            lastUpdated: block.timestamp,
            createdAt: block.timestamp
        }));
        depositIdsByAddress[msg.sender].push(depositId);

        if (!isDepositor[msg.sender]) {
            allDepositors.push(msg.sender);
            isDepositor[msg.sender] = true;
        }
        totalDeposits[msg.sender] += _amount;
        availableFunds[msg.sender] += _amount;

        token.transferFrom(msg.sender, address(this), _amount);

        emit DepositMade(msg.sender, _amount  , depositInterestRate);
        return depositId;
    }

    function deposit(uint256 _amount) external override returns (uint256 _depositId) {
      return _deposit(_amount);
    }

    function depositWithPermit(
        uint256 _amount,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external override returns (uint256 _depositId) {
        if (_amount <= 0) revert DepositAmountMustBeGreaterThanZero();

        IERC20Permit(address(token)).permit(
            msg.sender,
            address(this),
            _amount,
            deadline,
            v,
            r,
            s
        );

        return _deposit(_amount);
    }

    function withdraw(uint256 _depositId) external override {
        PeerToPeerLendingLibrary.Deposit storage withdrawDeposit = deposits[_depositId];
        uint256 interestEarned = calculateInterestEarned(_depositId);
        uint256 amountToWithdraw = withdrawDeposit.amount;
        
        require(withdrawDeposit.depositor == msg.sender, "Not the depositor");
        withdrawDeposit.amount = 0;
        withdrawDeposit.lastUpdated = block.timestamp;
        availableFunds[msg.sender] -= amountToWithdraw;

        _removeDepositId(msg.sender, _depositId);
        totalDeposits[msg.sender] -= amountToWithdraw;

        token.transfer(msg.sender, amountToWithdraw + interestEarned);

        emit WithdrawalMade(msg.sender, amountToWithdraw + interestEarned);
    }

     function _removeDepositId(address _depositor, uint256 _depositId) internal {
        uint256[] storage ids = depositIdsByAddress[_depositor];
        uint256 length = ids.length;
        for (uint256 i = 0; i < length; i++) {
            if (ids[i] == _depositId) {
                ids[i] = ids[length - 1];
                ids.pop();
                break;
            }
        }
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
            interestRate: LOAN_INTEREST_RATE,
            startTime: block.timestamp,
            duration: _duration,
            amountRepaid: 0,
            state: PeerToPeerLendingLibrary.LoanState.Pending
        });
        
        loanIdsByLender[_lender].push(loanCounter);
        loanIdsByBorrower[msg.sender].push(loanCounter);

        emit LoanRequested(msg.sender, _lender, _amount, interestRate, _duration);
    }

    function approveLoan(uint256 _loanId) external override {
        PeerToPeerLendingLibrary.Loan storage loan = loans[_loanId];
        require(msg.sender == loan.lender, "Only the lender can approve this loan.");
        require(loan.state == PeerToPeerLendingLibrary.LoanState.Pending, "Loan is not pending.");

        if (availableFunds[loan.lender] < loan.principal) revert InsufficientDepositAmount();

        availableFunds[loan.lender] -= loan.principal;
        loan.state = PeerToPeerLendingLibrary.LoanState.Active;
        loan.startTime = block.timestamp;

        token.transfer(loan.borrower, loan.principal);

        emit LoanApproved(_loanId, loan.lender, loan.borrower, loan.principal, loan.interestRate, loan.duration);
        emit LoanStateChanged(_loanId, PeerToPeerLendingLibrary.LoanState.Active);
    }

    function _repayLoan(uint256 _loanId, uint256 _amount) internal {
        PeerToPeerLendingLibrary.Loan storage loan = loans[_loanId];
        if (msg.sender != loan.borrower) revert OnlyBorrowerCanRepay();
        if (_amount <= 0) revert RepaymentAmountMustBeGreaterThanZero();
        
        uint256 totalDue = calculateTotalAmountDue(_loanId);
        if (loan.amountRepaid + _amount > totalDue) revert RepaymentExceedsLoanAmount();

        loan.amountRepaid += _amount;
        availableFunds[msg.sender] += _amount;
        if (loan.amountRepaid >= totalDue) {
            loan.state = PeerToPeerLendingLibrary.LoanState.Repaid;
            emit LoanStateChanged(_loanId, PeerToPeerLendingLibrary.LoanState.Repaid);
        }

        token.transferFrom(msg.sender, loan.lender, _amount);

        emit RepaymentMade(_loanId, _amount);
    }

    function repayLoan(uint256 _loanId, uint256 _amount) external override {
        return _repayLoan(_loanId, _amount);
    }


    function repayLoanWithPermit(
        uint256 _loanId,
        uint256 _amount,
        uint256 _deadline,
        uint8 _v,
        bytes32 _r,
        bytes32 _s
    ) external override {

        IERC20Permit(address(token)).permit(
            msg.sender,
            address(this),
            _amount,
            _deadline,
            _v,
            _r,
            _s
        );

        return _repayLoan(_loanId, _amount);

    }

    //PURE-VIEW
    function calculateTotalAmountDue(uint256 _loanId) internal view returns (uint256) {
        PeerToPeerLendingLibrary.Loan storage loan = loans[_loanId];
        uint256 interest = loan.principal * loan.interestRate / 100 * loan.duration / 365 days;
        return loan.principal + interest;
    }

    function getDeposit(uint256 _depositId) external view override returns (PeerToPeerLendingLibrary.Deposit memory, uint256 interestEarned) {
        PeerToPeerLendingLibrary.Deposit storage infoDeposit = deposits[_depositId];
        interestEarned = calculateInterestEarned(_depositId);
        return (infoDeposit, interestEarned);
    }

    function getAllDepositors() external view override returns (address[] memory, uint256[] memory) {
        uint256[] memory amounts = new uint256[](allDepositors.length);
        for (uint i = 0; i < allDepositors.length; i++) {
            amounts[i] = totalDeposits[allDepositors[i]];
        }
        return (allDepositors, amounts);
    }

    function getAllAvailableFunds() external view override returns (address[] memory, uint256[] memory) {
        uint256[] memory amounts = new uint256[](allDepositors.length);
        for (uint i = 0; i < allDepositors.length; i++) {
            amounts[i] = availableFunds[allDepositors[i]];
        }
        return (allDepositors, amounts);
    }

    function getDepositIdsByAddress(address user) external view returns (uint256[] memory) {
        return depositIdsByAddress[user];
    }

    function getLoan(uint256 _loanId) external view override returns (PeerToPeerLendingLibrary.Loan memory, uint256 totalAmountDue) {
        PeerToPeerLendingLibrary.Loan storage loan = loans[_loanId];
        totalAmountDue = calculateTotalAmountDue(_loanId);
        return (loan, totalAmountDue);
    }
    function getLoansEmittedByAddress(address _lender) external view override returns (PeerToPeerLendingLibrary.Loan[] memory emittedLoans) {
        uint256 emittedCount = loanIdsByLender[_lender].length;
        emittedLoans = new PeerToPeerLendingLibrary.Loan[](emittedCount);

        for (uint256 i = 0; i < emittedCount; i++) {
            emittedLoans[i] = loans[loanIdsByLender[_lender][i]];
        }
    }

    function getLoansRequestedByAddress(address _borrower) external view override returns (PeerToPeerLendingLibrary.Loan[] memory requestedLoans) {
        uint256 requestedCount = loanIdsByBorrower[_borrower].length;
        requestedLoans = new PeerToPeerLendingLibrary.Loan[](requestedCount);

        for (uint256 i = 0; i < requestedCount; i++) {
            requestedLoans[i] = loans[loanIdsByBorrower[_borrower][i]];
        }
    }

    function getAvailableAmountAndRate() external pure override returns (uint256 availableAmount, uint256 interestRate) {
      return(0.1 ether, LOAN_INTEREST_RATE);
    }
}
