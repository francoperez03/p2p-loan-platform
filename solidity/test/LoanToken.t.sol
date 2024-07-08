// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import { LoanToken} from "../contracts/LoanToken.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

contract TestLoanToken is Test {
    LoanToken token;
    address internal owner = makeAddr('owner');
    address internal user1 = makeAddr('user');

    function setUp() public {
        token = new LoanToken(owner);
    }

    function testMint() public {
        vm.prank(owner);
        token.mint(user1, 1000);

        assertEq(token.balanceOf(user1), 1000);
    }

    function testMintNonOwner() public {
        vm.prank(user1);
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, user1));

        token.mint(user1, 1000);
    }

    function testBurn() public {
        vm.prank(owner);
        token.mint(user1, 1000);

        vm.prank(user1);
        token.burn(500);

        assertEq(token.balanceOf(user1), 500);
    }

    function testOwnershipTransfer() public {
        vm.prank(owner);
        token.transferOwnership(user1);

        assertEq(token.owner(), user1);
    }

    function testOwnershipTransferNonOwner() public {
        vm.prank(user1);
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, user1));
        token.transferOwnership(user1);
    }
}
