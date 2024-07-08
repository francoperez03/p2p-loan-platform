// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

library PeerToPeerLendingLibrary {
    struct Deposit {
        address depositor;
        uint256 amount;
        uint256 interestRate;
        uint256 lastClaimed;
    }

    enum LoanState { Pending, Active, Repaid }

    struct Loan {
        address lender;
        address borrower;
        uint256 principal;
        uint256 interestRate;
        uint256 startTime;
        uint256 duration;
        uint256 amountRepaid;
        LoanState state;
    }
}
