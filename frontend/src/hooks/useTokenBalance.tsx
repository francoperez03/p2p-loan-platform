import { useReadContract} from 'wagmi';
import { useWeb3 } from './useWeb3';
import { tokenContract } from '../utils/contractAddresses';

const BALANCE_OF_FUNCTION_NAME = 'balanceOf';

export const useTokenBalance = () => {
  const { address } = useWeb3();

  const { data: myBalance, isLoading: myBalanceLoading } = useReadContract({
    address: tokenContract.testnet,
    abi: tokenContract.abi,
    functionName: BALANCE_OF_FUNCTION_NAME,
    args: [address],
  }) as { data: bigint, isLoading: boolean};

  return {
    loading: myBalanceLoading,
    myBalance
  };
}


