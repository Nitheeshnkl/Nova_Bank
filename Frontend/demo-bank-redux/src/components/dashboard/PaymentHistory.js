import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Title from "./Title";
import apiClient, { getStoredAccessToken } from "../../apiClient";

function getAccessToken() {
  return getStoredAccessToken();
}

function dateFormatter(dateArray) {
  if (!Array.isArray(dateArray)) {
    return "";
  }
  const [year, month, day, hour = "00", minute = "00", second = "00"] = dateArray;
  return `${year} : ${month} : ${day} ${hour}:${minute}:${second}`;
}

export default function PaymentHistory() {
  const [payments, setPayments] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    let mounted = true;

    async function loadPayments() {
      const accessToken = getAccessToken();
      if (!accessToken) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await apiClient.get("/app/payment_history");
        if (mounted) {
          setPayments(response.data?.payment_history || []);
        }
      } catch (error) {
        if (mounted) {
          setError("Payment history is unavailable right now.");
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadPayments();
    return () => {
      mounted = false;
    };
  }, []);
  return (
    <React.Fragment>
      <Title>Payment History</Title>
      {isLoading ? <Typography>Loading payment history...</Typography> : null}
      {error ? <Typography color="error">{error}</Typography> : null}
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Payment Id</TableCell>
            <TableCell>Account Id</TableCell>
            <TableCell>Beneficiary</TableCell>
            <TableCell>Beneficiary Account</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Reference</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Created At</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.payment_id}>
              <TableCell>{payment.payment_id}</TableCell>
              <TableCell>{payment.account_id}</TableCell>
              <TableCell>{payment.beneficiary}</TableCell>
              <TableCell>{payment.beneficiary_acc_no}</TableCell>
              <TableCell>{payment.amount}</TableCell>
              <TableCell>{payment.reference_no}</TableCell>
              <TableCell>{payment.status}</TableCell>
              <TableCell>{dateFormatter(payment.created_at)}</TableCell>
            </TableRow>
          ))}
          {!isLoading && !payments.length && !error ? (
            <TableRow>
              <TableCell colSpan={8}>No payment history yet.</TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}
