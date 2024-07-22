// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Script, console} from "forge-std/Script.sol";
import {DevOpsTools} from "foundry-devops/src/DevOpsTools.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {LoanToken} from "../contracts/LoanToken.sol";

contract TransferTokens is Script {
    uint256 public constant DEPOSIT_AMOUNT = 0.001 ether;
    address TOKEN_CONTRACT_ADDRESS = 0xA81Df4561F568B42459239f944e58656415368Dc;
    address USER = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;
    function transferToken() public {
        LoanToken loanToken = LoanToken(TOKEN_CONTRACT_ADDRESS);

        vm.startBroadcast();
        loanToken.mint(USER, 100 ether);
        vm.stopBroadcast();
    }

    function run() external {
        transferToken();
    }

}
