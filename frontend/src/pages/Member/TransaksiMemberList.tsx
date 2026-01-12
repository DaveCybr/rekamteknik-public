import React from "react";
import { Dialog } from "../../base-components/Headless";
import Table from "../../base-components/Table";
import Paginate from "../../base-components/Paginate";
import Button from "../../base-components/Button";
// import axios from "/axios";
import { set } from "lodash";
import Loading from "../../base-components/Loading";
import FormInput from "../../base-components/Form/FormInput";
import axios from "axios";
import Api from "../../../api";
import { useAuth } from "../../auth/authContext";
import MemberAdd from "../Member/AddMember";
import RupiahFormat from "../../base-components/RupiahFormat";
import Tippy from "../../base-components/Tippy";
import Lucide from "../../base-components/Lucide";
import TransaksiUpdate from "../TransaksiList/EditTransaksi";
import DeleteTransaksi from "../TransaksiList/DeleteTransaksi";
import Invoice from "../TransaksiList/Invoice";
import Pembayaran from "../TransaksiList/Pembayaran";

interface Kartumember {
  id_member: any;
}

export default function TransaksiMember({ id_member }: Kartumember) {
  const [openModal, setOpenModal] = React.useState(false);
  const [transaksi, setTransaksi] = React.useState<any>([]);
  const [limit, setLimit] = React.useState<number>(5);
  const [activePage, setActivePage] = React.useState<number>(1);
  const [meta, setMeta] = React.useState<any>({});
  const [response, setResponse] = React.useState<any>({});
  const [isMutating, setIsMutating] = React.useState(false);
  const [search, setSearch] = React.useState<any>();

  const handlePageChange = (page: number) => {
    setActivePage(page);
  };

  const { authToken } = useAuth();
  const getResponse = async () => {
    setIsMutating(true);
    try {
      const response = await axios.get(`${Api}/api/transaksiMember`, {
        params: { search, page: activePage, id_member: id_member },
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setResponse(response.data);
      setTransaksi(response.data.data);
      setMeta(response.data);
      setIsMutating(false);
    } catch (error) {
      console.log(error);
      setIsMutating(false);
    }
  };

  React.useEffect(() => {
    getResponse();
  }, [activePage, limit]);

  React.useEffect(() => {
    getResponse();
  }, [search]);

  return (
    <>
      <Tippy
        className="shadow-md text-center flex items-center justify-center mr-1"
        content="List Transaksi"
        as={Button}
        variant="outline-primary"
        onClick={() => {
          setOpenModal(true);
          getResponse();
        }}
      >
        <Lucide icon="ListOrdered" className="w-4 h-4 text-info" />
      </Tippy>
      <Dialog
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setSearch("");
        }}
        size="xxl"
      >
        <style>
          {`
            .loader {
              width: 45px;
              aspect-ratio: 1;
              --c: no-repeat linear-gradient(#000 0 0);
              background: 
                var(--c) 0%   50%,
                var(--c) 50%  50%,
                var(--c) 100% 50%;
              background-size: 20% 100%;
              animation: l1 1s infinite linear;
            }
            @keyframes l1 {
              0%  {background-size: 20% 100%,20% 100%,20% 100%}
              33% {background-size: 20% 10% ,20% 100%,20% 100%}
              50% {background-size: 20% 100%,20% 10% ,20% 100%}
              66% {background-size: 20% 100%,20% 100%,20% 10% }
              100%{background-size: 20% 100%,20% 100%,20% 100%}
            }
              `}
        </style>
        <Dialog.Panel>
          <Dialog.Title>
            <div className="flex justify-between items-center w-full">
              <h2 className="mr-auto text-base font-semibold">
                LIST HISTORY TRANSAKSI
              </h2>
            </div>
          </Dialog.Title>
          <Dialog.Description className="bg--100">
            <div className="bg-white p-3 rounded-lg shadow-sm border">
              {/* <div className="flex w-full mt-4 sm:w-auto sm:mt-0 ">
                <div className="mx-3 disabled:bg-slate-100 disabled:cursor-not-allowed dark:disabled:bg-darkmode-800/50 dark:disabled:border-transparent [&amp;[readonly]]:bg-slate-100 [&amp;[readonly]]:cursor-not-allowed [&amp;[readonly]]:dark:bg-darkmode-800/50 [&amp;[readonly]]:dark:border-transparent transition duration-200 ease-in-out w-full text-sm border-slate-200 shadow-sm rounded-md placeholder:text-slate-400/90 focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus:border-primary focus:border-opacity-40 dark:bg-darkmode-800 dark:border-transparent dark:focus:ring-slate-700 dark:focus:ring-opacity-50 dark:placeholder:text-slate-500/80 mt-2 sm:w-40 2xl:w-full sm:mt-0">
                  <FormInput
                    type="text"
                    className=""
                    placeholder="Search..."
                    onChange={(e: any) => {
                      setSearch(e.target.value);
                    }}
                  />
                </div>
              </div> */}
              <Table
                hover
                className="border-spacing-y-[10px] border-separate max-h-"
              >
                <Table.Thead className="">
                  <Table.Tr className="rounded-full bg-primary dark:bg-darkmode-800">
                    <Table.Th className="border-b-0 text-white border-r text-start px-2  last:rounded-tl-md first:rounded-tl-md ">
                      ID INVOICE
                    </Table.Th>
                    <Table.Th className="border-b-0 text-white border-r py-2 px-2 ">
                      PELANGGAN
                    </Table.Th>
                    <Table.Th className="border-b-0 text-white border-r py-2 px-2 ">
                      REFERENCE
                    </Table.Th>
                    <Table.Th className="  border-r py-2 px-2 border-b-0 text-white ">
                      NOMINAL
                    </Table.Th>
                    <Table.Th className="  border-r py-2 px-2 border-b-0 text-white ">
                      DIBAYAR
                    </Table.Th>
                    <Table.Th className="  border-r py-2 px-2 border-b-0 text-white ">
                      TANGGAL
                    </Table.Th>
                    <Table.Th className="  border-r py-2 px-2 border-b-0 text-white ">
                      CATATAN
                    </Table.Th>
                    <Table.Th className="  border-r py-2 px-2 border-b-0 text-white ">
                      STATUS
                    </Table.Th>
                    <Table.Th className="text-center  border-b-0 text-white  last:rounded-tr-md">
                      ACTIONS
                    </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                {!isMutating && transaksi && transaksi.length === 0 && (
                  <Table.Tbody>
                    <Table.Tr>
                      <Table.Td
                        colSpan={8}
                        className="text-center rounded-md shadow-sm bg-white text-slate-500 dark:bg-darkmode-600 dark:text-slate-400"
                      >
                        No matching data found.
                      </Table.Td>
                    </Table.Tr>
                  </Table.Tbody>
                )}
                <Table.Tbody>
                  {transaksi?.map((rows: any, rowsKey: any) => (
                    <Table.Tr
                      key={rowsKey}
                      className={`intro-y py-0 px-0 first:rounded-bl-md ${
                        rows.status_transaksi === "Selesai"
                          ? "bg-green-100 dark:bg-green-900"
                          : "bg-blue-100 dark:bg-blue-900"
                      }`}
                    >
                      <Table.Td className="border-r-0 py-1 px-2 text-  border-gray-300 ">
                        <Button
                          className="!box"
                          variant="soft-success"
                          size="sm"
                        >
                          {rows.id_transaksi}
                        </Button>
                      </Table.Td>
                      <Table.Td className="border-r-0 py-1 px-2  border-gray-300">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            {rows.nama_member
                              ? rows.nama_member
                              : rows.nama_pelanggan}
                          </span>
                          <span className="text-xs text-slate-500">
                            {rows.alamat_member
                              ? rows.alamat_member
                              : rows.alamat}
                          </span>
                          <span className="text-xs text-slate-500">
                            {rows.nomor_telepon_member
                              ? rows.nomor_telepon_member
                              : rows.nomor_telepon}
                          </span>
                        </div>
                      </Table.Td>
                      <Table.Td className="border-r-0 py-1 px-2  border-gray-300">
                        {rows.ref}
                      </Table.Td>
                      <Table.Td className="border-r-0 py-1 px-2  border-gray-300">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium text-white bg-green-500`}
                        >
                          <RupiahFormat amount={rows.total_pembelian} />
                        </span>
                      </Table.Td>
                      <Table.Td className="border-r-0 py-1 px-2  border-gray-300">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium text-white ${
                            rows.status_transaksi === "Selesai"
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        >
                          <RupiahFormat amount={rows.total_pembayaran} />
                        </span>
                      </Table.Td>
                      <Table.Td className="border-r-0 py-1 px-2  border-gray-300">
                        {rows.tanggal_transaksi}
                      </Table.Td>
                      <Table.Td className="border-r-0 py-1 px-2  border-gray-300">
                        {rows.catatan}
                      </Table.Td>
                      <Table.Td className="border-r-0 py-1 px-2  border-gray-300">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium text-white ${
                            rows.status_transaksi === "Selesai"
                              ? "bg-green-500"
                              : "bg-blue-400"
                          }`}
                        >
                          {rows.status_transaksi}
                        </span>
                      </Table.Td>
                      <Table.Td className="border-r-0 py-1 px-2  border-gray-300">
                        <div className="grid grid-cols-3 gap-1">
                          <TransaksiUpdate
                            data={rows}
                            getResponse={() => getResponse()}
                          />
                          <DeleteTransaksi
                            id={rows.id_transaksi}
                            getResponse={() => getResponse()}
                          />
                          <Invoice data={rows} />
                          {/* {rows.id_member === null ? (
                            <MemberCreate
                              members={{
                                id_transaksi: rows.id_transaksi,
                                id_member: random(999, 100000),
                                nama_member: rows.nama_pelanggan,
                                alamat: rows.alamat,
                                nomor_telepon: rows.nomor_telepon,
                              }}
                              getResponse={() => getResponse()}
                            />
                          ) : null} */}
                          {rows.status_transaksi === "Selesai" ? null : (
                            <Pembayaran
                              data={rows}
                              getResponse={() => getResponse()}
                            />
                          )}
                          <Tippy
                            as={Button}
                            variant="outline-primary"
                            content="Lihat Lokasi"
                            className="shadow-md"
                            size="sm"
                            onClick={() => {
                              window.open(rows.lokasi);
                            }}
                          >
                            <Lucide
                              icon="MapPin"
                              className="w-4 h-4 text-primary"
                            />
                          </Tippy>
                          <Tippy
                            as={Button}
                            content="chat whatsapp"
                            className="shadow-md"
                            variant="outline-primary"
                            size="sm"
                            onClick={() => {
                              window.open(
                                `https://wa.me/${rows.nomor_telepon}`
                              );
                            }}
                          >
                            <Lucide
                              icon="MessageCircle"
                              className="w-4 h-4 text-"
                            />
                          </Tippy>
                        </div>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
                {/* )} */}
              </Table>
              <div className="flex flex-wrap items-center col-span-12 intro-y sm:flex-row sm:flex-nowrap my-2">
                <Paginate meta={meta} onPageChange={handlePageChange} />
              </div>
            </div>
          </Dialog.Description>
          <Dialog.Footer>
            <Button
              type="button"
              variant="outline-secondary"
              onClick={() => {
                setOpenModal(false);
                setSearch("");
              }}
              className="w-20 mr-1"
            >
              Tutup
            </Button>
          </Dialog.Footer>
        </Dialog.Panel>
      </Dialog>
    </>
  );
}
