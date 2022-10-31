import arrowIcon from "../assets/arrow_right.svg";

interface ConversionHistoryProps {
  data: any[];
}

export const ConversionHistory: React.FC<ConversionHistoryProps> = (props) => {
  return (
    <>
      <table>
        <thead>
          <tr>
            <th style={{minWidth: '550px'}}>Data</th>
            <th style={{minWidth: '150px'}}>Przed konwersją</th>
            <th style={{minWidth: '270px', textAlign: 'end'}}>Po konwersji</th>
          </tr>
        </thead>
        <tbody>
          {props.data.map((row) => (
            <tr>
              {/* <td style={{width: '670px'}}>{row.date}</td> */}
              <td style={{width: '750px'}}>23.10.2022</td> {/*mock'*/}

              <td>
                {`${row.amount} ${row.from}`}
              </td>
              <td style={{width: '30px', minWidth: '30px'}}>
                <img src={arrowIcon} alt="arrow" />
              </td>
              <td style={{textAlign: 'end', fontWeight: 600}}>
              {/* {`${row.result} ${row.to}`} */}
              {`${row.result} USD`} {/*mock'*/}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
