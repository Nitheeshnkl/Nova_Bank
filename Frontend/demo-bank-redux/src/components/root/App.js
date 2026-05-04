import Login from "../login/Login";
import Register from "../register/Register";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard"
import { getStoredAccessToken } from "../../apiClient";

function hasValidSession() {
  return Boolean(getStoredAccessToken());
}

function App() {
  return (
    <div>
      <BrowserRouter className="App" id="light">
        <Routes>
          <Route
            path="/"
            element={hasValidSession() ? <Navigate to="/dashboard" replace /> : <Login />}
          />
          <Route
            path="/login"
            element={hasValidSession() ? <Navigate to="/dashboard" replace /> : <Login />}
          />
          <Route
            path="/register"
            element={hasValidSession() ? <Navigate to="/dashboard" replace /> : <Register />}
          />
          <Route
            path="/dashboard"
            element={hasValidSession() ? <Dashboard /> : <Navigate to="/" replace />}
          />
          <Route
            path="/dashboard/balance"
            element={hasValidSession() ? <Dashboard page="balance" /> : <Navigate to="/" replace />}
          />
          <Route
            path="/dashboard/orders"
            element={hasValidSession() ? <Dashboard page="orders" /> : <Navigate to="/" replace />}
          />
          <Route
            path="/dashboard/customers"
            element={hasValidSession() ? <Dashboard page="customers" /> : <Navigate to="/" replace />}
          />
          <Route
            path="/dashboard/reports"
            element={hasValidSession() ? <Dashboard page="reports" /> : <Navigate to="/" replace />}
          />
          <Route
            path="/dashboard/integrations"
            element={hasValidSession() ? <Dashboard page="integrations" /> : <Navigate to="/" replace />}
          />
          <Route
            path="/dashboard/saved-reports/current-month"
            element={hasValidSession() ? <Dashboard page="saved-reports-current-month" /> : <Navigate to="/" replace />}
          />
          <Route
            path="/dashboard/saved-reports/last-quarter"
            element={hasValidSession() ? <Dashboard page="saved-reports-last-quarter" /> : <Navigate to="/" replace />}
          />
          <Route
            path="/dashboard/saved-reports/year-end-sale"
            element={hasValidSession() ? <Dashboard page="saved-reports-year-end-sale" /> : <Navigate to="/" replace />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
