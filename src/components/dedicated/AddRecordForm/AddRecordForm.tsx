import React, { FC } from 'react';
import cx from 'classnames';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { columnStyles } from 'components/dedicated/TransactionsTable/TransactionsTable';
import Button from 'components/core/Button/Button';
import { useAddTransaction } from 'repositories/transactionsRepository';

import styles from './AddRecordForm.module.scss';

const transactionSchema = z.object({
  date: z
    .string()
    .min(1, 'Date is required')
    .refine(
      (val) => {
        const date = new Date(val);
        return !isNaN(date.getTime());
      },
      { message: 'Invalid date format' },
    ),
  payee: z.string().min(1, 'Payee is required'),
  amount: z
    .string()
    .min(1, 'Amount is required')
    .refine(
      (val) => {
        const num = parseFloat(val);
        return !isNaN(num) && num !== 0;
      },
      { message: 'Amount must be a valid non-zero number' },
    ),
  memo: z.string().optional(),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

const AddRecordForm: FC = () => {
  const { addTransaction } = useAddTransaction();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      date: '',
      payee: '',
      amount: '',
      memo: '',
    },
  });

  const onSubmit = async (data: TransactionFormData) => {
    try {
      const timestamp = new Date(data.date).getTime();
      const amount = parseFloat(data.amount) * 100; // Convert to cents

      await addTransaction({
        amount,
        payee: data.payee,
        timestamp,
        memo: data.memo || undefined,
      });

      reset();
    } catch (error) {
      console.error('Failed to add transaction:', error);
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.header}>Add record</div>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.fields}>
          <div className={cx(styles.column, columnStyles.date)}>
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <>
                  <label htmlFor="date-input">Date</label>
                  <input
                    {...field}
                    id="date-input"
                    type="datetime-local"
                    placeholder="Date and Time"
                    className={cx({ [styles.hasError]: !!errors.date })}
                    aria-invalid={!!errors.date}
                    aria-errormessage={errors.date ? 'date-error' : undefined}
                  />
                  {errors.date && (
                    <span id="date-error" className={styles.errorMessage} role="alert">
                      {errors.date.message}
                    </span>
                  )}
                </>
              )}
            />
          </div>
          <div className={cx(styles.column, columnStyles.payee)}>
            <Controller
              name="payee"
              control={control}
              render={({ field }) => (
                <>
                  <label htmlFor="payee-input">Payee</label>
                  <input
                    {...field}
                    id="payee-input"
                    placeholder="Payee"
                    className={cx({ [styles.hasError]: !!errors.payee })}
                    aria-invalid={!!errors.payee}
                    aria-errormessage={errors.payee ? 'payee-error' : undefined}
                  />
                  {errors.payee && (
                    <span id="payee-error" className={styles.errorMessage} role="alert">
                      {errors.payee.message}
                    </span>
                  )}
                </>
              )}
            />
          </div>
          <div className={cx(styles.column, columnStyles.memo)}>
            <Controller
              name="memo"
              control={control}
              render={({ field }) => (
                <>
                  <label htmlFor="memo-input">Memo</label>
                  <input
                    {...field}
                    id="memo-input"
                    placeholder="Memo (optional)"
                    className={cx({ [styles.hasError]: !!errors.memo })}
                    aria-invalid={!!errors.memo}
                    aria-errormessage={errors.memo ? 'memo-error' : undefined}
                  />
                  {errors.memo && (
                    <span id="memo-error" className={styles.errorMessage} role="alert">
                      {errors.memo.message}
                    </span>
                  )}
                </>
              )}
            />
          </div>
          <div
            className={cx(
              styles.column,
              styles['column--amount'],
              columnStyles.amount,
            )}
          >
            <Controller
              name="amount"
              control={control}
              render={({ field }) => (
                <>
                  <label htmlFor="amount-input">Amount</label>
                  <input
                    {...field}
                    id="amount-input"
                    placeholder="Amount"
                    type="number"
                    step="0.01"
                    className={cx({ [styles.hasError]: !!errors.amount })}
                    aria-invalid={!!errors.amount}
                    aria-errormessage={errors.amount ? 'amount-error' : undefined}
                  />
                  {errors.amount && (
                    <span id="amount-error" className={styles.errorMessage} role="alert">
                      {errors.amount.message}
                    </span>
                  )}
                </>
              )}
            />
          </div>
        </div>
        <div>
        <Button
          className={styles.buttonAdd}
          label="Add"
          padding="normal"
          width="auto"
          type="submit"
          isDisabled={isSubmitting}
        />
        </div>
      </form>
    </div>
  );
};

export default AddRecordForm;
