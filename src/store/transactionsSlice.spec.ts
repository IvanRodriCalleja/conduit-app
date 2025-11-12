import transactionsReducer, {
  getTransactionsThunk,
  selectTransactions,
  selectTransactionsLoading,
  selectTransactionsIsReloading,
  selectTransactionsError,
  selectPaginatedTransactions,
  selectCurrentPage,
  selectTotalPages,
  selectPageSize,
  setPage,
  nextPage,
  previousPage,
  goToPageWithTransaction,
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
        isReloading: false,
        currentPage: 1,
        pageSize: 10,
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
        isReloading: false,
        currentPage: 1,
        pageSize: 10,
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
        isReloading: false,
        currentPage: 1,
        pageSize: 10,
        error: null,
      };

      const action = {
        type: getTransactionsThunk.fulfilled.type,
        payload: mockTransactions,
      };
      const state = transactionsReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.data.length).toBe(mockTransactions.length);
      expect(state.error).toBe(null);
    });

    it('should sort transactions by timestamp in descending order on fulfilled', () => {
      const initialState: TransactionsState = {
        data: [],
        loading: true,
        isReloading: false,
        currentPage: 1,
        pageSize: 10,
        error: null,
      };

      const unsortedTransactions = [
        {
          id: '1',
          amount: 10000,
          payee: 'Old Store',
          memo: 'Old',
          timestamp: 1000,
        },
        {
          id: '2',
          amount: -5000,
          payee: 'Newest Store',
          memo: 'Newest',
          timestamp: 3000,
        },
        {
          id: '3',
          amount: 7500,
          payee: 'Middle Store',
          memo: 'Middle',
          timestamp: 2000,
        },
      ];

      const action = {
        type: getTransactionsThunk.fulfilled.type,
        payload: unsortedTransactions,
      };
      const state = transactionsReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.data[0].timestamp).toBe(3000); // Newest
      expect(state.data[1].timestamp).toBe(2000); // Middle
      expect(state.data[2].timestamp).toBe(1000); // Oldest
      expect(state.data[0].payee).toBe('Newest Store');
      expect(state.data[1].payee).toBe('Middle Store');
      expect(state.data[2].payee).toBe('Old Store');
    });

    it('should handle getTransactionsThunk.rejected', () => {
      const initialState: TransactionsState = {
        data: [],
        loading: true,
        isReloading: false,
        currentPage: 1,
        pageSize: 10,
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
        isReloading: false,
        currentPage: 1,
        pageSize: 10,
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

    it('should set isReloading when pending and data exists', () => {
      const initialState: TransactionsState = {
        data: mockTransactions,
        loading: false,
        isReloading: false,
        currentPage: 1,
        pageSize: 10,
        error: null,
      };

      const action = { type: getTransactionsThunk.pending.type };
      const state = transactionsReducer(initialState, action);

      expect(state.isReloading).toBe(true);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(null);
    });

    it('should set loading when pending and no data exists', () => {
      const initialState: TransactionsState = {
        data: [],
        loading: false,
        isReloading: false,
        currentPage: 1,
        pageSize: 10,
        error: null,
      };

      const action = { type: getTransactionsThunk.pending.type };
      const state = transactionsReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.isReloading).toBe(false);
      expect(state.error).toBe(null);
    });

    it('should clear isReloading on fulfilled', () => {
      const initialState: TransactionsState = {
        data: mockTransactions,
        loading: false,
        currentPage: 1,
        pageSize: 10,
        isReloading: true,
        error: null,
      };

      const action = {
        type: getTransactionsThunk.fulfilled.type,
        payload: mockTransactions,
      };
      const state = transactionsReducer(initialState, action);

      expect(state.isReloading).toBe(false);
      expect(state.loading).toBe(false);
    });

    it('should clear isReloading on rejected', () => {
      const initialState: TransactionsState = {
        data: mockTransactions,
        loading: false,
        currentPage: 1,
        pageSize: 10,
        isReloading: true,
        error: null,
      };

      const action = {
        type: getTransactionsThunk.rejected.type,
        error: { message: 'Error' },
      };
      const state = transactionsReducer(initialState, action);

      expect(state.isReloading).toBe(false);
      expect(state.loading).toBe(false);
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
        isReloading: false,
        currentPage: 1,
        pageSize: 10,
        error: null,
      },
      addTransaction: {
        loading: false,
        error: null,
        newlyAddedId: null,
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

    it('selectTransactionsIsReloading should return isReloading state', () => {
      expect(selectTransactionsIsReloading(mockState)).toBe(false);

      const reloadingState: RootState = {
        ...mockState,
        transactions: { ...mockState.transactions, isReloading: true },
      };
      expect(selectTransactionsIsReloading(reloadingState)).toBe(true);
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

  describe('pagination actions', () => {
    it('should handle setPage', () => {
      const initialState: TransactionsState = {
        data: mockTransactions,
        loading: false,
        isReloading: false,
        currentPage: 1,
        pageSize: 10,
        error: null,
      };

      const action = setPage(3);
      const state = transactionsReducer(initialState, action);

      expect(state.currentPage).toBe(3);
    });

    it('should handle nextPage when not at the last page', () => {
      const manyTransactions = Array.from({ length: 25 }, (_, i) => ({
        id: `${i}`,
        amount: i * 100,
        payee: `Store ${i}`,
        memo: '',
        timestamp: 1000 + i,
      }));

      const initialState: TransactionsState = {
        data: manyTransactions,
        loading: false,
        isReloading: false,
        currentPage: 1,
        pageSize: 10,
        error: null,
      };

      const action = nextPage();
      const state = transactionsReducer(initialState, action);

      expect(state.currentPage).toBe(2);
    });

    it('should not increment page when at the last page', () => {
      const manyTransactions = Array.from({ length: 25 }, (_, i) => ({
        id: `${i}`,
        amount: i * 100,
        payee: `Store ${i}`,
        memo: '',
        timestamp: 1000 + i,
      }));

      const initialState: TransactionsState = {
        data: manyTransactions,
        loading: false,
        isReloading: false,
        currentPage: 3, // Last page (25 items / 10 per page = 3 pages)
        pageSize: 10,
        error: null,
      };

      const action = nextPage();
      const state = transactionsReducer(initialState, action);

      expect(state.currentPage).toBe(3);
    });

    it('should handle previousPage when not at the first page', () => {
      const initialState: TransactionsState = {
        data: mockTransactions,
        loading: false,
        isReloading: false,
        currentPage: 3,
        pageSize: 10,
        error: null,
      };

      const action = previousPage();
      const state = transactionsReducer(initialState, action);

      expect(state.currentPage).toBe(2);
    });

    it('should not decrement page when at the first page', () => {
      const initialState: TransactionsState = {
        data: mockTransactions,
        loading: false,
        isReloading: false,
        currentPage: 1,
        pageSize: 10,
        error: null,
      };

      const action = previousPage();
      const state = transactionsReducer(initialState, action);

      expect(state.currentPage).toBe(1);
    });

    it('should handle goToPageWithTransaction when transaction exists', () => {
      const manyTransactions = Array.from({ length: 25 }, (_, i) => ({
        id: `trans-${i}`,
        amount: i * 100,
        payee: `Store ${i}`,
        memo: '',
        timestamp: 1000 + i,
      }));

      const initialState: TransactionsState = {
        data: manyTransactions,
        loading: false,
        isReloading: false,
        currentPage: 1,
        pageSize: 10,
        error: null,
      };

      // Transaction at index 15 should be on page 2 (index 10-19 = page 2)
      const action = goToPageWithTransaction('trans-15');
      const state = transactionsReducer(initialState, action);

      expect(state.currentPage).toBe(2);
    });

    it('should not change page when transaction does not exist', () => {
      const initialState: TransactionsState = {
        data: mockTransactions,
        loading: false,
        isReloading: false,
        currentPage: 1,
        pageSize: 10,
        error: null,
      };

      const action = goToPageWithTransaction('nonexistent-id');
      const state = transactionsReducer(initialState, action);

      expect(state.currentPage).toBe(1);
    });
  });

  describe('pagination selectors', () => {
    const baseMockState: RootState = {
      transactions: {
        data: mockTransactions,
        loading: false,
        isReloading: false,
        currentPage: 1,
        pageSize: 10,
        error: null,
      },
      addTransaction: {
        loading: false,
        error: null,
        newlyAddedId: null,
      },
    };

    it('selectCurrentPage should return current page', () => {
      expect(selectCurrentPage(baseMockState)).toBe(1);

      const page2State: RootState = {
        ...baseMockState,
        transactions: { ...baseMockState.transactions, currentPage: 2 },
      };
      expect(selectCurrentPage(page2State)).toBe(2);
    });

    it('selectPageSize should return page size', () => {
      expect(selectPageSize(baseMockState)).toBe(10);
    });

    it('selectTotalPages should calculate total pages correctly', () => {
      expect(selectTotalPages(baseMockState)).toBe(1); // 2 transactions / 10 per page = 1 page

      const manyTransactions = Array.from({ length: 25 }, (_, i) => ({
        id: `${i}`,
        amount: i * 100,
        payee: `Store ${i}`,
        memo: '',
        timestamp: 1000 + i,
      }));

      const manyState: RootState = {
        ...baseMockState,
        transactions: {
          ...baseMockState.transactions,
          data: manyTransactions,
        },
      };

      expect(selectTotalPages(manyState)).toBe(3); // 25 transactions / 10 per page = 3 pages
    });

    it('selectPaginatedTransactions should return correct slice for current page', () => {
      const manyTransactions = Array.from({ length: 25 }, (_, i) => ({
        id: `trans-${i}`,
        amount: i * 100,
        payee: `Store ${i}`,
        memo: '',
        timestamp: 1000 + i,
      }));

      const page1State: RootState = {
        ...baseMockState,
        transactions: {
          ...baseMockState.transactions,
          data: manyTransactions,
          currentPage: 1,
        },
      };

      const page1Results = selectPaginatedTransactions(page1State);
      expect(page1Results.length).toBe(10);
      expect(page1Results[0].id).toBe('trans-0');
      expect(page1Results[9].id).toBe('trans-9');

      const page2State: RootState = {
        ...baseMockState,
        transactions: {
          ...baseMockState.transactions,
          data: manyTransactions,
          currentPage: 2,
        },
      };

      const page2Results = selectPaginatedTransactions(page2State);
      expect(page2Results.length).toBe(10);
      expect(page2Results[0].id).toBe('trans-10');
      expect(page2Results[9].id).toBe('trans-19');

      const page3State: RootState = {
        ...baseMockState,
        transactions: {
          ...baseMockState.transactions,
          data: manyTransactions,
          currentPage: 3,
        },
      };

      const page3Results = selectPaginatedTransactions(page3State);
      expect(page3Results.length).toBe(5); // Last page has only 5 items
      expect(page3Results[0].id).toBe('trans-20');
      expect(page3Results[4].id).toBe('trans-24');
    });

    it('selectPaginatedTransactions should return empty array when no data', () => {
      const emptyState: RootState = {
        ...baseMockState,
        transactions: {
          ...baseMockState.transactions,
          data: [],
        },
      };

      const results = selectPaginatedTransactions(emptyState);
      expect(results).toEqual([]);
    });
  });
});
