import { useCallback } from 'react';
import { Address, Hex } from 'viem';
import { useSignTypedData } from 'wagmi';
import dayjs from 'dayjs';
import { splitSignature } from '@ethersproject/bytes';
import { useWeb3 } from './useWeb3';
import { tokenContract } from '../utils/contractAddresses';
import { readContract } from '@wagmi/core'
import { wagmiConfig } from '../utils/wagmi';

const NONCES_FUNCTION_NAME = 'nonces'

export default function useSignPermit() {
  const DURATION = 3600

  const { signTypedDataAsync } = useSignTypedData();
  const { chainId, address } = useWeb3();

  return useCallback(
    async ({
      spender,
      value,
    }: {
      spender: Address;
      value: bigint;
    }) => {
      if (!address) {
        throw new Error('Address is not defined');
      }
      const version = '1';
      const deadline = BigInt(dayjs().unix() + DURATION);
      let nonce:bigint = 5n;
      try{
         nonce = (await readContract(wagmiConfig, {
          address: tokenContract.testnet,
          abi: tokenContract.abi,
          functionName: NONCES_FUNCTION_NAME,
          args: [address],
        })) as bigint
      }
      catch(e){
        console.log('ds')
        console.log({e})
      }
      console.log({
        owner: address,
        spender,
        value,
        nonce,
        deadline,
      })
      const signatureHex = await signTypedDataAsync({
        primaryType: 'Permit',
        domain: {
          name: 'LoanToken',
          version,
          chainId,
          verifyingContract: tokenContract.testnet,
        },
        types: {
          Permit: [
            { name: 'owner', type: 'address' },
            { name: 'spender', type: 'address' },
            { name: 'value', type: 'uint256' },
            { name: 'nonce', type: 'uint256' },
            { name: 'deadline', type: 'uint256' },
          ],
        },
        message: {
          owner: address,
          spender,
          value,
          nonce,
          deadline,
        },
      });
      const { v, r, s } = splitSignature(signatureHex);

      return {
        value,
        deadline,
        v,
        r: r as Hex,
        s: s as Hex,
      };
    },
    [chainId, signTypedDataAsync, address],
  );
}
