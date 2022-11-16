import arrowIcon from "../assets/arrow_right.svg";
import { conversionHistoryType } from "../conversionHistory.types";

interface ConversionHistoryProps {
  data: conversionHistoryType[];
}

export const ConversionHistory: React.FC<ConversionHistoryProps> = (props) => {
  return (
    <>
      <table>
        <thead>
          <tr>
            <th style={{minWidth: '450px'}}>Data</th>
            <th style={{minWidth: '150px'}}>Przed konwersją</th>
            <th style={{minWidth: '285px', textAlign: 'end'}}>Po konwersji</th>
          </tr>
        </thead>
        <tbody>
          {props.data.map((row) => (
            <tr key={row.id}>
              <td style={{width: '670px', textAlign: 'start'}}>{row.date}</td>
              <td>
                {`${row.amount} ${row.from}`}
              </td>
              <td>
                <img src={arrowIcon} alt="arrow" />
              </td>
              <td style={{textAlign: 'end', fontWeight: 600}}>
              {`${row.result} ${row.to}`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
