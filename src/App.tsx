import * as React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ChitDetails } from "./components/details/chitDetails";
import { LoanDetails } from "./components/details/loanDetails";
import { CustomerDetails } from "./components/details/customerDetails";
import Dashboard from "./dashboard/dashboard";
import AddChit from "./forms/addChit";
import AddCustomer from "./forms/addCustomer";
import AddLoan from "./forms/addLoan";
import AddCollectionAgent from "./forms/addCollectionAgent";
import Login from "./components/auth/login";
import PrivateRoute from "./PrivateRoute";
import EditCustomer from "./forms/editCustomer";
import EditCollectionAgent from "./forms/editAgent";
import TransactionsGrid from "./components/datagrids/transactionsGrid";
import TransactionHistory from "./components/common/transactionHistory";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        x
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />}></Route>
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="transactionHistory/:id" element={<TransactionHistory />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/collection/details/:id" element={<TransactionsGrid />}></Route>
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/chit/:chit_id" element={<ChitDetails />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/loan/:loan_id" element={<LoanDetails />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/customer/:cust_id" element={<CustomerDetails />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/agent/:cust_id" element={<CustomerDetails />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/addChit" element={<AddChit />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/addCustomer" element={<AddCustomer />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/editCustomer" element={<EditCustomer />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/addAgent" element={<AddCollectionAgent />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/editAgent" element={<EditCollectionAgent />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/addLoan" element={<AddLoan />} />
        </Route>
        <Route path="/" element={<Login />}></Route>
        {/* <Route path="/chit/:chit_id" element={<ChitDetails />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
