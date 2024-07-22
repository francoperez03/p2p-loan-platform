const formatBigInt = (value: bigint): string => {
  const strValue = value.toString().padStart(19, '0');
  let integerPart = strValue.slice(0, -18);
  let decimalPart = strValue.slice(-18).replace(/0+$/, '');

  if (integerPart === '') integerPart = '0';
  if (decimalPart === '') decimalPart = '0';

  return `${integerPart}.${decimalPart}`;
}

export { formatBigInt }