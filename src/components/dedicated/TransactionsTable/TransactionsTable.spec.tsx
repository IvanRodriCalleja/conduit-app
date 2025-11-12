import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TransactionsTable from './TransactionsTable';
import * as transactionsRepository from 'repositories/transactionsRepository';
import { TransactionRecord } from 'store/types';

jest.mock('repositories/transactionsRepository');

describe('TransactionsTable', () => {
  const mockLoad = jest.fn();
  const mockRetry = jest.fn();

  const mockUseTransactions = transactionsRepository.useTransactions as jest.MockedFunction<
    typeof transactionsRepository.useTransactions
  >;
  const mockUseTransactionsLoading = transactionsRepository.useTransactionsLoading as jest.MockedFunction<
    typeof transactionsRepository.useTransactionsLoading
  >;
  const mockUseTransactionsError = transactionsRepository.useTransactionsError as jest.MockedFunction<
    typeof transactionsRepository.useTransactionsError
  >;

  const mockTransactions: TransactionRecord[] = [
    {
      id: '1',
      amount: 10000,
      payee: 'Store A',
      memo: 'Purchase',
      timestamp: 1655220435730,
    },
    {
      id: '2',
      amount: -5000,
      payee: 'Store B',
      memo: 'Refund',
      timestamp: 1655220435740,
    },
    {
      id: '3',
      amount: 7500,
      payee: 'Store C',
      memo: 'Payment',
      timestamp: 1655220435750,
    },
  ];

  beforeEach(() => {
    mockLoad.mockClear();
    mockRetry.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Loading State', () => {
    it('should show skeleton when loading is true and no error', () => {
      mockUseTransactions.mockReturnValue({
        transactions: [],
        load: mockLoad,
      });
      mockUseTransactionsLoading.mockReturnValue(true);
      mockUseTransactionsError.mockReturnValue({
        error: null,
        retry: mockRetry,
      });

      render(<TransactionsTable />);

      // Should show skeleton headers
      expect(screen.getAllByText('Date').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Payee').length).toBeGreaterThanOrEqual(1);

      // Should not show actual transaction data
      expect(screen.queryByText('Store A')).not.toBeInTheDocument();
    });

    it('should call load function when component mounts while loading', () => {
      mockUseTransactions.mockReturnValue({
        transactions: [],
        load: mockLoad,
      });
      mockUseTransactionsLoading.mockReturnValue(true);
      mockUseTransactionsError.mockReturnValue({
        error: null,
        retry: mockRetry,
      });

      render(<TransactionsTable />);

      expect(mockLoad).toHaveBeenCalledTimes(1);
    });
  });

  describe('Error State', () => {
    it('should show error message when there is an error and not loading', () => {
      mockUseTransactions.mockReturnValue({
        transactions: [],
        load: mockLoad,
      });
      mockUseTransactionsLoading.mockReturnValue(false);
      mockUseTransactionsError.mockReturnValue({
        error: 'Failed to fetch transactions',
        retry: mockRetry,
      });

      render(<TransactionsTable />);

      expect(screen.getByText('Failed to load transactions')).toBeInTheDocument();
      expect(screen.getByText('Failed to fetch transactions')).toBeInTheDocument();
      expect(screen.getByText('Retry')).toBeInTheDocument();
    });

    it('should call retry function when retry button is clicked', async () => {
      const user = userEvent.setup();

      mockUseTransactions.mockReturnValue({
        transactions: [],
        load: mockLoad,
      });
      mockUseTransactionsLoading.mockReturnValue(false);
      mockUseTransactionsError.mockReturnValue({
        error: 'Network error',
        retry: mockRetry,
      });

      render(<TransactionsTable />);

      const retryButton = screen.getByText('Retry');
      await user.click(retryButton);

      expect(mockRetry).toHaveBeenCalledTimes(1);
    });

    it('should not show transaction data when there is an error', () => {
      mockUseTransactions.mockReturnValue({
        transactions: mockTransactions,
        load: mockLoad,
      });
      mockUseTransactionsLoading.mockReturnValue(false);
      mockUseTransactionsError.mockReturnValue({
        error: 'Server error',
        retry: mockRetry,
      });

      render(<TransactionsTable />);

      expect(screen.queryByText('Store A')).not.toBeInTheDocument();
      expect(screen.queryByText('Store B')).not.toBeInTheDocument();
    });
  });

  describe('Success State with Data', () => {
    it('should show transactions when not loading and no error', () => {
      mockUseTransactions.mockReturnValue({
        transactions: mockTransactions,
        load: mockLoad,
      });
      mockUseTransactionsLoading.mockReturnValue(false);
      mockUseTransactionsError.mockReturnValue({
        error: null,
        retry: mockRetry,
      });

      render(<TransactionsTable />);

      expect(screen.getByText('Store A')).toBeInTheDocument();
      expect(screen.getByText('Store B')).toBeInTheDocument();
      expect(screen.getByText('Store C')).toBeInTheDocument();
    });

    it('should show table headers when displaying data', () => {
      mockUseTransactions.mockReturnValue({
        transactions: mockTransactions,
        load: mockLoad,
      });
      mockUseTransactionsLoading.mockReturnValue(false);
      mockUseTransactionsError.mockReturnValue({
        error: null,
        retry: mockRetry,
      });

      render(<TransactionsTable />);

      expect(screen.getByText('Date')).toBeInTheDocument();
      expect(screen.getByText('Payee')).toBeInTheDocument();
      expect(screen.getByText('Memo')).toBeInTheDocument();
      expect(screen.getByText('Amount')).toBeInTheDocument();
    });

    it('should render transactions in descending order by timestamp', () => {
      // Transactions are expected to be already sorted by the reducer
      const sortedTransactions: TransactionRecord[] = [
        {
          id: '3',
          amount: 300,
          payee: 'Newest',
          memo: '',
          timestamp: 3000,
        },
        {
          id: '2',
          amount: 200,
          payee: 'Middle',
          memo: '',
          timestamp: 2000,
        },
        {
          id: '1',
          amount: 100,
          payee: 'Oldest',
          memo: '',
          timestamp: 1000,
        },
      ];

      mockUseTransactions.mockReturnValue({
        transactions: sortedTransactions,
        load: mockLoad,
      });
      mockUseTransactionsLoading.mockReturnValue(false);
      mockUseTransactionsError.mockReturnValue({
        error: null,
        retry: mockRetry,
      });

      render(<TransactionsTable />);

      // Check that payees appear in the correct order (already sorted from store)
      const payees = screen.getAllByText(/Oldest|Middle|Newest/);
      expect(payees[0]).toHaveTextContent('Newest');
      expect(payees[1]).toHaveTextContent('Middle');
      expect(payees[2]).toHaveTextContent('Oldest');
    });
  });

  describe('Empty State', () => {
    it('should show empty table with headers when no transactions and no error', () => {
      mockUseTransactions.mockReturnValue({
        transactions: [],
        load: mockLoad,
      });
      mockUseTransactionsLoading.mockReturnValue(false);
      mockUseTransactionsError.mockReturnValue({
        error: null,
        retry: mockRetry,
      });

      render(<TransactionsTable />);

      expect(screen.getByText('Date')).toBeInTheDocument();
      expect(screen.getByText('Payee')).toBeInTheDocument();
      expect(screen.getByText('Memo')).toBeInTheDocument();
      expect(screen.getByText('Amount')).toBeInTheDocument();

      // No transaction data should be present
      expect(screen.queryByText(/Store/)).not.toBeInTheDocument();
    });

    it('should not show error or loading state when empty', () => {
      mockUseTransactions.mockReturnValue({
        transactions: [],
        load: mockLoad,
      });
      mockUseTransactionsLoading.mockReturnValue(false);
      mockUseTransactionsError.mockReturnValue({
        error: null,
        retry: mockRetry,
      });

      render(<TransactionsTable />);

      expect(screen.queryByText('Failed to load transactions')).not.toBeInTheDocument();
      expect(screen.queryByText('Retry')).not.toBeInTheDocument();
    });
  });

  describe('Loading with Error State', () => {
    it('should prioritize loading state over error state', () => {
      mockUseTransactions.mockReturnValue({
        transactions: [],
        load: mockLoad,
      });
      mockUseTransactionsLoading.mockReturnValue(true);
      mockUseTransactionsError.mockReturnValue({
        error: 'Some error',
        retry: mockRetry,
      });

      render(<TransactionsTable />);

      // Should show loading skeleton, not error
      expect(screen.getAllByText('Date').length).toBeGreaterThanOrEqual(1);
      expect(screen.queryByText('Failed to load transactions')).not.toBeInTheDocument();
    });
  });

  describe('State Transitions', () => {
    it('should call load once on mount regardless of state', () => {
      mockUseTransactions.mockReturnValue({
        transactions: mockTransactions,
        load: mockLoad,
      });
      mockUseTransactionsLoading.mockReturnValue(false);
      mockUseTransactionsError.mockReturnValue({
        error: null,
        retry: mockRetry,
      });

      render(<TransactionsTable />);

      expect(mockLoad).toHaveBeenCalledTimes(1);
    });

    it('should render single transaction correctly', () => {
      const singleTransaction: TransactionRecord[] = [
        {
          id: 'single',
          amount: 5000,
          payee: 'Single Store',
          memo: 'Single Purchase',
          timestamp: 1655220435730,
        },
      ];

      mockUseTransactions.mockReturnValue({
        transactions: singleTransaction,
        load: mockLoad,
      });
      mockUseTransactionsLoading.mockReturnValue(false);
      mockUseTransactionsError.mockReturnValue({
        error: null,
        retry: mockRetry,
      });

      render(<TransactionsTable />);

      expect(screen.getByText('Single Store')).toBeInTheDocument();
    });

    it('should handle large number of transactions', () => {
      const manyTransactions: TransactionRecord[] = Array.from({ length: 100 }, (_, i) => ({
        id: `trans-${i}`,
        amount: 1000 * i,
        payee: `Store ${i}`,
        memo: `Purchase ${i}`,
        timestamp: 1655220435730 + i,
      }));

      mockUseTransactions.mockReturnValue({
        transactions: manyTransactions,
        load: mockLoad,
      });
      mockUseTransactionsLoading.mockReturnValue(false);
      mockUseTransactionsError.mockReturnValue({
        error: null,
        retry: mockRetry,
      });

      render(<TransactionsTable />);

      // Check that some transactions from the set are rendered
      expect(screen.getByText('Store 0')).toBeInTheDocument();
      expect(screen.getByText('Store 50')).toBeInTheDocument();
      expect(screen.getByText('Store 99')).toBeInTheDocument();
    });
  });
});
