import { FC, useState } from "react";
import "../../transactions.scss";
import "./dataTable.scss";
import { ArrowRightOS } from "assets/icons";

interface TransactionTableProps {
  data?: any[];
  column: string[];
  isTrade?: boolean;
}
const rowsPerPage = 10;
const TransactionTable: FC<TransactionTableProps> = ({ data, column, isTrade }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const handleClick = (pageNumber: number) => {
    setCurrentPage(currentPage + pageNumber);
  };
  const renderTableData = () => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return data?.slice(startIndex, endIndex).map((item, index) => (
      <tr className='transactionTableRows' key={index}>
        <td>{item.tradeID}</td>
        <td>{item.user}</td>
        <td>{item.amount}</td>
        {<td>{item.asset}</td>}
        {!isTrade && <td>{item.price}</td>}
        <td>{item.tradeType}</td>
        <td>{item.date}</td>
        {item.fee && <td>{item.fee}</td>}
        {item.tranasactionID && <td>{item.tranasactionID}</td>}
        <td style={{
          color: item.status === 'Completed' ? '#1FBF75' : item.status === 'In progress' ? '#ffe100' : '#F15131'
        }}>{item.status}</td>
      </tr>
    ));
  };

  const getCurrentPageRange = () => {
    return `${(rowsPerPage * (currentPage - 1)) + 1}-${rowsPerPage * currentPage}`
  }

  return (
    <div className="mainTableContainer">
      <table className="transactionTableRowsContainer">
        <thead className="transactionTableHeaderContainer">
          <tr className="transactionTableHeader">
            {column.map((item) => {
              return (
                <th key={Math.random().toString()}>{item}</th>)
            })}
          </tr>
        </thead>
        <tbody className="transactionTableRowsContainer">{renderTableData()}</tbody>
      </table>
      <div className="transactionTablePaginatore">
        {`${getCurrentPageRange()} of ${data?.length}`}
        <ArrowRightOS width="24" height="24" onClick={() => currentPage > 1 && handleClick(-1)} />
        <ArrowRightOS width="25" height="25" onClick={() => handleClick(+1)} />
      </div>
      <div className="exportButton">Export</div>
    </div>
  );
};

export default TransactionTable;
