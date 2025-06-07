
export const convertUSDToINR = (usdAmount: number, exchangeRate: number = 83): number => {
  return usdAmount * exchangeRate;
};

export const formatINRCurrency = (amount: number): string => {
  return `₹${amount.toLocaleString('en-IN')}`;
};

export const formatUSDAsINR = (usdAmount: number, exchangeRate: number = 83): string => {
  const inrAmount = convertUSDToINR(usdAmount, exchangeRate);
  return formatINRCurrency(inrAmount);
};

export const parseUSDString = (usdString: string): number => {
  // Remove $ symbol and any commas, then parse as float
  return parseFloat(usdString.replace(/[$,]/g, ''));
};

export const convertUSDStringToINR = (usdString: string, exchangeRate: number = 83): string => {
  const usdAmount = parseUSDString(usdString);
  return formatUSDAsINR(usdAmount, exchangeRate);
};
