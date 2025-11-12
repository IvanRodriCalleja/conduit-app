import { useSelector } from "react-redux";
import { useCallback, useEffect } from "react";
import {
  selectTransactions,
  selectTransactionsError,
  selectTransactionsLoading,
  selectTransactionsIsReloading,
  selectPaginatedTransactions,
  selectCurrentPage,
  selectTotalPages,
  getTransactionsThunk,
  refreshTransactionsThunk,
  nextPage,
  previousPage,
  goToPageWithTransaction,
} from "store/transactionsSlice";
import {
  addTransactionThunk,
  selectNewlyAddedId,
} from "store/addTransactionSlice";
import { useConduitDispatch } from "store/useConduitDispatch";
import { AddTransactionPayload } from "services/addTransaction";

export const useTransactions = (refreshInterval: number = 0) => {
  const allTransactions = useSelector(selectTransactions);
  const currentPage = useSelector(selectCurrentPage);
  const totalPages = useSelector(selectTotalPages);
  const paginatedTransactions = useSelector(selectPaginatedTransactions);
  const dispatch = useConduitDispatch();

  const load = useCallback(() => {
    dispatch(getTransactionsThunk());
  }, [dispatch]);

  const refresh = useCallback(() => {
    dispatch(refreshTransactionsThunk());
  }, [dispatch]);

  const handleNextPage = useCallback(() => {
    dispatch(nextPage());
  }, [dispatch]);

  const handlePreviousPage = useCallback(() => {
    dispatch(previousPage());
  }, [dispatch]);

  const goToTransactionPage = useCallback((transactionId: string) => {
    dispatch(goToPageWithTransaction(transactionId));
  }, [dispatch]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (refreshInterval > 0) {
      const intervalId = setInterval(() => {
        refresh();
      }, refreshInterval);

      return () => clearInterval(intervalId);
    }
  }, [refresh, refreshInterval]);

  return {
    transactions: paginatedTransactions,
    allTransactions,
    currentPage,
    totalPages,
    onNextPage: handleNextPage,
    onPreviousPage: handlePreviousPage,
    goToTransactionPage,
    load,
    refresh,
  };
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

