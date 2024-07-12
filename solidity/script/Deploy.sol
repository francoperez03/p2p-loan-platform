//SPDX-License_identifier: MIT
pragma solidity ^0.8.18;

import {Script} from 'forge-std/Script.sol';
import {IPeerToPeerLending} from '../interfaces/IPeerToPeerLending.sol';
import {PeerToPeerLending} from '../contracts/PeerToPeerLending.sol';
import {LoanToken} from '../contracts/LoanToken.sol';

contract Deploy is Script {

  address deployer;
  IERC20 internal token;
  IPeerToPeerLending internal lendingContract;
  uint256 INTEREST_RATE = 10e16;

  function run() external {
    deployer = vm.rememberKey(vm.envUint('DEPLOYER_PRIVATE_KEY'));

    vm.startBroadcast(deployer);
    token = new LoanToken(deployer);
    lendingContract = new PeerToPeerLending(address(token), INTEREST_RATE);
    vm.stopBroadcast();

  }

}