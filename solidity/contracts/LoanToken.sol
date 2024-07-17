// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import { ERC20Permit } from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import {ILoanToken} from '../interfaces/ILoanToken.sol';
import { Sfs } from "../interfaces/ISfs.sol";



contract LoanToken is ERC20, ERC20Burnable, ERC20Permit, Ownable, ILoanToken {
    constructor(address initialOwner)
        ERC20("LoanToken", "LT")
        ERC20Permit("LoanToken")
        Ownable(initialOwner)
    {
      Sfs sfsContract = Sfs(0xBBd707815a7F7eb6897C7686274AFabd7B579Ff6);
      sfsContract.register(msg.sender); 
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}