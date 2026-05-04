import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Title from "./Title";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import Button from "@mui/material/Button";
import { bindActionCreators } from "redux";
import * as accountActions from "../../redux/actions/accountActions";

function TransactionHistory(props) {
  const { getTransactionHistory, transactHistory } = props;
  const [showAllAccounts, setShowAllAccounts] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadHistory() {
      setIsLoading(true);
      setError("");
      try {
        await getTransactionHistory();
      } catch (error) {
        if (mounted) {
          setError("Transaction history is unavailable right now.");
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadHistory();
    return () => {
      mounted = false;
    };
  }, [getTransactionHistory]);

  function dateFormatter(dateArray) {
    if (!Array.isArray(dateArray)) {
      return "";
    }
    const year = dateArray[0];
    const month = dateArray[1];
    const day = dateArray[2];
    const hour = dateArray[3];
    const minute = dateArray[4];
    const second = dateArray[5];

    return (
      year +
      " : " +
      month +
      " : " +
      day +
      " " +
      hour +
      ":" +
      minute +
      ":" +
      second
    );
  }

  return (
    <React.Fragment>
      <Title>Accounts History</Title>
      {isLoading ? <Typography>Loading transaction history...</Typography> : null}
      {error ? <Typography color="error">{error}</Typography> : null}
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Transaction Id</TableCell>
            <TableCell>Account Id</TableCell>
            <TableCell>Transaction Type</TableCell>
            <TableCell>Amoun</TableCell>
            <TableCell>Source</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Reason Code</TableCell>
            <TableCell>Created At</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactHistory
            .slice()
            .sort((a, b) => b.transaction_id - a.transaction_id)
            .map((history) => (
              <TableRow key={history.transaction_id}>
                <TableCell>{history.transaction_id}</TableCell>
                <TableCell>{history.account_id}</TableCell>
                <TableCell>{history.transaction_type}</TableCell>
                <TableCell>{history.amount}</TableCell>
                <TableCell>{history.source}</TableCell>
                <TableCell>{`$${history.status}`}</TableCell>
                <TableCell>{history.reason_code}</TableCell>
                <TableCell>{dateFormatter(history.created_at)}</TableCell>
              </TableRow>
            ))}
          {!isLoading && !transactHistory.length && !error ? (
            <TableRow>
              <TableCell colSpan={8}>No transaction history yet.</TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
      <Button onClick={() => setShowAllAccounts(!showAllAccounts)}>
        {showAllAccounts ? "Show Less Accounts" : "Show All Accounts"}
      </Button>
    </React.Fragment>
  );
}

function mapDispatchToProps(dispatch) {
  return {
    getTransactionHistory: bindActionCreators(
      accountActions.getTransactionHistory,
      dispatch
    ),
  };
}

function mapStateToProps(state) {
  return {
    transactHistory: state.transactionHistoryReducer,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TransactionHistory);
