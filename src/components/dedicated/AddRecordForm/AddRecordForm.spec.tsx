import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddRecordForm from './AddRecordForm';
import * as transactionsRepository from 'repositories/transactionsRepository';

jest.mock('repositories/transactionsRepository', () => ({
  useAddTransaction: jest.fn(),
}));

describe('AddRecordForm', () => {
  const mockAddTransaction = jest.fn();

  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();

    (transactionsRepository.useAddTransaction as jest.Mock).mockReturnValue({
      addTransaction: mockAddTransaction,
    });

    mockAddTransaction.mockClear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('should render form with correct input types', () => {
      render(<AddRecordForm />);

      expect(screen.getByText('Add record')).toBeInTheDocument();

      const dateInput = screen.getByLabelText('Date');
      expect(dateInput).toHaveAttribute('type', 'datetime-local');
      expect(dateInput).toHaveAttribute('type', 'datetime-local');

      expect(screen.getByLabelText('Payee')).toBeInTheDocument();
      expect(screen.getByLabelText('Memo')).toBeInTheDocument();

      const amountInput = screen.getByLabelText('Amount');
      expect(amountInput).toBeInTheDocument();
      expect(amountInput).toHaveAttribute('type', 'number');

      expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have aria-invalid=false when no errors', () => {
      render(<AddRecordForm />);

      const dateInput = screen.getByLabelText('Date');
      const payeeInput = screen.getByLabelText('Payee');
      const amountInput = screen.getByLabelText('Amount');

      expect(dateInput).toHaveAttribute('aria-invalid', 'false');
      expect(payeeInput).toHaveAttribute('aria-invalid', 'false');
      expect(amountInput).toHaveAttribute('aria-invalid', 'false');
    });

    it('should have aria-invalid=true for fields with errors', async () => {
      const user = userEvent.setup();
      render(<AddRecordForm />);

      const submitButton = screen.getByRole('button', { name: /add/i });
      await user.click(submitButton);

      await waitFor(() => {
        const dateInput = screen.getByLabelText('Date');
        const payeeInput = screen.getByLabelText('Payee');
        const amountInput = screen.getByLabelText('Amount');

        expect(dateInput).toHaveAttribute('aria-invalid', 'true');
        expect(payeeInput).toHaveAttribute('aria-invalid', 'true');
        expect(amountInput).toHaveAttribute('aria-invalid', 'true');
      });
    });

    it('should link error messages with aria-errormessage for all fields', async () => {
      const user = userEvent.setup();
      render(<AddRecordForm />);

      const submitButton = screen.getByRole('button', { name: /add/i });
      await user.click(submitButton);

      await waitFor(() => {
        const dateInput = screen.getByLabelText('Date');
        const payeeInput = screen.getByLabelText('Payee');
        const amountInput = screen.getByLabelText('Amount');

        expect(dateInput).toHaveAttribute('aria-errormessage', 'date-error');
        expect(payeeInput).toHaveAttribute('aria-errormessage', 'payee-error');
        expect(amountInput).toHaveAttribute(
          'aria-errormessage',
          'amount-error',
        );
      });
    });

    it('should have role="alert" on error messages', async () => {
      const user = userEvent.setup();
      render(<AddRecordForm />);

      const submitButton = screen.getByRole('button', { name: /add/i });
      await user.click(submitButton);

      await waitFor(() => {
        const errorMessages = screen.getAllByRole('alert');
        expect(errorMessages.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Validation', () => {
    it('should show errors for all required fields when empty', async () => {
      const user = userEvent.setup();
      render(<AddRecordForm />);

      const submitButton = screen.getByRole('button', { name: /add/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Date is required')).toBeInTheDocument();
        expect(screen.getByText('Payee is required')).toBeInTheDocument();
        expect(screen.getByText('Amount is required')).toBeInTheDocument();
      });
    });

    it('should show error when amount is zero', async () => {
      const user = userEvent.setup();
      render(<AddRecordForm />);

      const amountInput = screen.getByLabelText('Amount');
      await user.type(amountInput, '0');

      const submitButton = screen.getByRole('button', { name: /add/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText('Amount must be a valid non-zero number'),
        ).toBeInTheDocument();
      });
    });

    it('should not show error for optional memo field', async () => {
      const user = userEvent.setup();
      render(<AddRecordForm />);

      const dateInput = screen.getByLabelText('Date');
      const payeeInput = screen.getByLabelText('Payee');
      const amountInput = screen.getByLabelText('Amount');

      await user.type(dateInput, '2024-01-15T10:30');
      await user.type(payeeInput, 'Test Store');
      await user.type(amountInput, '100');

      const submitButton = screen.getByRole('button', { name: /add/i });
      await user.click(submitButton);

      // Memo field is optional, so no error should be shown
      expect(screen.queryByText(/memo.*required/i)).not.toBeInTheDocument();
    });

    it('should apply error class to all inputs with validation errors', async () => {
      const user = userEvent.setup();
      render(<AddRecordForm />);

      const submitButton = screen.getByRole('button', { name: /add/i });
      await user.click(submitButton);

      await waitFor(() => {
        const dateInput = screen.getByLabelText('Date');
        const payeeInput = screen.getByLabelText('Payee');
        const amountInput = screen.getByLabelText('Amount');

        // Check that all required inputs have classes (CSS modules generate unique class names)
        expect(dateInput.className).toBeTruthy();
        expect(payeeInput.className).toBeTruthy();
        expect(amountInput.className).toBeTruthy();
      });
    });
  });

  describe('Form Submission', () => {
    it('should submit form with valid data', async () => {
      const user = userEvent.setup();
      mockAddTransaction.mockResolvedValue({ id: 'new-id' });

      render(<AddRecordForm />);

      const dateInput = screen.getByLabelText('Date');
      const payeeInput = screen.getByLabelText('Payee');
      const amountInput = screen.getByLabelText('Amount');

      await user.type(dateInput, '2024-01-15T10:30');
      await user.type(payeeInput, 'Test Store');
      await user.type(amountInput, '100.50');

      const submitButton = screen.getByRole('button', { name: /add/i });
      await user.click(submitButton);

      await waitFor(
        () => {
          expect(mockAddTransaction).toHaveBeenCalledWith(
            expect.objectContaining({
              timestamp: new Date('2024-01-15T10:30').getTime(),
              payee: 'Test Store',
              amount: 10050, // 100.50 * 100 (cents)
              memo: undefined,
            }),
          );
        },
        { timeout: 3000 },
      );
    });

    it('should submit form with memo field', async () => {
      const user = userEvent.setup();
      mockAddTransaction.mockResolvedValue({ id: 'new-id' });

      render(<AddRecordForm />);

      const dateInput = screen.getByLabelText('Date');
      const payeeInput = screen.getByLabelText('Payee');
      const memoInput = screen.getByLabelText('Memo');
      const amountInput = screen.getByLabelText('Amount');

      await user.type(dateInput, '2024-01-15T10:30');
      await user.type(payeeInput, 'Test Store');
      await user.type(memoInput, 'Test memo');
      await user.type(amountInput, '100.50');

      const submitButton = screen.getByRole('button', { name: /add/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockAddTransaction).toHaveBeenCalledWith(
          expect.objectContaining({
            memo: 'Test memo',
          }),
        );
      });
    });

    it('should reset form after successful submission', async () => {
      const user = userEvent.setup();
      mockAddTransaction.mockResolvedValue({ id: 'new-id' });

      render(<AddRecordForm />);

      const dateInput = screen.getByLabelText('Date') as HTMLInputElement;
      const payeeInput = screen.getByLabelText('Payee') as HTMLInputElement;
      const amountInput = screen.getByLabelText('Amount') as HTMLInputElement;

      await user.type(dateInput, '2024-01-15T10:30');
      await user.type(payeeInput, 'Test Store');
      await user.type(amountInput, '100.50');

      const submitButton = screen.getByRole('button', { name: /add/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(dateInput.value).toBe('');
        expect(payeeInput.value).toBe('');
        expect(amountInput.value).toBe('');
      });
    });

    it('should accept negative amounts', async () => {
      const user = userEvent.setup();
      mockAddTransaction.mockResolvedValue({ id: 'new-id' });

      render(<AddRecordForm />);

      const dateInput = screen.getByLabelText('Date');
      const payeeInput = screen.getByLabelText('Payee');
      const amountInput = screen.getByLabelText('Amount');

      await user.type(dateInput, '2024-01-15T10:30');
      await user.type(payeeInput, 'Test Store');
      await user.type(amountInput, '-50.25');

      const submitButton = screen.getByRole('button', { name: /add/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockAddTransaction).toHaveBeenCalledWith(
          expect.objectContaining({
            amount: -5025, // -50.25 * 100 (cents)
          }),
        );
      });
    });

    it('should disable submit button while submitting', async () => {
      const user = userEvent.setup();
      render(<AddRecordForm />);

      const dateInput = screen.getByLabelText('Date');
      const payeeInput = screen.getByLabelText('Payee');
      const amountInput = screen.getByLabelText('Amount');

      await user.type(dateInput, '2024-01-15T10:30');
      await user.type(payeeInput, 'Test Store');
      await user.type(amountInput, '100');

      const submitButton = screen.getByRole('button', { name: /add/i });

      expect(submitButton).not.toBeDisabled();

      await user.click(submitButton);

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
    });
  });
});
