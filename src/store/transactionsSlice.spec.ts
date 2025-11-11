import transactionsReducer, {
  getTransactionsThunk,
  selectTransactions,
  selectTransactionsLoading,
  selectTransactionsError,
  TransactionsState,
} from './transactionsSlice';
import { RootState } from './types';
import * as transactionsService from '../services/getTransactions';

jest.mock('../services/getTransactions');

describe('transactionsSlice', () => {
  const mockTransactions = [
    {
      id: '1',
      amount: 10000,
      payee: 'Test Store',
      memo: 'Test memo',
      timestamp: 1655220435730,
    },
    {
      id: '2',
      amount: -5000,
      payee: 'Another Store',
      memo: '',
      timestamp: 1655220435731,
    },
  ];

  describe('reducer', () => {
    it('should return the initial state', () => {
      const initialState: TransactionsState = {
        data: [],
        loading: false,
        error: null,
      };

      expect(transactionsReducer(undefined, { type: 'unknown' })).toEqual(
        initialState,
      );
    });

    it('should handle getTransactionsThunk.pending', () => {
      const initialState: TransactionsState = {
        data: [],
        loading: false,
        error: 'Previous error',
      };

      const action = { type: getTransactionsThunk.pending.type };
      const state = transactionsReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });

    it('should handle getTransactionsThunk.fulfilled', () => {
      const initialState: TransactionsState = {
        data: [],
        loading: true,
        error: null,
      };

      const action = {
        type: getTransactionsThunk.fulfilled.type,
        payload: mockTransactions,
      };
      const state = transactionsReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.data).toEqual(mockTransactions);
      expect(state.error).toBe(null);
    });

    it('should handle getTransactionsThunk.rejected', () => {
      const initialState: TransactionsState = {
        data: [],
        loading: true,
        error: null,
      };

      const errorMessage = 'Failed to fetch';
      const action = {
        type: getTransactionsThunk.rejected.type,
        error: { message: errorMessage },
      };
      const state = transactionsReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.data).toEqual([]);
    });

    it('should handle getTransactionsThunk.rejected with default error message', () => {
      const initialState: TransactionsState = {
        data: [],
        loading: true,
        error: null,
      };

      const action = {
        type: getTransactionsThunk.rejected.type,
        error: {},
      };
      const state = transactionsReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Failed to fetch transactions');
    });
  });

  describe('getTransactionsThunk', () => {
    it('should fetch transactions successfully', async () => {
      const mockGetTransactions = jest
        .spyOn(transactionsService, 'getTransactions')
        .mockResolvedValue(mockTransactions);

      const dispatch = jest.fn();
      const getState = jest.fn();

      const thunk = getTransactionsThunk();
      await thunk(dispatch, getState, undefined);

      expect(mockGetTransactions).toHaveBeenCalledTimes(1);
    });

    it('should handle fetch error', async () => {
      const errorMessage = 'Network error';
      jest
        .spyOn(transactionsService, 'getTransactions')
        .mockRejectedValue(new Error(errorMessage));

      const dispatch = jest.fn();
      const getState = jest.fn();

      const thunk = getTransactionsThunk();

      try {
        await thunk(dispatch, getState, undefined);
      } catch (error) {
        expect((error as Error).message).toBe(errorMessage);
      }
    });
  });

  describe('selectors', () => {
    const mockState: RootState = {
      transactions: {
        data: mockTransactions,
        loading: false,
        error: null,
      },
    };

    it('selectTransactions should return transactions data', () => {
      expect(selectTransactions(mockState)).toEqual(mockTransactions);
    });

    it('selectTransactionsLoading should return loading state', () => {
      expect(selectTransactionsLoading(mockState)).toBe(false);

      const loadingState: RootState = {
        ...mockState,
        transactions: { ...mockState.transactions, loading: true },
      };
      expect(selectTransactionsLoading(loadingState)).toBe(true);
    });

    it('selectTransactionsError should return error state', () => {
      expect(selectTransactionsError(mockState)).toBe(null);

      const errorState: RootState = {
        ...mockState,
        transactions: { ...mockState.transactions, error: 'Test error' },
      };
      expect(selectTransactionsError(errorState)).toBe('Test error');
    });
  });
});
