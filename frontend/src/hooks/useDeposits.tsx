import { useReadContract, useReadContracts, useWriteContract, UseReadContractsReturnType, useWaitForTransactionReceipt } from 'wagmi';
import { useState, useEffect, useMemo } from 'react';
import { useWeb3 } from './useWeb3';
import { lendingContract } from '../utils/contractAddresses';
import { Deposit, DepositWithInterest, LocalDeposit } from '../types/deposit';
import { useInterestRate } from './useInterestRate';
import useSignPermit from './useSignPermit';
import { formatBigInt } from '../utils/formatter';

const GET_DEPOSIT_BY_ADDRESS_FUNCTION_NAME = 'getDepositIdsByAddress'
const GET_DEPOSIT_FUNCTION_NAME = 'getDeposit'
const DEPOSIT_WITH_PERMIT_FUNCTION_NAME = 'depositWithPermit'
const WITHDRAW_FUNCTION_NAME = 'withdraw'

export const useDeposits = () => {
  const { isConnected, address, gasPrice } = useWeb3();
  const [deposits, setDeposits] = useState<DepositWithInterest[]>([]);
  const { interestRate } = useInterestRate();
  const { data: depositHash, isPending: depositLoading, writeContract: writeDeposit, error: writeError} = useWriteContract();
  const { isLoading: depositIsConfirming, isSuccess: depositConfirmed } = useWaitForTransactionReceipt({ hash: depositHash });
  const signPermit = useSignPermit();

  const [error, setError] = useState<boolean | null>(null);

  const { data: depositIds, isLoading: depositIdsLoading, refetch: refetchDepositIds } = useReadContract({
    address: lendingContract.testnet,
    abi: lendingContract.abi,
    functionName: GET_DEPOSIT_BY_ADDRESS_FUNCTION_NAME,
    args: [address],
  });

  const contractCalls = useMemo(() => {
    const localDepositIds: number[] = depositIds as number[];
    if (!depositIds || localDepositIds.length === 0) return [];
    return localDepositIds.map(depositId => ({
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
      const localDepositsData: LocalDeposit[] | undefined = depositsData?.map(depositData => {
        const deposit: Deposit = depositData.result[0];
        const interestEarned = depositData.result ? (depositData.result[1] as bigint) : 0n;
        const formattedDeposit = formatBigInt(deposit.amount);
        const formattedInterest = formatBigInt(interestEarned);
        const formattedInterestRate = formatBigInt(deposit.interestRate);
        return { deposit: {...deposit, amount: formattedDeposit, interestRate: formattedInterestRate}, interestEarned: formattedInterest };
      });
      setDeposits(localDepositsData as DepositWithInterest[]);
    }
  }, [depositsData]);

  useEffect(()=>{
    if(depositConfirmed){
      console.log({depositConfirmed})
      refetchDepositIds();
    }
  },[depositConfirmed, refetchDepositIds])

  const deposit = async (amountToDeposit: bigint) => {
    setError(null);
    try {
      const {value, deadline, v, r, s} = await signPermit({spender: lendingContract.testnet, value: amountToDeposit});
      await writeDeposit({
        address: lendingContract.testnet,
        abi: lendingContract.abi,
        functionName: DEPOSIT_WITH_PERMIT_FUNCTION_NAME,
        args: [value, deadline, v, r, s],
        gasPrice,
      });
    } catch (error) {
      setError(true);
    }
  };

  const withdraw = async (depositId: bigint) => {
    setError(null);
    try {
      await writeDeposit({
        address: lendingContract.testnet,
        abi: lendingContract.abi,
        functionName: WITHDRAW_FUNCTION_NAME,
        args: [depositId],
        gasPrice,
      });
    } catch (error) {
      setError(true);
    }
  };

  return {
    address,
    isConnected,
    deposits,
    interestRate,
    loading: depositIdsLoading || depositsDataLoading ,
    transactionLoading: depositLoading || depositIsConfirming,
    error: writeError || error,
    success: depositConfirmed,
    deposit,
    withdraw,
    depositLoading,
    depositIsConfirming,
    depositConfirmed,
  };
}