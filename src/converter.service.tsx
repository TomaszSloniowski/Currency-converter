const API_KEY = process.env.REACT_APP_API_KEY;

export const getAllCurrencies = async () => {
  return await fetch(`https://free.currconv.com/api/v7/currencies?apiKey=${API_KEY}`, {
    method: "GET",
  })
};

export const convertCurrency = async (fromCurrency: string, toCurrency: string) => {
  return await fetch(`https://free.currconv.com/api/v7/convert?q=${fromCurrency}_${toCurrency}&compact=ultra&apiKey=${API_KEY}`, {
    method: "GET",
  });
};