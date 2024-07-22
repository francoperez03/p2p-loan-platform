import { useEffect, useState } from "react";
import { useReadContract } from "wagmi";
import { lendingContract } from "../utils/contractAddresses";
import { formatBigInt } from "../utils/formatter";

const GET_ALL_DEPOSITORS_FUNCTION_NAME = 'getAllDepositors'
const GET_AVAILABLE_AMOUNT_AND_RATE_FUNCTION_NAME = 'getAvailableAmountAndRate'

export const useAllDepositors = () => {

  const [allDepositors, setAllDepositors] = useState<{address: string, amount: string}[]>([]);
  const [availableAmount, setAvailableAmount] = useState<string>();
  const [interesRateProposed, setInteresRateProposed] = useState<string>();

  const { data: depositorsData, isLoading: depositorsLoading } = useReadContract({
    address: lendingContract.testnet,
    abi: lendingContract.abi,
    functionName: GET_ALL_DEPOSITORS_FUNCTION_NAME,
  }) as { data: [string[], bigint[]], isLoading: boolean};

  const { data: availableAmountAndRate, isLoading: availabeDataLoading } = useReadContract({
    address: lendingContract.testnet,
    abi: lendingContract.abi,
    functionName: GET_AVAILABLE_AMOUNT_AND_RATE_FUNCTION_NAME,
  }) as { data: [bigint, bigint], isLoading: boolean};

  useEffect(() => {
    if (depositorsData) {
      const [addresses, amounts] = depositorsData;
      setAllDepositors(
        addresses.map((address: string, index: number) => ({
          address,
          amount: formatBigInt(amounts[index])
        }))
      );
    }
  }, [depositorsData]);

  useEffect(() => {
    if (availableAmountAndRate) {
      const [availableAmount, interesRateProposed] = availableAmountAndRate;
      setAvailableAmount(formatBigInt(availableAmount));
      setInteresRateProposed(formatBigInt(interesRateProposed));
    }
  }, [availableAmountAndRate, setAvailableAmount, setInteresRateProposed]);

  return {
    allDepositors,
    availableAmount,
    interesRateProposed,
    loading: depositorsLoading || availabeDataLoading,
  };
};