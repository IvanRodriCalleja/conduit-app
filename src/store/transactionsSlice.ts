import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TransactionRecord, RootState } from './types';
import { getTransactions } from '../services/getTransactions';

export interface TransactionsState {
  data: TransactionRecord[];
  loading: boolean;
  error: string | null;
}

const initialState: TransactionsState = {
  data: [],
  loading: false,
  error: null,
};

export const getTransactionsThunk = createAsyncThunk(
  'transactions/getTransactions',
  async () => {
    const transactions = await getTransactions();
    return transactions;
  },
);

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTransactionsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTransactionsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.sort((a, b) => b.timestamp - a.timestamp);
      })
      .addCase(getTransactionsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch transactions';
      });
  },
});

// Selectors
export const selectTransactions = (state: RootState) => state.transactions.data;
export const selectTransactionsLoading = (state: RootState) =>
  state.transactions.loading;
export const selectTransactionsError = (state: RootState) =>
  state.transactions.error;

export default transactionsSlice.reducer;
