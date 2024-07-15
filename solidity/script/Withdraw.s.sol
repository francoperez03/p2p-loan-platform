// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Script, console} from "forge-std/Script.sol";
import {DevOpsTools} from "foundry-devops/src/DevOpsTools.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {PeerToPeerLending} from "../contracts/PeerToPeerLending.sol";

contract WithdrawFromPeerToPeerLending is Script {

    function withdrawFromLending(address mostRecentlyDeployed, uint256 depositId) public {
        PeerToPeerLending lendingContract = PeerToPeerLending(mostRecentlyDeployed);

        vm.startBroadcast();
        lendingContract.withdraw(depositId);
        vm.stopBroadcast();
    }

    function run() external {
        address mostRecentlyDeployed = DevOpsTools.get_most_recent_deployment("PeerToPeerLending", block.chainid);
        uint256 depositId = 0; // Asegúrate de pasar el ID correcto del depósito
        withdrawFromLending(mostRecentlyDeployed, depositId);
    }
}
