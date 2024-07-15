// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Script, console} from "forge-std/Script.sol";
import {DevOpsTools} from "foundry-devops/src/DevOpsTools.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {PeerToPeerLending} from "../contracts/PeerToPeerLending.sol";

contract DepositToPeerToPeerLending is Script {
    uint256 public constant DEPOSIT_AMOUNT = 0.1 ether;

    function depositToLending(address mostRecentlyDeployed) public {
        PeerToPeerLending lendingContract = PeerToPeerLending(mostRecentlyDeployed);
        IERC20 token = IERC20(lendingContract.token());

        // Approve the contract to spend tokens on behalf of the sender
        vm.startBroadcast();
        token.approve(mostRecentlyDeployed, DEPOSIT_AMOUNT);
        lendingContract.deposit(DEPOSIT_AMOUNT);
        vm.stopBroadcast();
    }

    function run() external {
        address mostRecentlyDeployed = DevOpsTools.get_most_recent_deployment("PeerToPeerLending", block.chainid);
        depositToLending(mostRecentlyDeployed);
    }
}