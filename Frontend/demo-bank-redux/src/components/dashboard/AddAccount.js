import React, { useState } from "react";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import alertify from "alertifyjs";
import apiClient, { getStoredAccessToken } from "../../apiClient";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as accountActions from "../../redux/actions/accountActions";

function AccountForm({ onSaveAccount, open = true, onClose, actions}) {
  const [accountInfo, setAccountInfo] = useState({
    accountName: "",
    accountType: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setAccountInfo({
      ...accountInfo,
      [name]: value,
    });
  };

  const handleSaveAccount = async (event) => {
    event.preventDefault();

    const accessToken = getStoredAccessToken();
    if (!accessToken) {
      alertify.error("Your session expired. Please login again.");
      onClose();
      return;
    }

    const jsonData = {};

    jsonData["account_name"] = accountInfo.accountName;
    jsonData["account_type"] = accountInfo.accountType;

    console.log(jsonData);
    console.log(accessToken);

    setIsSaving(true);
    try {
      const response = await apiClient.post("/account/create_account", jsonData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        alertify.success("New account added.");
      }

      await actions.getAccounts();
      await actions.getTotalBalance();
      onSaveAccount(accountInfo);
      onClose();
    } catch (error) {
      const message = error?.response?.data || "Something went wrong";
      alertify.error(typeof message === "string" ? message : "Something went wrong");
    } finally {
      setIsSaving(false);
    }
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
          width: "300px", // Yan menünün genişliğini ayarla
          padding: "16px",
        }}
        role="presentation"
        onClick={onClose}
        onKeyDown={onClose}
      >
        <Typography variant="h6" style={{ marginTop: "60px" }}>Add Account</Typography>
        <TextField
          style={{ marginTop: "60px" }}
          name="accountName"
          label="Account Name"
          value={accountInfo.accountName}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          onClick={(event) => {
            // Tıklama olayını engelleme
            event.stopPropagation();
          }}
          onKeyDown={(event) => {
            // Klavye olaylarını engelleme
            event.stopPropagation();
          }}
        />
        <TextField
          name="accountType"
          label="Account Type"
          value={accountInfo.accountType}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          onClick={(event) => {
            // Tıklama olayını engelleme
            event.stopPropagation();
          }}
          onKeyDown={(event) => {
            // Klavye olaylarını engellemek
            event.stopPropagation();
          }}
        />
        <Box mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveAccount}
            disabled={isSaving}
            sx={{ backgroundColor: "#EB3D13" }}
          >
            {isSaving ? "Creating..." : "Create Account"}
          </Button>
        </Box>
      </div>
    </Drawer>
  );
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      getAccounts: bindActionCreators(accountActions.getAccounts, dispatch),
      getTotalBalance: bindActionCreators(accountActions.getTotalBalance, dispatch),
    },
  };
}

export default connect(null,mapDispatchToProps)(AccountForm);
