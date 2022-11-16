import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { convertCurrency, getAllCurrencies } from "../converter.service";
import "../styles.css";
import { ConversionHistory } from "./ConversionHistory.component";
import coi_logo from "../assets/coi_logo.svg";
import arrows from "../assets/arrows.svg";
import close_icon from "../assets/close_icon.svg";
import { conversionHistoryType } from "../conversionHistory.types";

type FormData = {
  amount: string | null;
  fromCurrency: string;
  toCurrency: string;
  result: string;
};

export default function Converter() {
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [conversionHistory, setConversionHistory] = useState<conversionHistoryType[]>([]);
  const [isConversionHistoryVisible, setIsConversionHistoryVisible] = useState<boolean>(false);
  const [isAlertModal, setIsAlertModal] = useState<boolean>(false);
  const [isResult, setIsResult] = useState<boolean>(false);

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();
  const watchAmount = watch("amount");
  const watchFromCurrency = watch("fromCurrency");
  const watchToCurrency = watch("toCurrency");

  const getConversionHistory = () => {
    let rows: conversionHistoryType[] = [];
    if (localStorage.length > 0) {
      setConversionHistory([]);
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        debugger;
        if (key && key.includes("currency-converter")) {
          const rowItems = localStorage.getItem(key)?.split("_");
          console.log(rowItems);
          if (rowItems) {
            const row: conversionHistoryType = {
              id: rowItems[0],
              date: rowItems[1],
              amount: rowItems[2],
              result: rowItems[3],
              from: rowItems[4],
              to: rowItems[5],
            };
            rows.push(row);
          }
        }
      }
      const sortedRows = rows.sort((a, b) => (a.id > b.id ? 1 : b.id > a.id ? -1 : 0));
      setConversionHistory((state) => [...state, ...sortedRows]);
      setIsConversionHistoryVisible(true);
      setIsResult(true);
    }
  };

  const onSubmit = handleSubmit(({ amount, fromCurrency, toCurrency }) => {
    if (!amount) return;
    convertCurrency(fromCurrency, toCurrency)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        const value = (parseFloat(Object.values(data).toString()) * parseInt(amount)).toFixed(2).toString();
        setValue("result", value);
        const today = new Date();
        const date = `${today.getDate()}.${today.getMonth() + 1}.${today.getFullYear()}`;
        const row: conversionHistoryType = {
          id: today.getTime().toString(),
          date: date,
          amount: amount,
          result: value,
          from: fromCurrency,
          to: toCurrency,
        };
        setConversionHistory((state) => [...state, row]);
        setIsConversionHistoryVisible(true);
        setIsResult(true);

        localStorage.setItem(
          `${today.getTime().toString()}_currency-converter`,
          `${row.id}_${row.date}_${row.amount}_${row.result}_${row.from}_${row.to}`
        );
      })
      .catch((error) => {
        setIsAlertModal(true);
        console.log("error", error);
      });
  });

  useEffect(() => {
    getAllCurrencies()
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        const symbols = Object.keys(data.results);
        setCurrencies(symbols);
        setValue("fromCurrency", "USD");
        setValue("toCurrency", "PLN");
      })
      .catch((error) => {
        setIsAlertModal(true);
        console.log("error", error);
      });
    getConversionHistory();
  }, []);

  const handleRemoveHistory = () => {
    setConversionHistory([]);
    setIsConversionHistoryVisible(false);
    setValue("result", "");
    setValue("amount", null);
    setValue("fromCurrency", "USD");
    setValue("toCurrency", "PLN");
    window.localStorage.clear();
  };

  return (
    <>
      {currencies && (
        <div className="form-tab">
          <h1>Konwerter walut</h1>
          <form onSubmit={onSubmit}>
            <div className="inputs">
              <div className="input-with-label">
                <label>Przelicz z</label>
                <select {...register("fromCurrency")}>
                  {currencies.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <img src={arrows} alt="strzałki" className="arrows" />
              </div>
              <div className="input-with-label" style={{ marginRight: "40px" }}>
                <label>Przelicz na</label>
                <select {...register("toCurrency")}>
                  {currencies.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="input-with-label">
                <label htmlFor="amount">Kwota</label>
                <input
                  type="text"
                  placeholder="Wpisz kwotę"
                  minLength={1}
                  maxLength={5}
                  style={{
                    width: "200px",
                    color: errors.amount ? "#CA163A" : "#335566",
                    borderBottom: !errors.amount ? "solid 2px #335566" : "solid 3px #CA163A",
                    borderRadius: "0px",
                  }}
                  {...register("amount", { pattern: /\d+/, required: true })}
                />
                {errors.amount && <p className="error-message">Nieprawidłowa wartość</p>}
                {isResult && <div className="symbol">{watchFromCurrency}</div>}
              </div>
              <div className="input-with-label">
                <label htmlFor="output">Wynik</label>
                <input
                  type="number"
                  placeholder="Wynik"
                  style={{
                    width: "200px",
                    fontWeight: isResult ? 700 : 500,
                    borderBottom: "solid 2px #335566",
                    borderRadius: "0px",
                  }}
                  {...register("result")}
                />
                {isResult && <div className="symbol">{watchToCurrency}</div>}
              </div>
            </div>
            <div className="buttons">
              <button
                className="button-history"
                type="button"
                disabled={!conversionHistory.length}
                onClick={() => {
                  handleRemoveHistory();
                }}
              >
                Wyczyść historię
              </button>
              <button
                onClick={() => {
                  setIsConversionHistoryVisible(!isConversionHistoryVisible);
                }}
                className="button-history"
                type="button"
              >
                {!isConversionHistoryVisible ? "Historia" : "Ukryj historię"}
              </button>
              <button className="button-convert" type="button" onClick={onSubmit} disabled={!watchAmount}>
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
