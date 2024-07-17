// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Script, console} from "forge-std/Script.sol";
import {DevOpsTools} from "foundry-devops/src/DevOpsTools.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {PeerToPeerLending} from "../contracts/PeerToPeerLending.sol";

contract DepositToPeerToPeerLending is Script {
    uint256 public constant DEPOSIT_AMOUNT = 0.001 ether;
    address LENDING_COTRACT_ADDRESS = 0x11f74B3923879088160dD0F3B0609228160027d0;
    function depositToLending() public {
        PeerToPeerLending lendingContract = PeerToPeerLending(LENDING_COTRACT_ADDRESS);
        IERC20 token = IERC20(lendingContract.token());

        vm.startBroadcast();
        token.approve(LENDING_COTRACT_ADDRESS, DEPOSIT_AMOUNT);
        lendingContract.deposit(DEPOSIT_AMOUNT);
        vm.stopBroadcast();
    }

    function run() external {
        depositToLending();
    }
}