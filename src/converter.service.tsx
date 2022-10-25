const myHeaders = new Headers();
myHeaders.append("apikey", "iOmGfHRGiHSlE4hoSUF9Z9HZ9VcdBpzH");

export const getAllCurrencies = async () => {
  return await fetch(`https://api.apilayer.com/exchangerates_data/symbols`, {
    method: "GET",
    redirect: "follow",
    headers: myHeaders,
  })

};

export const convertCurrency = async (amount: number, fromCurrency: string, toCurrency: string) => {
  return await fetch(`https://api.apilayer.com/exchangerates_data/convert?to=${toCurrency}&from=${fromCurrency}&amount=${amount}`, {
    method: "GET",
    redirect: "follow",
    headers: myHeaders,
  });
};
