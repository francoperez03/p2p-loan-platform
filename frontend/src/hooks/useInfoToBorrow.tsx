import { useEffect, useState } from "react";
import { useReadContract } from "wagmi";
import { lendingContract } from "../utils/contractAddresses";

const GET_ALL_DEPOSITORS_FUNCTION_NAME = 'getAllDepositors'

export const useAllDepositors = () => {

  const [allDepositors, setAllDepositors] = useState<{address: string, amount: bigint}[]>([]);

  const { data: depositorsData, isLoading: depositorsLoading } = useReadContract({
    address: lendingContract.testnet,
    abi: lendingContract.abi,
    functionName: GET_ALL_DEPOSITORS_FUNCTION_NAME,
  });

  useEffect(() => {
    if (depositorsData) {
      const [addresses, amounts] = depositorsData;
      setAllDepositors(
        addresses.map((address: string, index: number) => ({
          address,
          amount: amounts[index]
        }))
      );
    }
  }, [depositorsData]);

  return {
    allDepositors,
    depositorsLoading,
  };
};