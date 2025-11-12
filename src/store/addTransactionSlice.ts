import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './types';
import { addTransaction, AddTransactionPayload } from '../services/addTransaction';
import { getTransactionsThunk, goToPageWithTransaction } from './transactionsSlice';

export interface AddTransactionState {
  loading: boolean;
  error: string | null;
  newlyAddedId: string | null;
}

const initialState: AddTransactionState = {
  loading: false,
  error: null,
  newlyAddedId: null,
};

export const addTransactionThunk = createAsyncThunk(
  'addTransaction/add',
  async (payload: AddTransactionPayload, { dispatch }) => {
    const transaction = await addTransaction(payload);

    dispatch(setNewlyAddedId(transaction.id));

    await dispatch(getTransactionsThunk());

    dispatch(goToPageWithTransaction(transaction.id));

    setTimeout(() => {
      dispatch(clearNewlyAddedId());
    }, 1000);

    return transaction;
  },
);

const addTransactionSlice = createSlice({
  name: 'addTransaction',
  initialState,
  reducers: {
    setNewlyAddedId: (state, action: PayloadAction<string>) => {
      state.newlyAddedId = action.payload;
    },
    clearNewlyAddedId: (state) => {
      state.newlyAddedId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addTransactionThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTransactionThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addTransactionThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add transaction';
      });
  },
});

// Actions
export const { setNewlyAddedId, clearNewlyAddedId } = addTransactionSlice.actions;

// Selectors
export const selectNewlyAddedId = (state: RootState) =>
  state.addTransaction.newlyAddedId;
export const selectAddTransactionLoading = (state: RootState) =>
  state.addTransaction.loading;
export const selectAddTransactionError = (state: RootState) =>
  state.addTransaction.error;

export default addTransactionSlice.reducer;
