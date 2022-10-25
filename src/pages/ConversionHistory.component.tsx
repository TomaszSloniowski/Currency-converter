interface ConversionHistoryProps {
  data: any[];
}

export const ConversionHistory: React.FC<ConversionHistoryProps> = (props) => {
  return (
    <>
      <table>
        <thead>
          <tr>
            <th style={{width: '680px'}}>Data</th>
            <th style={{width: '200px'}}>Przed konwersją</th>
            <th style={{width: '180px', textAlign: 'end'}}>Po konwersji</th>
          </tr>
        </thead>
        <tbody>
          {props.data.map((row) => (
            <tr>
              <td style={{width: '770px'}}>{row.date}</td>
              <td>
                {`${row.amount} ${row.from}`}
              </td>
              <td style={{textAlign: 'end', fontWeight: 600, marginRight: '10px'}}>
              {`${row.result} ${row.to}`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
