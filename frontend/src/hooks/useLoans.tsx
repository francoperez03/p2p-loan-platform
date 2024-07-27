import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useState, useEffect } from 'react';
import { useWeb3 } from './useWeb3';
import { lendingContract } from '../utils/contractAddresses';
import { Loan } from '../types/loan';
import useSignPermit from './useSignPermit';

const REQUEST_LOAN_FUNCTION_NAME = 'requestLoan';
const APPROVE_LOAN_FUNCTION_NAME = 'approveLoan';
const REPAY_LOAN_WITH_PERMIT_FUNCTION_NAME = 'repayLoanWithPermit';
const GET_LOAN_EMMITED_BY_ADDRESS_FUNCTION_NAME = 'getLoansEmittedByAddress';
const GET_LOAN_REQUESTED_BY_ADDRESS_FUNCTION_NAME = 'getLoansRequestedByAddress';

export const useLoans = () => {
  const { isConnected, address, gasPrice } = useWeb3();
  const { data: loanHash, isPending: loanLoading, writeContract: writeLoan, error: writeError} = useWriteContract();
  const { isLoading: loanIsConfirming, isSuccess: loanConfirmed } = useWaitForTransactionReceipt({ hash: loanHash });
  
  const [error, setError] = useState<boolean | null>(null);

  const { data: loansIssued, isLoading: loansIssuedLoading, refetch: refetchLoanIssued } = useReadContract({
    address: lendingContract.testnet,
    abi: lendingContract.abi,
    functionName: GET_LOAN_EMMITED_BY_ADDRESS_FUNCTION_NAME,
    args: [address],
  }) as { data: Loan[], isLoading: boolean, refetch: () => void } ;

  const { data: loansRequested, isLoading: loansRequestedLoading, refetch: refetchLoanRequestd } = useReadContract({
    address: lendingContract.testnet,
    abi: lendingContract.abi,
    functionName: GET_LOAN_REQUESTED_BY_ADDRESS_FUNCTION_NAME,
    args: [address],
  }) as { data: Loan[], isLoading: boolean, refetch: () => void } ;
  const signPermit = useSignPermit();

  useEffect(()=>{
    if(loanConfirmed){
      refetchLoanIssued();
      refetchLoanRequestd();
    }
  },[loanConfirmed, refetchLoanRequestd, refetchLoanIssued])

  const requestLoan = async (lender: string, amount: string) => {
    setError(null);
    try {
      await writeLoan({
        address: lendingContract.testnet,
        abi: lendingContract.abi,
        functionName: REQUEST_LOAN_FUNCTION_NAME,
        args: [lender, BigInt(amount), 100000000],
        gasPrice,
      });
    } catch (error) {
      setError(true);
    }
  };

  const approveLoan = async (loanId: bigint) => {
    setError(null);
    try {
      await writeLoan({
        address: lendingContract.testnet,
        abi: lendingContract.abi,
        functionName: APPROVE_LOAN_FUNCTION_NAME,
        args: [loanId],
        gasPrice,
      });
    } catch (error) {
      setError(true);
    }
  };

  const repayLoan = async (loanId: bigint, amount: string) => {
    setError(null);
    try {
      const {value, deadline, v, r, s} = await signPermit({spender: lendingContract.testnet, value: BigInt(amount)});
      await writeLoan({
        address: lendingContract.testnet,
        abi: lendingContract.abi,
        functionName: REPAY_LOAN_WITH_PERMIT_FUNCTION_NAME,
        args: [loanId, value, deadline, v, r, s],
        gasPrice,
      });
    } catch (error) {
      setError(true);
    }
  };
  if(writeError){
    console.log({writeError})
  }

  return {
    address,
    isConnected,
    loansIssued,
    loansRequested,
    loading: loansIssuedLoading || loansRequestedLoading,
    transactionLoading: loanLoading || loanIsConfirming,
    error: writeError || error,
    success: loanConfirmed,
    requestLoan,
    approveLoan,
    repayLoan,
    loanLoading,
    loanIsConfirming,
    loanConfirmed,
  };
}


