// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "forge-std/Test.sol";
import "../contracts/PeerToPeerLending.sol";
import "./mocks/ERC20Mock.sol";

contract PeerToPeerLendingTest is Test {
    PeerToPeerLending lendingContract;
    MockERC20 token;
    address owner;
    address internal user1 = makeAddr('USER1');
    uint256 constant USER_INITAL_BALANCE = 100 ether;
    uint256 constant CONTRACT_INITAL_BALANCE = 100 ether;
    uint256 constant TOKENS_TO_DEPOSIT = 1 ether;
    uint256 constant TOKENS_TO_WITHDRAW = 1 ether;


    function setUp() public {
        owner = address(this);

        token = new MockERC20("Mock Token", "MTK", 18);
        lendingContract = new PeerToPeerLending(IERC20(address(token)), 10e16);

        token.mint(user1, USER_INITAL_BALANCE);
        token.mint(address(lendingContract), CONTRACT_INITAL_BALANCE);
    }

    function testDeposit() public {
        vm.startPrank(user1);
        token.approve(address(lendingContract), TOKENS_TO_DEPOSIT);
        uint256 balanceBefore = token.balanceOf(user1);

        uint256 depositId = lendingContract.deposit(TOKENS_TO_DEPOSIT);
        uint256 balanceAfter = token.balanceOf(user1);
        (uint256 principal, , , ) = lendingContract.getDepositInformation(depositId);

        assertEq(balanceBefore - TOKENS_TO_DEPOSIT, balanceAfter);
        assertEq(principal, TOKENS_TO_DEPOSIT);
        vm.stopPrank();
    }

    function testWithdraw() public {
        vm.startPrank(user1);
        token.approve(address(lendingContract), TOKENS_TO_DEPOSIT);
        uint256 depositId = lendingContract.deposit(TOKENS_TO_DEPOSIT);

        vm.warp(block.timestamp + 30 days);

        uint256 balanceBefore = token.balanceOf(user1);
        lendingContract.withdraw(depositId);

        uint256 balanceAfter = token.balanceOf(user1);
        assertGt(balanceAfter, balanceBefore); 

        vm.stopPrank();
    }

    function testGetDepositInformation() public {
        vm.startPrank(user1);
        token.approve(address(lendingContract), TOKENS_TO_DEPOSIT);
        lendingContract.deposit(TOKENS_TO_DEPOSIT);

        vm.warp(block.timestamp + 30 days);

        (uint256 principal,, , uint256 interestEarned) = lendingContract.getDepositInformation(0);
        assertEq(principal, TOKENS_TO_DEPOSIT);
        assertGt(interestEarned, 0);

        vm.stopPrank();
    }
}
