// src/pages/TransaksiList/hooks/useTransaksi.ts
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../auth/authContext";
import { TransaksiService } from "../services/transaksi.service";
import {
  Transaksi,
  TransaksiFilters,
  PaginationMeta,
  TransaksiStats,
} from "../types/transaksi.types";

interface UseTransaksiReturn {
  transaksi: Transaksi[];
  stats: TransaksiStats | null;
  meta: PaginationMeta | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useTransaksi = (
  page: number = 1,
  search: string = "",
  limit: number = 10,
  filters: TransaksiFilters
): UseTransaksiReturn => {
  const { authToken } = useAuth();
  const [transaksi, setTransaksi] = useState<Transaksi[]>([]);
  const [stats, setStats] = useState<TransaksiStats | null>(null);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchTransaksi = useCallback(async () => {
    if (!authToken) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await TransaksiService.getAll(
        { page, search, limit, filters },
        authToken
      );

      setTransaksi(response.data.data);
      setMeta(response.data);
      setStats({
        transaksi: response.transaksi,
        transaksi_selesai: response.transaksi_selesai,
        transaksi_belum_dibayar: response.transaksi_belum_dibayar,
        omset: response.omset,
        piutang: response.piutang,
      });
    } catch (err) {
      setError(err as Error);
      console.error("Error fetching transaksi:", err);
    } finally {
      setIsLoading(false);
    }
  }, [authToken, page, search, limit, filters]);

  useEffect(() => {
    fetchTransaksi();
  }, [fetchTransaksi]);

  return {
    transaksi,
    stats,
    meta,
    isLoading,
    error,
    refetch: fetchTransaksi,
  };
};

// Hook untuk form transaksi
export const useTransaksiForm = () => {
  const { authToken } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createTransaksi = async (data: any) => {
    if (!authToken) throw new Error("No auth token");

    setIsSubmitting(true);
    try {
      await TransaksiService.create(data, authToken);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateTransaksi = async (id: string, data: any) => {
    if (!authToken) throw new Error("No auth token");

    setIsSubmitting(true);
    try {
      await TransaksiService.update(id, data, authToken);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteTransaksi = async (id: number) => {
    if (!authToken) throw new Error("No auth token");

    setIsSubmitting(true);
    try {
      await TransaksiService.delete(id, authToken);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addPayment = async (id: string, paymentData: any) => {
    if (!authToken) throw new Error("No auth token");

    setIsSubmitting(true);
    try {
      await TransaksiService.addPayment(id, paymentData, authToken);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    createTransaksi,
    updateTransaksi,
    deleteTransaksi,
    addPayment,
  };
};
