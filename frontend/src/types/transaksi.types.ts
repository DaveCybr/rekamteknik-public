// src/pages/TransaksiList/types/transaksi.types.ts

export interface Member {
  id_member: string;
  nama_member: string;
  alamat: string;
  nomor_telepon: string;
}

export interface Product {
  id_product: number;
  nama: string;
  harga: number;
  hpp: number;
  stok: number;
  kategori: string;
  satuan: string;
}

export interface Karyawan {
  id_karyawan: number;
  nama_karyawan: string;
  status_karyawan: string;
}

export interface KeranjangItem {
  id_product: number;
  nama_product: string;
  harga: number;
  hpp: number;
  qty: number;
  total: number;
}

export interface KeranjangUnit {
  id_detail_servis: string;
  id_karyawan: number;
  nama_karyawan: string;
  nama_unit: string;
  deskripsi_servis: string;
}

export interface KeranjangJasa {
  id_detail_servis: string;
  id_product: number;
  nama_product: string;
  kategori: string;
  harga: number;
  qty: number;
  total: number;
}

export interface TransaksiFormData {
  id_member: string | null;
  nama_pelanggan: string;
  nomor_telepon: string;
  alamat: string;
  ref: string;
  catatan: string;
  lokasi: string;
  tanggal_transaksi: string;
  total_pembelian: number;
  total_pembayaran: number;
  status_transaksi: string;
}

export interface Transaksi {
  id_transaksi: string;
  id_member?: string | null;
  nama_pelanggan: string;
  nomor_telepon: string;
  alamat: string;
  ref: string;
  catatan: string;
  lokasi: string;
  tanggal_transaksi: string;
  total_pembelian: number;
  total_pembayaran: number;
  status_transaksi: "Diinput" | "Selesai";
  created_at: string;
  updated_at: string;
}

export interface TransaksiFilters {
  bulan: string;
  tahun: string;
  tanggal_1: string;
  tanggal_2: string;
  status_transaksi: "" | "Selesai" | "Diinput";
}

export interface PaginationMeta {
  current_page: number;
  from: number;
  to: number;
  total: number;
  per_page: number;
  last_page: number;
}

export interface TransaksiStats {
  transaksi: number;
  transaksi_selesai: number;
  transaksi_belum_dibayar: number;
  omset: number;
  piutang: number;
}
