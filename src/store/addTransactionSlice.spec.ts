import addTransactionReducer, {
  AddTransactionState,
  setNewlyAddedId,
  clearNewlyAddedId,
  selectNewlyAddedId,
  addTransactionThunk,
} from './addTransactionSlice';
import { RootState } from './types';
import * as addTransactionService from '../services/addTransaction';

jest.mock('../services/addTransaction');

describe('addTransactionSlice', () => {
  describe('reducer', () => {
    it('should return the initial state', () => {
      const initialState: AddTransactionState = {
        loading: false,
        error: null,
        newlyAddedId: null,
      };

      expect(addTransactionReducer(undefined, { type: 'unknown' })).toEqual(
        initialState,
      );
    });

    it('should handle setNewlyAddedId', () => {
      const initialState: AddTransactionState = {
        loading: false,
        error: null,
        newlyAddedId: null,
      };

      const action = setNewlyAddedId('transaction-123');
      const state = addTransactionReducer(initialState, action);

      expect(state.newlyAddedId).toBe('transaction-123');
    });

    it('should handle clearNewlyAddedId', () => {
      const initialState: AddTransactionState = {
        loading: false,
        error: null,
        newlyAddedId: 'transaction-123',
      };

      const action = clearNewlyAddedId();
      const state = addTransactionReducer(initialState, action);

      expect(state.newlyAddedId).toBe(null);
    });

    it('should handle multiple setNewlyAddedId calls', () => {
      let state: AddTransactionState = {
        loading: false,
        error: null,
        newlyAddedId: null,
      };

      state = addTransactionReducer(state, setNewlyAddedId('transaction-1'));
      expect(state.newlyAddedId).toBe('transaction-1');

      state = addTransactionReducer(state, setNewlyAddedId('transaction-2'));
      expect(state.newlyAddedId).toBe('transaction-2');
    });
  });

  describe('addTransactionThunk', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
    });

    it('should clear highlight 1 second after refetch completes', async () => {
      const mockTransaction = {
        id: 'new-transaction-id',
        amount: 5000,
        payee: 'Test Payee',
        memo: 'Test memo',
        timestamp: Date.now(),
      };

      jest
        .spyOn(addTransactionService, 'addTransaction')
        .mockResolvedValue(mockTransaction);

      const dispatch = jest.fn();
      const getState = jest.fn();

      dispatch.mockResolvedValue({ type: 'fulfilled' });

      const payload = {
        amount: 5000,
        payee: 'Test Payee',
        memo: 'Test memo',
        timestamp: Date.now(),
      };

      const thunk = addTransactionThunk(payload);
      await thunk(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith(
        setNewlyAddedId('new-transaction-id'),
      );
      expect(dispatch).toHaveBeenCalledWith(expect.any(Function));
      expect(dispatch).not.toHaveBeenCalledWith(clearNewlyAddedId());

      jest.advanceTimersByTime(1000);

      expect(dispatch).toHaveBeenCalledWith(clearNewlyAddedId());
    });

    it('should wait for refetch to complete before starting timer', async () => {
      const mockTransaction = {
        id: 'new-transaction-id',
        amount: 5000,
        payee: 'Test Payee',
        memo: 'Test memo',
        timestamp: Date.now(),
      };

      jest
        .spyOn(addTransactionService, 'addTransaction')
        .mockResolvedValue(mockTransaction);

      const dispatch = jest.fn();
      const getState = jest.fn();

      let refetchResolver: () => void;
      const refetchPromise = new Promise<void>((resolve) => {
        refetchResolver = resolve;
      });

      // Mock dispatch to control when getTransactionsThunk completes
      dispatch.mockImplementation((action: any) => {
        if (typeof action === 'function') {
          return refetchPromise;
        }
        return action;
      });

      const payload = {
        amount: 5000,
        payee: 'Test Payee',
        memo: 'Test memo',
        timestamp: Date.now(),
      };

      const thunk = addTransactionThunk(payload);
      const thunkPromise = thunk(dispatch, getState, undefined);

      jest.advanceTimersByTime(500);

      expect(dispatch).not.toHaveBeenCalledWith(clearNewlyAddedId());

      refetchResolver!();
      await thunkPromise;

      expect(dispatch).not.toHaveBeenCalledWith(clearNewlyAddedId());

      jest.advanceTimersByTime(1000);

      expect(dispatch).toHaveBeenCalledWith(clearNewlyAddedId());
    });
  });

  describe('selectors', () => {
    const mockState: RootState = {
      transactions: {
        data: [],
        loading: false,
        isReloading: false,
        currentPage: 1,
        pageSize: 10,
        error: null,
      },
      addTransaction: {
        loading: false,
        error: null,
        newlyAddedId: 'transaction-456',
      },
    };

    it('selectNewlyAddedId should return newlyAddedId', () => {
      expect(selectNewlyAddedId(mockState)).toBe('transaction-456');
    });

    it('selectNewlyAddedId should return null when no ID is set', () => {
      const stateWithNoId: RootState = {
        transactions: {
          data: [],
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

      expect(selectNewlyAddedId(stateWithNoId)).toBe(null);
    });
  });
});
