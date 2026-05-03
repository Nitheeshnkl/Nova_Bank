import React, { useState } from "react";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import alertify from "alertifyjs";
import apiClient from "../../apiClient";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as accountActions from "../../redux/actions/accountActions";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

function AccountForm({
  onSaveAccount,
  open = true,
  onClose,
  actions,
  currentAccount,
}) {
  const [amount, setAmount] = useState("");
  const [targetAccount, setTargetAccount] = useState("");
  const [accountInfo, setAccountInfo] = useState({
    transactionType: "",
    
  });
  const [paymentInfo, setPaymentInfo] = useState({
    beneficiary: "",
    account_number: "",
    reference: "",
    payment_amount: "",
    
  })

  const postRequestToApi = async (apiUrl, jsonData) => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");
    const accessToken = userInfo?.access_token;
    if (!accessToken) {
      alertify.error("Your session expired. Please login again.");
      onClose();
      return;
    }

    try {
      const response = await apiClient.post(apiUrl, jsonData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer: " + accessToken, // JSON verisi göndermek için content type ayarı
        },
      });

      if (response.status === 200) {
        alertify.success(response.data?.message || "Transaction successful.");
      }
      actions.getAccounts();
      actions.getTotalBalance();
      actions.getTransactionHistory()
      onSaveAccount(accountInfo);
      onClose();
      return true;
    } catch (error) {
      const message = error?.response?.data || "Something went wrong";
      alertify.error(typeof message === "string" ? message : "Something went wrong");
      return false;
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setPaymentInfo({
      ...paymentInfo,
      [name]: value,
    });

  };

  const handleTransactionTypeChange = (event) => {
    const { value } = event.target;
    setAccountInfo({
      ...accountInfo,
      transactionType: value,
    });
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const handleTargetAccountChange = (event) => {
    setTargetAccount(event.target.value);
  };

  const handleDepositMoney = async (event) => {
    event.preventDefault();
    if (!currentAccount?.account_id) {
      alertify.error("Please select an account first.");
      return;
    }

    const jsonData = {};

    jsonData["account_id"] = currentAccount.account_id;
    jsonData["deposit_amount"] = amount;

    const apiUrl = "/transact/deposit";

    postRequestToApi(apiUrl, jsonData);
  };

  const handleWithdrawMoney = (event) => {
    event.preventDefault();
    if (!currentAccount?.account_id) {
      alertify.error("Please select an account first.");
      return;
    }

    const jsonData = {};

    jsonData["account_id"] = currentAccount.account_id;
    jsonData["withdrawal_amount"] = amount;

    const apiUrl = "/transact/withdraw";

    postRequestToApi(apiUrl, jsonData);
  };

  const handleTransferMoney = (event) => {
    event.preventDefault();
    if (!currentAccount?.account_id) {
      alertify.error("Please select an account first.");
      return;
    }

    const jsonData = {};

    jsonData["sourceAccount"] = currentAccount.account_id;
    jsonData["targetAccount"] = targetAccount.trim();
    jsonData["amount"] = amount;

    const apiUrl = "/transact/transfer";

    postRequestToApi(apiUrl, jsonData);
  };

  const handlePaymentTransaction = (event) => {
    event.preventDefault();
    if (!currentAccount?.account_id) {
      alertify.error("Please select an account first.");
      return;
    }

    const jsonData = {
      ...paymentInfo,
      beneficiary: paymentInfo.beneficiary.trim(),
      account_number: paymentInfo.account_number.trim(),
      reference: paymentInfo.reference.trim(),
      account_id: String(currentAccount.account_id),
    };

    const apiUrl = "/transact/payment";

    postRequestToApi(apiUrl, jsonData);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      ModalProps={{
        disableScrollLock: true,
      }}
    >
      <div
        style={{
          width: "600px",
          padding: "16px",
        }}
        role="presentation"
        onClick={onClose}
        onKeyDown={onClose}
      >
        <Typography variant="h6" style={{ marginTop: "60px" }}>
          Transaction
        </Typography>
        <Select
          name="transactionType"
          label="Transaction Type"
          value={accountInfo.transactionType}
          onChange={handleTransactionTypeChange}
          fullWidth
          margin="normal"
          onClick={(event) => {
            event.stopPropagation();
          }}
          onKeyDown={(event) => {
            event.stopPropagation();
          }}
        >
          <MenuItem value="Deposit Transaction">Deposit Transaction</MenuItem>
          <MenuItem value="Transfer Transaction">Transfer Transaction</MenuItem>
          <MenuItem value="Withdraw Transaction">Withdraw Transaction</MenuItem>
          <MenuItem value="Payment Transaction">Payment Transaction</MenuItem>
        </Select>

        {accountInfo.transactionType === "Deposit Transaction" ? (
          // Eğer "Deposit Transaction" seçildi ise bu TextField görüntülenir
          <>
            <TextField
              readonly
              disabled
              name="depositId"
              label="Account Id   "
              value={currentAccount.account_id}
              fullWidth
              margin="normal"
              onClick={(event) => {
                event.stopPropagation();
              }}
              onKeyDown={(event) => {
                event.stopPropagation();
              }}
            />{" "}
            <TextField
              name="deposit_amount"
              label="Amount"
              value={amount}
              onChange={handleAmountChange}
              fullWidth
              margin="normal"
              onClick={(event) => {
                event.stopPropagation();
              }}
              onKeyDown={(event) => {
                event.stopPropagation();
              }}
            />
            
            <Button
              variant="contained"
              color="primary"
              sx={{ backgroundColor: "#F5BD52" }}
              onClick={handleDepositMoney}
            >
              Transact
            </Button>

            <img src="card.jpg" alt="Deposit" style={{ marginTop: '100px', maxWidth: '100%', height: 'auto' }} />
          </>

          
        ) : null}

        {accountInfo.transactionType === "Transfer Transaction" ? (
          <>
            <TextField
              readonly
              disabled
              name="sourceAccountId"
              label="Source Account Number"
              value={currentAccount.account_number || currentAccount.account_id || ""}
              fullWidth
              margin="normal"
              onClick={(event) => {
                event.stopPropagation();
              }}
              onKeyDown={(event) => {
                event.stopPropagation();
              }}
            />
            <TextField
              name="targetAccountId"
              label="Target Account Number"
              value={targetAccount}
              onChange={handleTargetAccountChange}
              fullWidth
              margin="normal"
              onClick={(event) => {
                event.stopPropagation();
              }}
              onKeyDown={(event) => {
                event.stopPropagation();
              }}
            />{" "}
            <TextField
              name="transferAmount"
              label="Amount"
              value={amount}
              onChange={handleAmountChange}
              fullWidth
              margin="normal"
              onClick={(event) => {
                event.stopPropagation();
              }}
              onKeyDown={(event) => {
                event.stopPropagation();
              }}
            />{" "}
            <Button
              variant="contained"
              color="primary"
              sx={{ backgroundColor: "#F5BD52" }}
              onClick={handleTransferMoney}
            >
              Transact
            </Button>
            <img src="transact.jpg" alt="Deposit" style={{ marginTop: '100px', maxWidth: '100%', height: 'auto' }} />
          </>
          
        ) : null}

        {accountInfo.transactionType === "Withdraw Transaction" ? (
          <>
            {" "}
            <TextField
              readonly
              disabled
              name="withdrawId"
              label="Account Id"
              value={currentAccount.account_id}
              fullWidth
              margin="normal"
              onClick={(event) => {
                event.stopPropagation();
              }}
              onKeyDown={(event) => {
                event.stopPropagation();
              }}
            />
            <TextField
              name="withdraw_amount"
              label="Amount"
              value={amount}
              onChange={handleAmountChange}
              fullWidth
              margin="normal"
              onClick={(event) => {
                event.stopPropagation();
              }}
              onKeyDown={(event) => {
                event.stopPropagation();
              }}
            />
            <Button
              variant="contained"
              color="primary"
              sx={{ backgroundColor: "#F5BD52" }}
              onClick={handleWithdrawMoney}
            >
              Transact
            </Button>

            <img src="transact.jpg" alt="Deposit" style={{ marginTop: '100px', maxWidth: '100%', height: 'auto' }} />
            
          </>
        ) : null}

        {accountInfo.transactionType === "Payment Transaction" ? (
          <>
            <TextField
              readonly
              disabled
              name="account_id"
              label="Paying From Account Number"
              value={currentAccount.account_number || currentAccount.account_id || ""}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              onClick={(event) => {
                event.stopPropagation();
              }}
              onKeyDown={(event) => {
                event.stopPropagation();
              }}
            />
            <TextField
              name="beneficiary"
              label="Beneficiary"
              value={paymentInfo.beneficiary}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              onClick={(event) => {
                event.stopPropagation();
              }}
              onKeyDown={(event) => {
                event.stopPropagation();
              }}
            />
                        <TextField
              name="account_number"
              label="Beneficiary Account Number"
              value={paymentInfo.account_number}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              onClick={(event) => {
                event.stopPropagation();
              }}
              onKeyDown={(event) => {
                event.stopPropagation();
              }}
            />
                        <TextField
              name="reference"
              label="Reference"
              value={paymentInfo.reference}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              onClick={(event) => {
                event.stopPropagation();
              }}
              onKeyDown={(event) => {
                event.stopPropagation();
              }}
            />
                        <TextField
              name="payment_amount"
              label="Payment Amount"
              value={paymentInfo.payment_amount}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              onClick={(event) => {
                event.stopPropagation();
              }}
              onKeyDown={(event) => {
                event.stopPropagation();
              }}
            />            <Button
            variant="contained"
            color="primary"
            sx={{ backgroundColor: "#F5BD52" }}
            onClick={handlePaymentTransaction}
          >
            Transact
          </Button>
            <img src="payment.jpg" alt="Deposit" style={{ marginTop: '100px', maxWidth: '100%', height: 'auto' }} />
          </>
        ) : null}

        <Box mt={2}></Box>
      </div>
    </Drawer>
  );
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      getAccounts: bindActionCreators(accountActions.getAccounts, dispatch),
      getTotalBalance: bindActionCreators(accountActions.getTotalBalance,dispatch),
      getTransactionHistory: bindActionCreators(accountActions.getTransactionHistory,dispatch)
    },
  };
}

function mapStateToProps(state) {
  return {
    currentAccount: state.changeAccountReducer,
    
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountForm);
