import store from './store';

export type Dispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;

export type TransactionRecord = {
  amount: number;
  id: string;
  memo: string;
  payee: string;
  timestamp: number;
};
