// src/pages/TransaksiList/index.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormInput, FormSelect } from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";
import Table from "../../base-components/Table";
import Button from "../../base-components/Button";
import Tippy from "../../base-components/Tippy";
import Paginate from "../../base-components/Paginate";
import Loading from "../../base-components/Loading";
import { formatCurrency } from "../../services/transaksi.service";
import TransaksiAdd from "./AddTransaksi";
import TransaksiUpdate from "./EditTransaksi";
import DeleteTransaksi from "./DeleteTransaksi";
import Pembayaran from "./Pembayaran";
import Invoice from "./Invoice";
import { Transaksi, TransaksiFilters } from "../../types/transaksi.types";
import { useTransaksi } from "../../hooks/useTransaksi";
import TransaksiStatsComponent from "../../components/pages/Transaksi/TransaksiStats";
import { TransaksiFiltersComponent } from "../../components/pages/Transaksi/TransaksiFilters";
import { BulkActions } from "../../components/pages/Transaksi/BulkActions";

const INITIAL_FILTERS: TransaksiFilters = {
  bulan: "",
  tahun: "",
  tanggal_1: "",
  tanggal_2: "",
  status_transaksi: "",
};

function TransaksiList() {
  const navigate = useNavigate();

  // State management
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [filters, setFilters] = useState<TransaksiFilters>(INITIAL_FILTERS);
  const [selectedRows, setSelectedRows] = useState<Transaksi[]>([]);

  // Fetch data using custom hook
  const { transaksi, stats, meta, isLoading, refetch } = useTransaksi(
    page,
    search,
    limit,
    filters
  );

  // Handlers
  const handlePageChange = (pageNumber: number) => {
    setPage(pageNumber);
  };

  const handleApplyFilters = () => {
    setPage(1); // Reset to first page
    refetch();
  };

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
    setPage(1);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRows(transaksi);
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (row: Transaksi) => {
    setSelectedRows((prev) => {
      const exists = prev.find((r) => r.id_transaksi === row.id_transaksi);
      if (exists) {
        return prev.filter((r) => r.id_transaksi !== row.id_transaksi);
      }
      return [...prev, row];
    });
  };

  const getStatusColor = (status: string) => {
    return status === "Selesai"
      ? "bg-green-500 text-white"
      : "bg-blue-500 text-white";
  };

  const getRowBgColor = (status: string) => {
    return status === "Selesai" ? "bg-green-50" : "bg-blue-50";
  };

  return (
    <div className="py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-700">
          Data Transaksi
        </h2>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <Button
            variant="outline-primary"
            onClick={() => navigate("/master/member")}
            className="w-full sm:w-auto"
          >
            <Lucide icon="Users" className="w-4 h-4 mr-2" />
            Kelola Member
          </Button>
          <TransaksiAdd getResponse={refetch} />
        </div>
      </div>

      {/* Statistics Cards */}
      <TransaksiStatsComponent stats={stats} isLoading={isLoading} />

      {/* Filters */}
      <div className="mt-6">
        <TransaksiFiltersComponent
          filters={filters}
          onFilterChange={setFilters}
          onApplyFilters={handleApplyFilters}
          onResetFilters={handleResetFilters}
        />
      </div>

      {/* Bulk Actions */}
      <BulkActions
        selectedRows={selectedRows}
        onClearSelection={() => setSelectedRows([])}
        onRefresh={refetch}
      />

      {/* Table Controls */}
      <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 mb-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-3">
            {selectedRows.length > 0 && (
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-lg">
                <Lucide icon="CheckSquare" className="w-4 h-4 text-blue-600" />
                <span className="text-xs sm:text-sm font-medium text-blue-700">
                  {selectedRows.length} dipilih
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
            {meta && (
              <span className="text-xs sm:text-sm text-slate-500 text-center sm:text-left">
                {meta.from} - {meta.to} dari {meta.total}
              </span>
            )}
            <div className="relative w-full sm:w-56">
              <FormInput
                type="text"
                className="w-full pr-10 text-sm"
                placeholder="Cari transaksi..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Lucide
                icon="Search"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <Loading />
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <Table.Thead>
                <Table.Tr className="bg-primary">
                  <Table.Th className="text-white w-12 px-3 py-3">
                    <input
                      type="checkbox"
                      className="rounded border-white"
                      checked={
                        transaksi.length > 0 &&
                        selectedRows.length === transaksi.length
                      }
                      onChange={handleSelectAll}
                    />
                  </Table.Th>
                  <Table.Th className="text-white px-3 py-3 text-sm">
                    ID Invoice
                  </Table.Th>
                  <Table.Th className="text-white px-3 py-3 text-sm">
                    Pelanggan
                  </Table.Th>
                  <Table.Th className="text-white px-3 py-3 text-sm">
                    Referensi
                  </Table.Th>
                  <Table.Th className="text-white px-3 py-3 text-sm">
                    Nominal
                  </Table.Th>
                  <Table.Th className="text-white px-3 py-3 text-sm">
                    Dibayar
                  </Table.Th>
                  <Table.Th className="text-white px-3 py-3 text-sm">
                    Tanggal
                  </Table.Th>
                  <Table.Th className="text-white px-3 py-3 text-sm">
                    Status
                  </Table.Th>
                  <Table.Th className="text-white text-center px-3 py-3 text-sm">
                    Aksi
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {transaksi.length === 0 ? (
                  <Table.Tr>
                    <Table.Td colSpan={9} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Lucide
                          icon="Inbox"
                          className="w-12 h-12 text-slate-300"
                        />
                        <p className="text-slate-500">Tidak ada data</p>
                      </div>
                    </Table.Td>
                  </Table.Tr>
                ) : (
                  transaksi.map((row: any) => (
                    <Table.Tr
                      key={row.id_transaksi}
                      className={getRowBgColor(row.status_transaksi)}
                    >
                      <Table.Td className="px-3 py-3">
                        <input
                          type="checkbox"
                          className="rounded"
                          checked={selectedRows.some(
                            (r) => r.id_transaksi === row.id_transaksi
                          )}
                          onChange={() => handleSelectRow(row)}
                        />
                      </Table.Td>
                      <Table.Td className="px-3 py-3">
                        <Button
                          variant="soft-primary"
                          size="sm"
                          onClick={() =>
                            navigate(
                              `/transaksi/list-detail/${row.id_transaksi}`
                            )
                          }
                        >
                          <span className="text-xs">{row.id_transaksi}</span>
                        </Button>
                      </Table.Td>
                      <Table.Td className="px-3 py-3">
                        <div className="min-w-[150px]">
                          <p className="font-medium text-sm truncate">
                            {row.nama_pelanggan}
                          </p>
                          <p className="text-xs text-slate-500 truncate">
                            {row.nomor_telepon}
                          </p>
                          <p className="text-xs text-slate-500 truncate max-w-[200px]">
                            {row.alamat}
                          </p>
                        </div>
                      </Table.Td>
                      <Table.Td className="px-3 py-3">
                        <span className="text-sm">{row.ref || "-"}</span>
                      </Table.Td>
                      <Table.Td className="px-3 py-3">
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium whitespace-nowrap">
                          {formatCurrency(row.total_pembelian)}
                        </span>
                      </Table.Td>
                      <Table.Td className="px-3 py-3">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
                            row.status_transaksi === "Selesai"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {formatCurrency(row.total_pembayaran)}
                        </span>
                      </Table.Td>
                      <Table.Td className="px-3 py-3">
                        <span className="text-sm whitespace-nowrap">
                          {row.tanggal_transaksi}
                        </span>
                      </Table.Td>
                      <Table.Td className="px-3 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(
                            row.status_transaksi
                          )}`}
                        >
                          {row.status_transaksi}
                        </span>
                      </Table.Td>
                      <Table.Td className="px-3 py-3">
                        <div className="flex gap-1 justify-center flex-wrap min-w-[120px]">
                          <TransaksiUpdate data={row} getResponse={refetch} />
                          <DeleteTransaksi
                            id={Number(row.id_transaksi)}
                            getResponse={refetch}
                          />
                          <Invoice data={row} />
                          {row.status_transaksi !== "Selesai" && (
                            <Pembayaran data={row} getResponse={refetch} />
                          )}
                          {row.lokasi && (
                            <Tippy content="Lihat Lokasi">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => window.open(row.lokasi)}
                              >
                                <Lucide icon="MapPin" className="w-4 h-4" />
                              </Button>
                            </Tippy>
                          )}
                        </div>
                      </Table.Td>
                    </Table.Tr>
                  ))
                )}
              </Table.Tbody>
            </Table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {meta && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 mt-4 px-2">
          <div className="w-full sm:w-auto">
            <Paginate meta={meta} onPageChange={handlePageChange} />
          </div>
          <div className="flex items-center gap-2 justify-center sm:justify-end w-full sm:w-auto">
            <span className="text-xs sm:text-sm text-slate-600">Tampilkan</span>
            <FormSelect
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="w-16 sm:w-20 text-sm"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </FormSelect>
            <span className="text-xs sm:text-sm text-slate-600">
              per halaman
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default TransaksiList;
