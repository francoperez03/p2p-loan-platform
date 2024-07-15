import { Abi, Address, getAddress } from "viem";
import { lendingContractABI } from "../abis/LendingContractABI";

type Contract = {
  mainnet: Address;
  testnet: Address;
  abi: Abi;
};

const LENDING_CONTRACT_ADDRESS = (import.meta.env.VITE_LENDING_CONTRACT_ADDRESS  || '') as string;
console.log({LENDING_CONTRACT_ADDRESS})
const lendingContract :Contract = {
  mainnet: getAddress(LENDING_CONTRACT_ADDRESS),
  testnet: getAddress(LENDING_CONTRACT_ADDRESS),
  abi: lendingContractABI
}
export { lendingContract }