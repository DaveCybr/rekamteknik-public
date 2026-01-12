// src/pages/TransaksiList/components/BulkActions.tsx
import React, { useState, useRef } from "react";
import Button from "../../../base-components/Button";
import Lucide from "../../../base-components/Lucide";
import Tippy from "../../../base-components/Tippy";
import { Dialog } from "../../../base-components/Headless";
import { Transaksi } from "../../../types/transaksi.types";
import { useReactToPrint } from "react-to-print";
import { formatCurrency } from "../../../services/transaksi.service";
import Api from "../../../../api";

interface BulkActionsProps {
  selectedRows: Transaksi[];
  onClearSelection: () => void;
  onRefresh: () => void;
}

export const BulkActions: React.FC<BulkActionsProps> = ({
  selectedRows,
  onClearSelection,
  onRefresh,
}) => {
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [printData, setPrintData] = useState({
    nama_pelanggan: "",
    nomor_telepon: "",
    alamat: "",
  });

  if (selectedRows.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-3 mb-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
            {selectedRows.length}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700">
              {selectedRows.length} Transaksi Dipilih
            </p>
            <p className="text-xs text-slate-500">
              Total Nilai:{" "}
              {formatCurrency(
                selectedRows.reduce((sum, row) => sum + row.total_pembelian, 0)
              )}
            </p>
          </div>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <Tippy content="Print Invoice Gabungan">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowPrintDialog(true)}
              className="flex-1 sm:flex-none"
            >
              <Lucide icon="Printer" className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Print</span>
            </Button>
          </Tippy>

          <Tippy content="Export ke Excel">
            <Button
              variant="success"
              size="sm"
              onClick={() => {
                // Export functionality
                alert("Export to Excel - Coming soon!");
              }}
              className="flex-1 sm:flex-none"
            >
              <Lucide icon="FileSpreadsheet" className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </Tippy>

          <Tippy content="Hapus Semua">
            <Button
              variant="danger"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
              className="flex-1 sm:flex-none"
            >
              <Lucide icon="Trash2" className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Hapus</span>
            </Button>
          </Tippy>

          <Tippy content="Batal Pilih">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={onClearSelection}
              className="flex-1 sm:flex-none"
            >
              <Lucide icon="X" className="w-4 h-4" />
            </Button>
          </Tippy>
        </div>
      </div>

      {/* Print Dialog */}
      <PrintMultipleInvoices
        open={showPrintDialog}
        onClose={() => setShowPrintDialog(false)}
        selectedRows={selectedRows}
        printData={printData}
        setPrintData={setPrintData}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteMultipleDialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        selectedRows={selectedRows}
        onSuccess={() => {
          onClearSelection();
          onRefresh();
        }}
      />
    </div>
  );
};

// Print Multiple Invoices Dialog
interface PrintMultipleInvoicesProps {
  open: boolean;
  onClose: () => void;
  selectedRows: Transaksi[];
  printData: any;
  setPrintData: (data: any) => void;
}

