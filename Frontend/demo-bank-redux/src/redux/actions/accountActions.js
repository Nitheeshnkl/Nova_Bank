import * as actionTypes from "./actionTypes";
import apiClient, { getStoredAccessToken } from "../../apiClient";

function getAccessToken() {
  return getStoredAccessToken();
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
  return async function (dispatch) {
    const accessToken = getAccessToken();
    if (!accessToken) {
      dispatch(getAccountsSuccess([]));
      return [];
    }

    try {
      const response = await apiClient.get("/app/dashboard");
      const accounts = Array.isArray(response.data?.userAccounts)
        ? response.data.userAccounts
        : [];
      dispatch(getAccountsSuccess(accounts));
      return accounts;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}

export function getTotalBalance(){
  return async function (dispatch) {
    const accessToken = getAccessToken();
    if (!accessToken) {
      dispatch(getTotalBalanceSuccess("0"));
      return "0";
    }

    try {
      const response = await apiClient.get("/app/dashboard");
      const balance = response.data?.totalBalance ?? "0";
      dispatch(getTotalBalanceSuccess(balance));
      return balance;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}

export function getTransactionHistory() {
  return async function (dispatch) {
    const accessToken = getAccessToken();
    if (!accessToken) {
      dispatch(getTransactionHistorySuccess([]));
      return [];
    }

    try {
      const response = await apiClient.get("/app/transaction_history");
      const history = Array.isArray(response.data?.transaction_history)
        ? response.data.transaction_history
        : [];
      dispatch(getTransactionHistorySuccess(history));
      return history;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}
