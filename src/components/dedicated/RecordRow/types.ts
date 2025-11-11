import { TransactionRecord } from 'store/types';

export interface RecordRowProps {
  columnStyles: {
    amount: string;
    date: string;
    payee: string;
  };
  transactionRecord: TransactionRecord;
}
