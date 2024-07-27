//SPDX-License_identifier: MIT
pragma solidity ^0.8.18;

import {Script} from 'forge-std/Script.sol';
import {IPeerToPeerLending} from '../interfaces/IPeerToPeerLending.sol';
import {PeerToPeerLending} from '../contracts/PeerToPeerLending.sol';
import {LoanToken} from '../contracts/LoanToken.sol';
import {ILoanToken} from '../interfaces/ILoanToken.sol';
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";


contract Deploy is Script {

  address deployer;
  ILoanToken internal token;
  IPeerToPeerLending internal lendingContract;
  uint256 INTEREST_RATE = 10e16;
  address USER = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;

  function run() external {
    vm.startBroadcast();
    token = new LoanToken(msg.sender);
    lendingContract = new PeerToPeerLending(address(token), INTEREST_RATE);
    token.mint(msg.sender, 100 ether);
    token.mint(USER, 100 ether);
    token.mint(address(lendingContract), 100 ether);
    vm.stopBroadcast();

  }

}