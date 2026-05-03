import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Title from "./Title";
import axios from "axios";

function getAccessToken() {
  try {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");
    return userInfo?.access_token || null;
  } catch (error) {
    return null;
  }
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
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    const accessToken = getAccessToken();
    if (!accessToken) {
      return;
    }

    axios
      .get("http://127.0.0.1:8070/app/payment_history", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer: " + accessToken,
        },
      })
      .then((response) => setPayments(response.data?.payment_history || []))
      .catch(() => setError("Payment history is unavailable right now."));
  }, []);

  return (
    <React.Fragment>
      <Title>Payment History</Title>
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
          {!payments.length && !error ? (
            <TableRow>
              <TableCell colSpan={8}>No payment history yet.</TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}
