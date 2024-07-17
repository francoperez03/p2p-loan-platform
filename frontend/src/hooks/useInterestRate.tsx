import { useReadContract } from 'wagmi';
import { lendingContract } from '../utils/contractAddresses';

export const useInterestRate = () => {
  const { data: interestRateData, isLoading: interestRateLoading, error: interestRateError } = useReadContract({
    address: lendingContract.testnet,
    abi: lendingContract.abi,
    functionName: 'depositInterestRate',
  });

  const interestRate = interestRateData ? (interestRateData as bigint / BigInt(1e16)).toString() : '0';
  return { interestRate, interestRateLoading, interestRateError };
};
