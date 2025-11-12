import { TransactionRecord } from 'store/types';
import apiClient from './apiClient';

export type AddTransactionPayload = {
  amount: number;
  memo?: string;
  payee: string;
  timestamp: number;
};

export const addTransaction = async (
  payload: AddTransactionPayload,
): Promise<TransactionRecord> =>
  await apiClient<TransactionRecord>('/api/transactions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
