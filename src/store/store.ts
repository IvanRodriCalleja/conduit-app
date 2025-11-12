import { configureStore } from "@reduxjs/toolkit";
import transactionsReducer from "./transactionsSlice";
import addTransactionReducer from "./addTransactionSlice";

const store = configureStore({
  reducer: {
    transactions: transactionsReducer,
    addTransaction: addTransactionReducer,
  },
});

export default store;
