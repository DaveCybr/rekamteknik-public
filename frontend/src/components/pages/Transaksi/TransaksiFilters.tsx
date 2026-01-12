// src/pages/TransaksiList/components/TransaksiFilters.tsx
import React from "react";
import Button from "../../../base-components/Button";
import {
  FormInput,
  FormLabel,
  FormSelect,
} from "../../../base-components/Form";
import { TransaksiFilters } from "../../../types/transaksi.types";

interface TransaksiFiltersProps {
  filters: TransaksiFilters;
  onFilterChange: (filters: TransaksiFilters) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
}

const MONTHS = [
  { value: 1, label: "Januari" },
  { value: 2, label: "Februari" },
  { value: 3, label: "Maret" },
  { value: 4, label: "April" },
  { value: 5, label: "Mei" },
  { value: 6, label: "Juni" },
  { value: 7, label: "Juli" },
  { value: 8, label: "Agustus" },
  { value: 9, label: "September" },
  { value: 10, label: "Oktober" },
  { value: 11, label: "November" },
  { value: 12, label: "Desember" },
];

const STATUS_OPTIONS = [
  { value: "", label: "Semua Status" },
  { value: "Selesai", label: "Selesai" },
  { value: "Diinput", label: "Belum Lunas" },
];

export const TransaksiFiltersComponent: React.FC<TransaksiFiltersProps> = ({
  filters,
  onFilterChange,
  onApplyFilters,
  onResetFilters,
}) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  const handleChange = (field: keyof TransaksiFilters, value: string) => {
    onFilterChange({ ...filters, [field]: value });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
      <h3 className="text-base sm:text-lg font-semibold mb-4 text-slate-700">
        Filter Transaksi
      </h3>

      {/* Filter by Month & Year */}
      <div className="mb-6">
        <h4 className="text-xs sm:text-sm font-medium mb-3 text-slate-600">
          Filter Berdasarkan Periode
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div>
            <FormLabel htmlFor="filter-month">Bulan</FormLabel>
            <FormSelect
              id="filter-month"
              value={filters.bulan}
              onChange={(e) => handleChange("bulan", e.target.value)}
              className="w-full"
            >
              <option value="">Pilih Bulan</option>
              {MONTHS.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </FormSelect>
          </div>

          <div>
            <FormLabel htmlFor="filter-year">Tahun</FormLabel>
            <FormSelect
              id="filter-year"
              value={filters.tahun}
              onChange={(e) => handleChange("tahun", e.target.value)}
              className="w-full"
            >
              <option value="">Pilih Tahun</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </FormSelect>
          </div>

          <div>
            <FormLabel htmlFor="filter-status-1">Status</FormLabel>
            <FormSelect
              id="filter-status-1"
              value={filters.status_transaksi}
              onChange={(e) =>
                handleChange("status_transaksi", e.target.value as any)
              }
              className="w-full"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </FormSelect>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-200 my-6"></div>

      {/* Filter by Date Range */}
      <div>
        <h4 className="text-xs sm:text-sm font-medium mb-3 text-slate-600">
          Filter Berdasarkan Rentang Tanggal
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div>
            <FormLabel htmlFor="filter-date-from">Dari Tanggal</FormLabel>
            <FormInput
              id="filter-date-from"
              type="date"
              value={filters.tanggal_1}
              onChange={(e) => handleChange("tanggal_1", e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <FormLabel htmlFor="filter-date-to">Hingga Tanggal</FormLabel>
            <FormInput
              id="filter-date-to"
              type="date"
              value={filters.tanggal_2}
              onChange={(e) => handleChange("tanggal_2", e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <FormLabel htmlFor="filter-status-2">Status</FormLabel>
            <FormSelect
              id="filter-status-2"
              value={filters.status_transaksi}
              onChange={(e) =>
                handleChange("status_transaksi", e.target.value as any)
              }
              className="w-full"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </FormSelect>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-6">
        <Button
          variant="primary"
          onClick={onApplyFilters}
          className="w-full sm:w-auto"
        >
          Terapkan Filter
        </Button>
        <Button
          variant="outline-secondary"
          onClick={onResetFilters}
          className="w-full sm:w-auto"
        >
          Reset Filter
        </Button>
      </div>
    </div>
  );
};
