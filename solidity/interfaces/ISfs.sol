// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.18;
interface Sfs {
    function register(address _recipient) external returns (uint256 tokenId);
}