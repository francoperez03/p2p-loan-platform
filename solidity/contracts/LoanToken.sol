// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import {ILoanToken} from '../interfaces/ILoanToken.sol';


contract LoanToken is ERC20, ERC20Burnable, Ownable, ILoanToken {
    constructor(address initialOwner)
        ERC20("LoanToken", "LT")
        Ownable(initialOwner)
    {}

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}