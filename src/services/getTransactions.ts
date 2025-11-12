import { TransactionRecord } from 'store/types';
import apiClient from './apiClient';

export const getTransactions = async (): Promise<TransactionRecord[]> =>
  await apiClient<TransactionRecord[]>('/api/transactions');

