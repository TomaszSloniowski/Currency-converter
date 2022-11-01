const apikey = "f58703413af189399d9c"

export const getAllCurrencies = async () => {
  return await fetch(`https://free.currconv.com/api/v7/currencies?apiKey=${apikey}`, {
    method: "GET",
  })
};

export const convertCurrency = async (fromCurrency: string, toCurrency: string) => {
  return await fetch(`https://free.currconv.com/api/v7/convert?q=${fromCurrency}_${toCurrency}&compact=ultra&apiKey=${apikey}`, {
    method: "GET",
  });
};