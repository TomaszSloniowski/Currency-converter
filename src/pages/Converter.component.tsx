import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "react-query";
import { convertCurrency, getAllCurrencies } from "../converter.service";
import "../styles.css";
import { ConversionHistory } from "./ConversionHistory.component";

type FormData = {
  amount: number;
  fromCurrency: string;
  toCurrency: string;
  result: string;
};
export default function Converter() {
  const [currencies, setCurrencies] = useState<any[]>([]);
  const [conversionHistory, setConversionHistory] = useState<any[]>([]);
  const [isConversionHistoryVisible, setIsConversionHistoryVisible] = useState<boolean>(false);
  const [selectedFromCurrency, setSelectedFromCurrency] = useState<string>("USD");
  const [selectedToCurrency, setSelectedToCurrency] = useState<string>("PLN");

  // const conversionHistoryMock = [
  //   {
  //     date: "03.03.2020",
  //     amount: "385",
  //     result: "98,56",
  //     from: "USD",
  //     to: "PLN",
  //   },
  //   {
  //     date: "03.03.2020",
  //     amount: "385",
  //     result: "98,56",
  //     from: "USD",
  //     to: "PLN",
  //   },
  //   {
  //     date: "03.03.2020",
  //     amount: "385",
  //     result: "98,56",
  //     from: "USD",
  //     to: "PLN",
  //   },
  //   {
  //     date: "03.03.2020",
  //     amount: "385",
  //     result: "98,56",
  //     from: "USD",
  //     to: "PLN",
  //   },
  //   {
  //     date: "03.03.2020",
  //     amount: "385",
  //     result: "98,56",
  //     from: "USD",
  //     to: "PLN",
  //   },
  //   {
  //     date: "03.03.2020",
  //     amount: "385",
  //     result: "98,56",
  //     from: "USD",
  //     to: "PLN",
  //   },
  //   {
  //     date: "03.03.2020",
  //     amount: "385",
  //     result: "98,56",
  //     from: "USD",
  //     to: "PLN",
  //   },
  // ];

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = handleSubmit(({ amount, fromCurrency, toCurrency }) => {
    console.log(amount, fromCurrency, toCurrency);
    convertCurrency(amount, fromCurrency, toCurrency)
      .then((response) => response.text())
      .then((result) => {
        const res = JSON.parse(result);
        console.log(res);
        setValue("result", res.result);
        const row = { date: res.date, amount: amount, result: res.result, from: fromCurrency, to: toCurrency };
        setConversionHistory((state) => [...state, row]);
        setIsConversionHistoryVisible(true);
        setSelectedFromCurrency(fromCurrency);
        setSelectedToCurrency(toCurrency);
      })
      .catch((error) => console.log("error", error));
  });

  useEffect(() => {
    getAllCurrencies()
      .then((response) => response.text())
      .then((result) => {
        const res = JSON.parse(result);
        setCurrencies(res);
        console.log(res);
      })
      .catch((error) => console.log("error", error));
  }, []);

  return (
    <div className="container">
      {currencies && (
        <div className="form-tab">
          <h1>Konwerter walut</h1>
          <form onSubmit={onSubmit}>
            <div className="inputs">
              <div className="input-with-label">
                <label>Przelicz z</label>
                <select {...register("fromCurrency")}>
                  {currencies.map((option) => (
                    <option value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="input-with-label">
                <label>Przelicz na</label>
                <select {...register("toCurrency")}>
                  {currencies.map((option) => (
                    <option value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="input-with-label">
                <label htmlFor="amount">Kwota</label>
                <input
                  placeholder="Wpisz kwotę"
                  style={{ width: "250px", borderBottom: "solid 2px #335566", borderRadius: "0px" }}
                  {...register("amount", { required: true })}
                />
                <div className="symbol">{selectedFromCurrency}</div>
              </div>
              <div className="input-with-label">
                <label htmlFor="output">Wynik</label>
                <input
                  placeholder="Wynik"
                  style={{ width: "250px", borderBottom: "solid 2px #335566", borderRadius: "0px" }}
                  {...register("result")}
                />
                <div className="symbol">{selectedToCurrency}</div>
              </div>
            </div>
            <div className="buttons">
              <button
                onClick={() => {
                  setIsConversionHistoryVisible(!isConversionHistoryVisible);
                }}
                className="button-history"
                type="button"
              >
                {!isConversionHistoryVisible ? "Historia" : "Ukryj historię"}
              </button>
              <button className="button-convert" type="button" onClick={onSubmit}>
                Konwertuj
              </button>
            </div>
          </form>
          {isConversionHistoryVisible && <ConversionHistory data={conversionHistory} />}
        </div>
      )}
    </div>
  );
}
