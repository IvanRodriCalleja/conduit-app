import { useSelector } from "react-redux";
import { useCallback } from "react";
import { selectTransactions, selectTransactionsError, selectTransactionsLoading, getTransactionsThunk } from "store/transactionsSlice";
import { useConduitDispatch } from "store/useConduitDispatch";

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

export const useTransactionsError = () => {
  const error = useSelector(selectTransactionsError);
  const dispatch = useConduitDispatch();

  const retry = useCallback(() => {
    dispatch(getTransactionsThunk());
  }, [dispatch]);

  return { error, retry };
};