import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { convertCurrency, getAllCurrencies } from "../converter.service";
import "../styles.css";
import { ConversionHistory } from "./ConversionHistory.component";
import { currency_list } from "../CurrenciesMock";
import coi_logo from "../assets/coi_logo.svg";
import arrows from "../assets/arrows.svg";
import close_icon from "../assets/close_icon.svg";

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
  const [selectedFromCurrency, setSelectedFromCurrency] = useState<string>("");
  const [selectedToCurrency, setSelectedToCurrency] = useState<string>("");
  const [isAlertModal, setIsAlertModal] = useState<boolean>(true);

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();
  const watchShowAge = watch("amount");

  const onSubmit = handleSubmit(({ amount, fromCurrency, toCurrency }) => {
    convertCurrency(amount, fromCurrency, toCurrency)
      .then((response) => response.text())
      .then((result) => {
        const res = JSON.parse(result);
        setValue("result", res.result);
        const row = { date: res.date, amount: amount, res, from: fromCurrency, to: toCurrency };
        setConversionHistory((state) => [...state, row]);
        setIsConversionHistoryVisible(true);
        setSelectedFromCurrency(fromCurrency);
        setSelectedToCurrency(toCurrency);
      })
      .catch((error) => {
        setIsAlertModal(true);
        console.log("error", error);
      });
  });

  const symbols = currency_list.map((s) => s.code);

  // useEffect(() => {
  //   getAllCurrencies()
  //     .then((response) => response.text())
  //     .then((result) => {
  //       const res = JSON.parse(result);
  //       setCurrencies(res);
  //     })
  //     .catch((error) => console.log("error", error));
  // }, []);

  useEffect(() => {
    setValue("fromCurrency", "PLN");
    setValue("toCurrency", "USD");
  }, []);

  return (
    <>
      {symbols && (
        <div className="form-tab">
          <h1>Konwerter walut</h1>
          <form onSubmit={onSubmit}>
            <div className="inputs">
              <div className="input-with-label">
                <label>Przelicz z</label>
                <select {...register("fromCurrency")}>
                  {symbols.map((option) => (
                    <option value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div>
                <img src={arrows} alt="strzałki" className="arrows" />
              </div>
              <div className="input-with-label" style={{ marginRight: "40px" }}>
                <label>Przelicz na</label>
                <select {...register("toCurrency")}>
                  {symbols.map((option) => (
                    <option value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="input-with-label">
                <label htmlFor="amount">Kwota</label>
                <input
                  type="text"
                  placeholder="Wpisz kwotę"
                  style={{
                    width: "200px",
                    color: errors.amount ? "#CA163A" : "#335566",
                    borderBottom: !errors.amount ? "solid 2px #335566" : "solid 3px #CA163A",
                    borderRadius: "0px",
                  }}
                  {...register("amount", { pattern: /\d+/ })}
                />
                {errors.amount && <p className="error-message">Nieprawidłowa wartość</p>}
                <div className="symbol">{selectedFromCurrency}</div>
              </div>
              <div className="input-with-label">
                <label htmlFor="output">Wynik</label>
                <input
                  type="number"
                  placeholder="Wynik"
                  style={{ width: "200px", borderBottom: "solid 2px #335566", borderRadius: "0px" }}
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
              <button className="button-convert" type="button" onClick={onSubmit} disabled={!watchShowAge}>
                Konwertuj
              </button>
            </div>
          </form>
          {isConversionHistoryVisible && <ConversionHistory data={conversionHistory} />}
        </div>
      )}
      <div className="logo">
        <img src={coi_logo} alt="logo" />
      </div>
      {isAlertModal && (
        <>
          <div className="alert-modal-backdrop"></div>
          <div className="alert-modal">
            <div className="alert-bar"></div>
            <h1>Komunikat błędu</h1>
            <img src={close_icon} className="close-icon" alt="zamknij" onClick={() => setIsAlertModal(false)} />
            <p>Nie udało się wykonać żądanej operacji, ponieważ nie znaleziono zasobu powiązanego z żądaniem.</p>
          </div>
        </>
      )}
    </>
  );
}
