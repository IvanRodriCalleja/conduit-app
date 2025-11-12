import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TransactionRecord, RootState } from './types';
import { getTransactions } from '../services/getTransactions';

export interface TransactionsState {
  data: TransactionRecord[];
  loading: boolean;
  isReloading: boolean;
  error: string | null;
  currentPage: number;
  pageSize: number;
}

const initialState: TransactionsState = {
  data: [],
  loading: false,
  isReloading: false,
  error: null,
  currentPage: 1,
  pageSize: 10,
};

export const getTransactionsThunk = createAsyncThunk(
  'transactions/getTransactions',
  async () => {
    const transactions = await getTransactions();
    return transactions;
  },
);

export const refreshTransactionsThunk = createAsyncThunk(
  'transactions/refresh',
  async (_, { dispatch }) => {
    await dispatch(getTransactionsThunk());
  },
);

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
    nextPage: (state) => {
      const totalPages = Math.ceil(state.data.length / state.pageSize);
      if (state.currentPage < totalPages) {
        state.currentPage += 1;
      }
    },
    previousPage: (state) => {
      if (state.currentPage > 1) {
        state.currentPage -= 1;
      }
    },
    goToPageWithTransaction: (state, action) => {
      const transactionId = action.payload;
      const index = state.data.findIndex(t => t.id === transactionId);
      if (index !== -1) {
        const page = Math.floor(index / state.pageSize) + 1;
        state.currentPage = page;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTransactionsThunk.pending, (state) => {
        if (state.data.length > 0) {
          state.isReloading = true;
        } else {
          state.loading = true;
        }
        state.error = null;
      })
      .addCase(getTransactionsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isReloading = false;
        state.data = [...action.payload].sort((a, b) => b.timestamp - a.timestamp);
      })
      .addCase(getTransactionsThunk.rejected, (state, action) => {
        state.loading = false;
        state.isReloading = false;
        state.error = action.error.message || 'Failed to fetch transactions';
      });
  },
});

// Actions
export const { setPage, nextPage, previousPage, goToPageWithTransaction } = transactionsSlice.actions;

// Selectors
export const selectTransactions = (state: RootState) => state.transactions.data;
export const selectTransactionsLoading = (state: RootState) =>
  state.transactions.loading;
export const selectTransactionsIsReloading = (state: RootState) =>
  state.transactions.isReloading;
export const selectTransactionsError = (state: RootState) =>
  state.transactions.error;
export const selectCurrentPage = (state: RootState) =>
  state.transactions.currentPage;
export const selectPageSize = (state: RootState) =>
  state.transactions.pageSize;
export const selectPaginatedTransactions = (state: RootState) => {
  const { data, currentPage, pageSize } = state.transactions;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return data.slice(startIndex, endIndex);
};
export const selectTotalPages = (state: RootState) => {
  const { data, pageSize } = state.transactions;
  return Math.ceil(data.length / pageSize);
};

export default transactionsSlice.reducer;
