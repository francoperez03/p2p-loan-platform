import { useReadContract, useReadContracts, useWriteContract, UseReadContractsReturnType, useWaitForTransactionReceipt } from 'wagmi';
import { useState, useEffect, useMemo } from 'react';
import { useWeb3 } from './useWeb3';
import { lendingContract } from '../utils/contractAddresses';
import { DepositWithInterest, LocalDeposit } from '../types/deposit';
import { useInterestRate } from './useInterestRate';
import useSignPermit from './useSignPermit';

const GET_DEPOSIT_BY_ADDRESS_FUNCTION_NAME = 'getDepositIdsByAddress'
const GET_DEPOSIT_FUNCTION_NAME = 'getDeposit'
const DEPOSIT_WITH_PERMIT_FUNCTION_NAME = 'depositWithPermit'
const WITHDRAW_FUNCTION_NAME = 'withdraw'

export const useDeposits = () => {
  const { isConnected, address, gasPrice } = useWeb3();
  const [deposits, setDeposits] = useState<DepositWithInterest[]>([]);
  const { interestRate, interestRateLoading } = useInterestRate();
  const { data: depositHash, isPending: depositLoading, writeContract: writeDeposit} = useWriteContract();
  const { isLoading: depositIsConfirming, isSuccess: depositConfirmed } = useWaitForTransactionReceipt({ hash: depositHash });
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
      functionName: GET_DEPOSIT_FUNCTION_NAME,
      args: [depositId],
    }));
  }, [depositIds]);

  const { data: depositsData, isLoading: depositsDataLoading } : UseReadContractsReturnType =  useReadContracts({
    contracts: contractCalls,
  });

  useEffect(() => {
    if (depositsData && depositsData.length > 0) {
      const localDepositsData: LocalDeposit[] | undefined = depositsData?.map(depositData => ({
        deposit: depositData.result[0], interestEarned: depositData.result[1],
      }));
      setDeposits(localDepositsData as DepositWithInterest[]);
    }
  }, [depositsData]);


  const deposit = async (amountToDeposit: bigint) => {
    try {
      const {value, deadline, v,r,s} = await signPermit({spender: lendingContract.testnet, value: amountToDeposit} )
      writeDeposit({
        address: lendingContract.testnet,
        abi: lendingContract.abi,
        functionName: DEPOSIT_WITH_PERMIT_FUNCTION_NAME,
        args: [value, deadline, v, r, s],
        gasPrice,
      });
    } catch (error) {
      console.error('Error during deposit:', error);
    }
  };

  const withdraw = async (depositId: bigint) => {
    try {
      writeDeposit({
        address: lendingContract.testnet,
        abi: lendingContract.abi,
        functionName: WITHDRAW_FUNCTION_NAME,
        args: [depositId],
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
    withdraw,
    depositLoading,
    depositIsConfirming,
    depositConfirmed,
  };
};
