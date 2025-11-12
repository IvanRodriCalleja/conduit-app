import addTransactionReducer, {
  AddTransactionState,
  setNewlyAddedId,
  clearNewlyAddedId,
  selectNewlyAddedId,
} from './addTransactionSlice';
import { RootState } from './types';

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

  describe('selectors', () => {
    const mockState: RootState = {
      transactions: {
        data: [],
        loading: false,
        isReloading: false,
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
