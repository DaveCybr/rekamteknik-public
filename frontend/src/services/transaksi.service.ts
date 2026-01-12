// src/services/transaksi.service.ts
import axios from "axios";
import Api from "../../api";
import {
  Transaksi,
  TransaksiFormData,
  TransaksiFilters,
  KeranjangItem,
  KeranjangUnit,
  KeranjangJasa,
} from "../types/transaksi.types";

const API_BASE = `${Api}/api`;

export class TransaksiService {
  // Get all transaksi with filters
  static async getAll(
    params: {
      page: number;
      search: string;
      limit: number;
      filters: TransaksiFilters;
    },
    token: string
  ) {
    const { page, search, limit, filters } = params;
    const response = await axios.get(`${API_BASE}/transaksi`, {
      params: {
        page,
        search,
        limit,
        bulan: filters.bulan,
        tahun: filters.tahun,
        tanggal_1: filters.tanggal_1,
        tanggal_2: filters.tanggal_2,
        status_transaksi: filters.status_transaksi,
      },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }

  // Get transaksi by ID
  static async getById(id: string) {
    const response = await axios.get(`${API_BASE}/transaksiById/${id}`);
    return response.data;
  }

  // Create new transaksi
  static async create(
    data: {
      formData: TransaksiFormData;
      id_transaksi: string;
      id_servis: string;
      keranjang: KeranjangItem[];
      keranjang_unit: KeranjangUnit[];
      keranjang_js: KeranjangJasa[];
    },
    token: string
  ) {
    const response = await axios.post(`${API_BASE}/transaksi`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }

  // Update transaksi
  static async update(
    id: string,
    data: Partial<TransaksiFormData>,
    token: string
  ) {
    const response = await axios.post(
      `${API_BASE}/transaksi/${id}/update`,
      data,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }

  // Delete transaksi
  static async delete(id: number, token: string) {
    const response = await axios.delete(`${API_BASE}/transaksi/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }

  // Add payment
  static async addPayment(
    id: string,
    data: {
      nominal: number;
      tanggal_bayar: string;
      keterangan: string;
      catatan: string;
    },
    token: string
  ) {
    const response = await axios.post(
      `${API_BASE}/transaksi/bayar/${id}`,
      data,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }

  // Get detail transaksi
  static async getDetail(
    id: string,
    params: {
      page: number;
      search: string;
      limit: number;
    }
  ) {
    const response = await axios.get(`${API_BASE}/transaksi/detail/${id}`, {
      params,
    });
    return response.data;
  }

  // Add detail transaksi
  static async addDetail(
    data: {
      id_transaksi: string;
      keranjang: KeranjangItem[];
    },
    token: string
  ) {
    const response = await axios.post(`${API_BASE}/transaksi/detail`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }

  // Update detail transaksi
  static async updateDetail(id: number, data: any, token: string) {
    const response = await axios.post(
      `${API_BASE}/transaksi/detail/${id}/update`,
      data,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }

  // Delete detail transaksi
  static async deleteDetail(id: number, detail: any, token: string) {
    const response = await axios.post(
      `${API_BASE}/transaksi/detail-delete/${id}`,
      { detail },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }

  // Get ready products
  static async getReadyProducts() {
    const response = await axios.get(`${API_BASE}/ready-barang`);
    return response.data.data;
  }

  // Get members
  static async getMembers(
    params: { search: string; page: number },
    token: string
  ) {
    const response = await axios.get(`${API_BASE}/getMember`, {
      params,
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }

  // Get karyawan
  static async getKaryawan() {
    const response = await axios.get(`${API_BASE}/karyawan`);
    return response.data.data;
  }

  // Get transaksi for print
  static async getPrintData(id: string) {
    const response = await axios.get(`${API_BASE}/transaksiPrint/${id}`);
    return response.data;
  }
}

// Helper functions
export const generateInvoiceId = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const length = 6;
  let id = "INV";

  for (let i = 0; i < length; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }

  return `${id}.${new Date().getFullYear()}`;
};

export const generateServisId = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const length = 6;
  let id = "SRV";

  for (let i = 0; i < length; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }

  return `${id}.${new Date().getFullYear()}`;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

export const parseCurrencyInput = (value: string): number => {
  const numericValue = parseFloat(value.replace(/[^\d]/g, ""));
  return isNaN(numericValue) ? 0 : numericValue;
};
