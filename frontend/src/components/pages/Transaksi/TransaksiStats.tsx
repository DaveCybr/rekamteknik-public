// src/pages/TransaksiList/components/TransaksiStats.tsx
import React from "react";
import Lucide from "../../../base-components/Lucide";
import Tippy from "../../../base-components/Tippy";
import { TransaksiStats as Stats } from "../../../types/transaksi.types";
import { formatCurrency } from "../../../services/transaksi.service";

interface StatCardProps {
  icon: string;
  iconColor: string;
  bgColor: string;
  title: string;
  value: string | number;
  tooltip: string;
  badge?: {
    icon: string;
    text: string;
    color: string;
  };
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  iconColor,
  bgColor,
  title,
  value,
  tooltip,
  badge,
}) => (
  <div className="relative">
    <div
      className={`p-4 ${bgColor} rounded-lg shadow-md transition-all hover:shadow-lg hover:-translate-y-1`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg bg-white bg-opacity-30`}>
          <Lucide icon={icon} className={`w-6 h-6 ${iconColor}`} />
        </div>
        {badge && (
          <Tippy content={badge.text}>
            <div className={`${badge.color} rounded-full text-white p-1.5`}>
              <Lucide icon={badge.icon} className="w-3 h-3" />
            </div>
          </Tippy>
        )}
      </div>
      <div className="space-y-1">
        <div className="text-2xl font-bold text-slate-800 truncate">
          {value}
        </div>
        <div className="text-xs font-medium text-slate-700 uppercase tracking-wide">
          {title}
        </div>
      </div>
    </div>
  </div>
);

interface TransaksiStatsProps {
  stats: Stats | null;
  isLoading?: boolean;
}

export const TransaksiStatsComponent: React.FC<TransaksiStatsProps> = ({
  stats,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6 mt-5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-32 bg-slate-200 rounded-md animate-pulse" />
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mt-5">
      <StatCard
        icon="ShoppingCart"
        iconColor="text-blue-800"
        bgColor="bg-blue-300"
        title="Total Transaksi"
        value={`${stats.transaksi} Data`}
        tooltip="Total semua transaksi"
        badge={{
          icon: "TrendingUp",
          text: "Aktif",
          color: "bg-blue-500",
        }}
      />

      <StatCard
        icon="CheckCircle"
        iconColor="text-green-800"
        bgColor="bg-green-300"
        title="Transaksi Selesai"
        value={`${stats.transaksi_selesai} Data`}
        tooltip="Transaksi yang sudah lunas"
        badge={{
          icon: "Check",
          text: "Selesai",
          color: "bg-green-500",
        }}
      />

      <StatCard
        icon="Clock"
        iconColor="text-yellow-800"
        bgColor="bg-yellow-300"
        title="Belum Dibayar"
        value={`${stats.transaksi_belum_dibayar} Data`}
        tooltip="Transaksi yang belum lunas"
        badge={{
          icon: "AlertCircle",
          text: "Pending",
          color: "bg-yellow-500",
        }}
      />

      <StatCard
        icon="DollarSign"
        iconColor="text-emerald-800"
        bgColor="bg-emerald-300"
        title="Total Omset"
        value={formatCurrency(stats.omset)}
        tooltip="Total pendapatan"
        badge={{
          icon: "TrendingUp",
          text: "Revenue",
          color: "bg-emerald-500",
        }}
      />

      <StatCard
        icon="AlertTriangle"
        iconColor="text-red-800"
        bgColor="bg-red-300"
        title="Total Piutang"
        value={formatCurrency(stats.piutang)}
        tooltip="Total tagihan yang belum dibayar"
        badge={{
          icon: "AlertCircle",
          text: "Piutang",
          color: "bg-red-500",
        }}
      />
    </div>
  );
};

export default TransaksiStatsComponent;
