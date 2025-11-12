import React from 'react';
import { render, screen } from '@testing-library/react';
import RecordRow from './RecordRow';
import { TransactionRecord } from 'store/types';

describe('RecordRow', () => {
  const mockColumnStyles = {
    amount: 'column-amount',
    date: 'column-date',
    payee: 'column-payee',
    memo: 'column-memo',
  };

  const mockTransaction: TransactionRecord = {
    id: 'test-1',
    amount: 10000,
    payee: 'Test Store',
    memo: 'Test purchase',
    timestamp: 1655220435730, // 2022-06-14 18:20:35.730 (exact time may vary by timezone)
  };

  describe('Rendering', () => {
    it('should render payee name', () => {
      render(
        <RecordRow
          columnStyles={mockColumnStyles}
          transactionRecord={mockTransaction}
        />
      );

      expect(screen.getByText('Test Store')).toBeInTheDocument();
    });

    it('should render memo', () => {
      render(
        <RecordRow
          columnStyles={mockColumnStyles}
          transactionRecord={mockTransaction}
        />
      );

      expect(screen.getByText('Test purchase')).toBeInTheDocument();
    });

    it('should render formatted date', () => {
      render(
        <RecordRow
          columnStyles={mockColumnStyles}
          transactionRecord={mockTransaction}
        />
      );

      expect(screen.getByText(/2022-06-14/)).toBeInTheDocument();
    });

    it('should render currency amount', () => {
      render(
        <RecordRow
          columnStyles={mockColumnStyles}
          transactionRecord={mockTransaction}
        />
      );

      expect(screen.getByText('100.00')).toBeInTheDocument();
      expect(screen.getByText('USD')).toBeInTheDocument();
    });

    it('should render empty string when memo is not provided', () => {
      const transactionWithoutMemo: TransactionRecord = {
        ...mockTransaction,
        memo: '',
      };

      const { container } = render(
        <RecordRow
          columnStyles={mockColumnStyles}
          transactionRecord={transactionWithoutMemo}
        />
      );

      const columns = container.querySelectorAll('[class*="column"]');
      expect(columns.length).toBeGreaterThan(0);
    });
  });

  describe('Positive and Negative Amounts', () => {
    it('should apply negative class for negative amounts', () => {
      const negativeTransaction: TransactionRecord = {
        ...mockTransaction,
        amount: -5000,
      };

      render(
        <RecordRow
          columnStyles={mockColumnStyles}
          transactionRecord={negativeTransaction}
        />
      );

      expect(screen.getByText('-50.00')).toBeInTheDocument();
    });

    it('should not apply negative class for positive amounts', () => {
      const positiveTransaction: TransactionRecord = {
        ...mockTransaction,
        amount: 5000,
      };

      const { container } = render(
        <RecordRow
          columnStyles={mockColumnStyles}
          transactionRecord={positiveTransaction}
        />
      );

      const currencyElement = container.querySelector('[class*="currency--negative"]');
      expect(currencyElement).not.toBeInTheDocument();
    });

    it('should not apply negative class for zero amount', () => {
      const zeroTransaction: TransactionRecord = {
        ...mockTransaction,
        amount: 0,
      };

      const { container } = render(
        <RecordRow
          columnStyles={mockColumnStyles}
          transactionRecord={zeroTransaction}
        />
      );

      const currencyElement = container.querySelector('[class*="currency--negative"]');
      expect(currencyElement).not.toBeInTheDocument();
    });

    it('should render negative amount correctly', () => {
      const negativeTransaction: TransactionRecord = {
        ...mockTransaction,
        amount: -7500,
      };

      render(
        <RecordRow
          columnStyles={mockColumnStyles}
          transactionRecord={negativeTransaction}
        />
      );

      expect(screen.getByText('-75.00')).toBeInTheDocument();
    });
  });

  describe('Column Styles', () => {
    it('should apply custom column styles', () => {
      const customColumnStyles = {
        amount: 'custom-amount-style',
        date: 'custom-date-style',
        payee: 'custom-payee-style',
        memo: 'custom-memo-style',
      };

      const { container } = render(
        <RecordRow
          columnStyles={customColumnStyles}
          transactionRecord={mockTransaction}
        />
      );

      expect(container.querySelector('.custom-amount-style')).toBeInTheDocument();
      expect(container.querySelector('.custom-date-style')).toBeInTheDocument();
      expect(container.querySelector('.custom-payee-style')).toBeInTheDocument();
      expect(container.querySelector('.custom-memo-style')).toBeInTheDocument();
    });
  });

  describe('Different Transaction Values', () => {
    it('should render large positive amount', () => {
      const largeTransaction: TransactionRecord = {
        ...mockTransaction,
        amount: 1000000,
      };

      render(
        <RecordRow
          columnStyles={mockColumnStyles}
          transactionRecord={largeTransaction}
        />
      );

      expect(screen.getByText('10 000.00')).toBeInTheDocument();
    });

    it('should render small positive amount', () => {
      const smallTransaction: TransactionRecord = {
        ...mockTransaction,
        amount: 1,
      };

      render(
        <RecordRow
          columnStyles={mockColumnStyles}
          transactionRecord={smallTransaction}
        />
      );

      expect(screen.getByText('0.01')).toBeInTheDocument();
    });

    it('should render transaction with special characters in payee', () => {
      const specialCharTransaction: TransactionRecord = {
        ...mockTransaction,
        payee: 'Store & Co.',
      };

      render(
        <RecordRow
          columnStyles={mockColumnStyles}
          transactionRecord={specialCharTransaction}
        />
      );

      expect(screen.getByText('Store & Co.')).toBeInTheDocument();
    });

    it('should render transaction with long memo', () => {
      const longMemoTransaction: TransactionRecord = {
        ...mockTransaction,
        memo: 'This is a very long memo that describes a transaction in great detail',
      };

      render(
        <RecordRow
          columnStyles={mockColumnStyles}
          transactionRecord={longMemoTransaction}
        />
      );

      expect(screen.getByText('This is a very long memo that describes a transaction in great detail')).toBeInTheDocument();
    });
  });

  describe('Memoization', () => {
    it('should not re-render when props do not change', () => {
      const { rerender } = render(
        <RecordRow
          columnStyles={mockColumnStyles}
          transactionRecord={mockTransaction}
        />
      );

      const firstRender = screen.getByText('Test Store');

      rerender(
        <RecordRow
          columnStyles={mockColumnStyles}
          transactionRecord={mockTransaction}
        />
      );

      const secondRender = screen.getByText('Test Store');

      expect(firstRender).toBe(secondRender);
    });

    it('should re-render when transaction changes', () => {
      const { rerender } = render(
        <RecordRow
          columnStyles={mockColumnStyles}
          transactionRecord={mockTransaction}
        />
      );

      expect(screen.getByText('Test Store')).toBeInTheDocument();

      const newTransaction: TransactionRecord = {
        ...mockTransaction,
        payee: 'New Store',
      };

      rerender(
        <RecordRow
          columnStyles={mockColumnStyles}
          transactionRecord={newTransaction}
        />
      );

      expect(screen.getByText('New Store')).toBeInTheDocument();
      expect(screen.queryByText('Test Store')).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle transaction with undefined memo gracefully', () => {
      const transactionNoMemo: TransactionRecord = {
        ...mockTransaction,
        memo: undefined as any,
      };

      render(
        <RecordRow
          columnStyles={mockColumnStyles}
          transactionRecord={transactionNoMemo}
        />
      );

      expect(screen.getByText('Test Store')).toBeInTheDocument();
    });

    it('should handle very old timestamp', () => {
      const oldTransaction: TransactionRecord = {
        ...mockTransaction,
        timestamp: 0,
      };

      render(
        <RecordRow
          columnStyles={mockColumnStyles}
          transactionRecord={oldTransaction}
        />
      );

      expect(screen.getByText(/1970/)).toBeInTheDocument();
    });

    it('should handle future timestamp', () => {
      const futureTransaction: TransactionRecord = {
        ...mockTransaction,
        timestamp: 2000000000000,
      };

      render(
        <RecordRow
          columnStyles={mockColumnStyles}
          transactionRecord={futureTransaction}
        />
      );

      expect(screen.getByText('Test Store')).toBeInTheDocument();
    });
  });
});
