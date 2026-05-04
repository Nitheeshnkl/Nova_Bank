import * as React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Title from './Title';
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as accountActions from "../../redux/actions/accountActions";
import { Link as RouterLink } from "react-router-dom";

function TotalAccountBalance(props) {
  const { getTotalBalance, totalBalance } = props;
  const [currentDate, setCurrentDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadBalance() {
      setIsLoading(true);
      setError("");
      try {
        await getTotalBalance();
      } catch (error) {
        if (mounted) {
          setError("Balance is unavailable right now.");
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadBalance();

    const now = new Date();
    const formattedDate = `${now.getDate()} ${now.toLocaleString('default', { month: 'long' })}, ${now.getFullYear()}`;
    setCurrentDate(formattedDate);

    return () => {
      mounted = false;
    };
  }, [getTotalBalance]);

  return (
    <React.Fragment >
      <Title>Total Account Balance</Title>
      {error ? <Typography color="error">{error}</Typography> : null}
      <Typography component="p" variant="h4">
        {isLoading ? "Loading..." : totalBalance}
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        on {currentDate}
      </Typography>
      <div>
        <Link color="primary" component={RouterLink} to="/dashboard/balance">
          View balance
        </Link>
      </div>
    </React.Fragment>
  );
}

function mapDispatchToProps(dispatch) {
  return {
    getTotalBalance: bindActionCreators(accountActions.getTotalBalance, dispatch),
  };
}

function mapStateToProps(state) {
  return {
    totalBalance: state.totalBalanceReducer,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TotalAccountBalance);
