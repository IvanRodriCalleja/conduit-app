import { useSelector } from "react-redux";
import { useCallback } from "react";
import {
  selectTransactions,
  selectTransactionsError,
  selectTransactionsLoading,
  selectTransactionsIsReloading,
  getTransactionsThunk,
} from "store/transactionsSlice";
import {
  addTransactionThunk,
  selectNewlyAddedId,
} from "store/addTransactionSlice";
import { useConduitDispatch } from "store/useConduitDispatch";
import { AddTransactionPayload } from "services/addTransaction";

export const useTransactions = () => {
  const transactions = useSelector(selectTransactions);
  const dispatch = useConduitDispatch();

  const load = useCallback(() => {
    dispatch(getTransactionsThunk());
  }, [dispatch]);

  return { transactions, load };
};

export const useTransactionsLoading = () => {
  const loading = useSelector(selectTransactionsLoading);
  return loading;
};

export const useTransactionsIsReloading = () => {
  const isReloading = useSelector(selectTransactionsIsReloading);
  return isReloading;
};

export const useTransactionsError = () => {
  const error = useSelector(selectTransactionsError);
  const dispatch = useConduitDispatch();

  const retry = useCallback(() => {
    dispatch(getTransactionsThunk());
  }, [dispatch]);

  return { error, retry };
};

export const useAddTransaction = () => {
  const dispatch = useConduitDispatch();

  const addTransaction = useCallback(async (payload: AddTransactionPayload) => {
    const result = await dispatch(addTransactionThunk(payload));
    return result.payload;
  }, [dispatch]);

  return { addTransaction };
};

export const useNewlyAddedTransactionId = () => {
  const newlyAddedId = useSelector(selectNewlyAddedId);
  return newlyAddedId;
};