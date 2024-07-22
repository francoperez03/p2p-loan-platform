const formatBigInt = (value: bigint) : string => {
  const strValue = value.toString();
  const integerPart = strValue.slice(0, -18) || '0';
  const decimalPart = strValue.slice(-18, -13) || '00000';
  return `${integerPart}.${decimalPart}`;
}

export { formatBigInt }