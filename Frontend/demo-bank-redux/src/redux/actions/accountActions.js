import * as actionTypes from "./actionTypes";
import apiClient from "../../apiClient";

function getAccessToken() {
  try {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");
    return userInfo?.access_token || null;
  } catch (error) {
    return null;
  }
}

export function changeAccount(account) {
  return { type: actionTypes.CHANGE_ACCOUNT, payload: account };
}

export function getAccountsSuccess(accounts) {
  return { type: actionTypes.GET_ACCOUNTS_SUCCESS, payload: accounts };
}

export function getTotalBalanceSuccess(balance){
  return {type: actionTypes.GET_TOTAL_BALANCE_SUCCESS, payload: balance}
}

export function getTransactionHistorySuccess(history){
  return {type: actionTypes.GET_TRANSACTION_HISTORY_SUCCESS, payload: history}
}

export function getAccounts() {
  const accessToken = getAccessToken();

  return function (dispatch) {
    if (!accessToken) {
      dispatch(getAccountsSuccess([]));
      return;
    }

    apiClient
      .get("/app/dashboard", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer: " + accessToken,
        },
      })
      .then((response) =>
        dispatch(getAccountsSuccess(response.data.userAccounts))
      )
      .catch((error) => {
        console.error(error);
      });
  };

}

export function getTotalBalance(){
  const accessToken = getAccessToken();

  return function (dispatch) {
    if (!accessToken) {
      dispatch(getTotalBalanceSuccess("0"));
      return;
    }

    apiClient
      .get("/app/dashboard", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer: " + accessToken,
        },
      })
      .then((response) =>
        dispatch(getTotalBalanceSuccess(response.data.totalBalance))
      )
      .catch((error) => {
        console.error(error);
      });
  };

}

export function getTransactionHistory() {
  const accessToken = getAccessToken();

  return function (dispatch) {
    if (!accessToken) {
      dispatch(getTransactionHistorySuccess([]));
      return;
    }

    apiClient
      .get("/app/transaction_history", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer: " + accessToken,
        },
      })
      .then((response) =>
        dispatch(getTransactionHistorySuccess(response.data.transaction_history))
      )
      .catch((error) => {
        console.error(error);
      });
  };
}