const PrintMultipleInvoices: React.FC<PrintMultipleInvoicesProps> = ({
  open,
  onClose,
  selectedRows,
  printData,
  setPrintData,
}) => {
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const totalAmount = selectedRows.reduce((sum, row) => {
    // Parse jika row.total_pembelian adalah string
    const amount =
      typeof row.total_pembelian === "string"
        ? parseFloat((row.total_pembelian as string).replace(/[^\d]/g, ""))
        : row.total_pembelian;
    return sum + amount;
  }, 0);

  return (
    <Dialog open={open} onClose={onClose} size="lg">
      <Dialog.Panel>
        <Dialog.Title className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Print Invoice Gabungan</h3>
          <div className="flex gap-2">
            <Button variant="primary" size="sm" onClick={handlePrint}>
              <Lucide icon="Printer" className="w-4 h-4 mr-1" />
              Print
            </Button>
            <Button variant="outline-secondary" size="sm" onClick={onClose}>
              <Lucide icon="X" className="w-4 h-4" />
            </Button>
          </div>
        </Dialog.Title>

        <Dialog.Description>
          {/* Customer Info Form */}
          <div className="mb-4 p-4 bg-slate-50 rounded-lg">
            <h4 className="font-semibold mb-3">Informasi Pelanggan</h4>
            <div className="grid grid-cols-1 gap-3">
              <input
                type="text"
                placeholder="Nama Pelanggan"
                className="border rounded px-3 py-2"
                value={printData.nama_pelanggan}
                onChange={(e) =>
                  setPrintData({ ...printData, nama_pelanggan: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Nomor Telepon"
                className="border rounded px-3 py-2"
                value={printData.nomor_telepon}
                onChange={(e) =>
                  setPrintData({ ...printData, nomor_telepon: e.target.value })
                }
              />
              <textarea
                placeholder="Alamat"
                className="border rounded px-3 py-2"
                rows={2}
                value={printData.alamat}
                onChange={(e) =>
                  setPrintData({ ...printData, alamat: e.target.value })
                }
              />
            </div>
          </div>

          {/* Preview */}
          <div ref={componentRef} className="p-6 bg-white">
            <div className="border-b pb-4 mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <img
                    src={`${Api}/gambar/RAFA_ELEKTRONIC.png`}
                    alt="Logo"
                    className="h-16"
                  />
                </div>
                <div className="text-right">
                  <h2 className="text-2xl font-bold text-slate-700">INVOICE</h2>
                  <p className="text-sm text-slate-500">
                    Tanggal: {new Date().toLocaleDateString("id-ID")}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-6">
              <div>
                <h3 className="font-semibold mb-2">Kepada:</h3>
                <p>{printData.nama_pelanggan || "-"}</p>
                <p className="text-sm">{printData.nomor_telepon || "-"}</p>
                <p className="text-sm">{printData.alamat || "-"}</p>
              </div>
              <div className="text-right">
                <h3 className="font-semibold mb-2">Dari:</h3>
                <p className="font-semibold">Rafa Electronics</p>
                <p className="text-sm">082335704609</p>
                <p className="text-sm">
                  Jl. Raya PB Sudirman Tanggul Kulon No.15
                </p>
              </div>
            </div>

            <table className="w-full mb-6">
              <thead className="bg-slate-100">
                <tr>
                  <th className="text-left p-2 border">No</th>
                  <th className="text-left p-2 border">ID Invoice</th>
                  <th className="text-left p-2 border">Keterangan</th>
                  <th className="text-right p-2 border">Jumlah</th>
                </tr>
              </thead>
              <tbody>
                {selectedRows.map((row, index) => (
                  <tr key={row.id_transaksi}>
                    <td className="p-2 border">{index + 1}</td>
                    <td className="p-2 border">{row.id_transaksi}</td>
                    <td className="p-2 border">
                      {row.catatan || row.nama_pelanggan}
                    </td>
                    <td className="p-2 border text-right">
                      {formatCurrency(row.total_pembelian)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-100 font-bold">
                <tr>
                  <td colSpan={3} className="p-2 border text-right">
                    TOTAL:
                  </td>
                  <td className="p-2 border text-right">
                    {formatCurrency(totalAmount)}
                  </td>
                </tr>
              </tfoot>
            </table>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-2">Informasi Pembayaran:</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-slate-600">Bank:</p>
                  <p className="font-medium">MANDIRI</p>
                </div>
                <div>
                  <p className="text-slate-600">Rekening:</p>
                  <p className="font-medium">1430030501934</p>
                </div>
                <div>
                  <p className="text-slate-600">Atas Nama:</p>
                  <p className="font-medium">MUHAMMAD BAHRUL ULUM</p>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center text-sm text-slate-500">
              <p>Terima kasih atas kepercayaan Anda kepada Rafa Electronics</p>
            </div>
          </div>
        </Dialog.Description>
      </Dialog.Panel>
    </Dialog>
  );
};

// Delete Multiple Dialog
interface DeleteMultipleDialogProps {
  open: boolean;
  onClose: () => void;
  selectedRows: Transaksi[];
  onSuccess: () => void;
}

const DeleteMultipleDialog: React.FC<DeleteMultipleDialogProps> = ({
  open,
  onClose,
  selectedRows,
  onSuccess,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // Implement bulk delete API call
      // await TransaksiService.bulkDelete(selectedRows.map(r => r.id_transaksi));

      alert(`${selectedRows.length} transaksi akan dihapus`);
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <Dialog.Panel>
        <div className="p-6 text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Lucide icon="AlertTriangle" className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Konfirmasi Hapus</h3>
          <p className="text-slate-600 mb-4">
            Anda yakin ingin menghapus <strong>{selectedRows.length}</strong>{" "}
            transaksi yang dipilih?
          </p>
          <p className="text-sm text-red-600 mb-6">
            Tindakan ini tidak dapat dibatalkan!
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              variant="outline-secondary"
              onClick={onClose}
              disabled={isDeleting}
            >
              Batal
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Menghapus..." : "Ya, Hapus"}
            </Button>
          </div>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
};
