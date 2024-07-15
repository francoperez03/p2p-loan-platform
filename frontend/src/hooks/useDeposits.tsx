import { useReadContract, useReadContracts } from 'wagmi';
import { useState, useEffect, useMemo } from 'react';
import { useWeb3 } from './useWeb3';
import { lendingContract } from '../utils/contractAddresses';
import { DepositWithInterest } from '../types/deposit';

export const useDeposits = () => {
  const { address } = useWeb3();
  const [deposits, setDeposits] = useState<DepositWithInterest[]>([]);

  const { data: depositIds, isLoading: depositIdsLoading, error: depositIdsError } = useReadContract({
    address: lendingContract.testnet,
    abi: lendingContract.abi,
    functionName: 'getDepositIdsByAddress',
    args: [address],
  });
  console.log({depositIds, depositIdsLoading, depositIdsError})

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

  const { data: depositsData, isLoading: depositsDataLoading, error: depositsDataError } = useReadContracts({
    contracts: contractCalls,
  });

  console.log({depositsData, depositsDataLoading, depositsDataError})


  useEffect(() => {
    if (depositsData && depositsData.length > 0) {
      setDeposits(depositsData.map(deposit => deposit.result) as DepositWithInterest[]);
      console.log({ a:'a' });
    }
  }, [depositsData]);

  return {
    deposits,
    loading: depositIdsLoading || depositsDataLoading,
    error: depositIdsError || depositsDataError,
  };
};
