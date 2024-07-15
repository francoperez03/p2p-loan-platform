// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

library PeerToPeerLendingLibrary {
    struct Deposit {
        uint256 id;
        address depositor;
        uint256 amount;
        uint256 interestRate;
        uint256 createdAt;
        uint256 lastUpdated;
    }

    enum LoanState { Pending, Active, Repaid }

    struct Loan {
        uint256 id;
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
