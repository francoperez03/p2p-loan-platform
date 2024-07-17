import { useReadContract, useReadContracts, useWriteContract, useWaitForTransactionReceipt, useSignTypedData } from 'wagmi';
import { useState, useEffect, useMemo } from 'react';
import { useWeb3 } from './useWeb3';
import { lendingContract } from '../utils/contractAddresses';
import { DepositWithInterest } from '../types/deposit';
import { useInterestRate } from './useInterestRate';
import useSignPermit from './useSignPermit';

const GET_DEPOSIT_BY_ADDRESS_FUNCTION_NAME = 'getDepositIdsByAddress'
export const useDeposits = () => {
  const { isConnected, address, gasPrice } = useWeb3();
  const [deposits, setDeposits] = useState<DepositWithInterest[]>([]);
  const { interestRate, interestRateLoading } = useInterestRate();
  const { data: depositHash, isPending: depositLoading, writeContract: writeDeposit, error } = useWriteContract();
  const { isLoading: depositIsConfirming, isSuccess: depositConfirmed, error: depositError } = useWaitForTransactionReceipt({ hash: depositHash });
  const signPermit = useSignPermit();


  const { data: depositIds, isLoading: depositIdsLoading } = useReadContract({
    address: lendingContract.testnet,
    abi: lendingContract.abi,
    functionName: GET_DEPOSIT_BY_ADDRESS_FUNCTION_NAME,
    args: [address],
  });

  const contractCalls = useMemo(() => {
    const localDepositIds: number[] = depositIds as number[]
    if (!depositIds || localDepositIds.length === 0) return [];
    return (localDepositIds).map(depositId => ({
      address: lendingContract.testnet,
      abi: lendingContract.abi,
      functionName: 'getDeposit',
      args: [depositId],
    }));
  }, [depositIds]);

  const { data: depositsData, isLoading: depositsDataLoading } = useReadContracts({
    contracts: contractCalls,
  });

  useEffect(() => {
    if (depositsData && depositsData.length > 0) {
      const localDepositsData = depositsData?.map(depositData => ({ deposit: depositData.result[0], interestEarned: depositData.result[1]}))
      setDeposits(localDepositsData as DepositWithInterest[]);
    }
  }, [depositsData]);


  const deposit = async (amountToDeposit: bigint) => {
    try {
      const {value, deadline, v,r,s} = await signPermit({spender: lendingContract.testnet, value: amountToDeposit} )
      writeDeposit({
        address: lendingContract.testnet,
        abi: lendingContract.abi,
        functionName: 'depositWithPermit',
        args: [value, deadline, v, r, s],
        gasPrice,
      });
    } catch (error) {
      console.error('Error during deposit:', error);
    }
  };


  return {
    address,
    isConnected,
    deposits,
    interestRate,
    loading: depositIdsLoading || depositsDataLoading || interestRateLoading,
    deposit,
    depositLoading,
    depositIsConfirming,
    depositConfirmed
  };
};
