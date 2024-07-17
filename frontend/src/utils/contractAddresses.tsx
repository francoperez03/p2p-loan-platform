import { Abi, Address, getAddress } from "viem";
import { lendingContractABI } from "../abis/LendingContractABI";
import { tokenContractABI } from "../abis/TokenContractABI";

type Contract = {
  mainnet: Address;
  testnet: Address;
  abi: Abi;
};

const LENDING_CONTRACT_ADDRESS = (import.meta.env.VITE_LENDING_CONTRACT_ADDRESS  || '') as string;
const TOKEN_CONTRACT_ADDRESS = (import.meta.env.VITE_TOKEN_CONTRACT_ADDRESS  || '') as string;

console.log({LENDING_CONTRACT_ADDRESS})
const lendingContract: Contract = {
  mainnet: getAddress(LENDING_CONTRACT_ADDRESS),
  testnet: getAddress(LENDING_CONTRACT_ADDRESS),
  abi: lendingContractABI,
}
const tokenContract: Contract = {
  mainnet: getAddress(TOKEN_CONTRACT_ADDRESS),
  testnet: getAddress(TOKEN_CONTRACT_ADDRESS),
  abi: tokenContractABI
}

export { lendingContract, tokenContract }