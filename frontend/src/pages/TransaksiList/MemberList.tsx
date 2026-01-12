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

interface Kartumember {
  setFormData: any;
  formData: any;
}

export default function MemberList({ setFormData, formData }: Kartumember) {
  const [openModal, setOpenModal] = React.useState(false);
  const [member, setmember] = React.useState<any>([]);
  const [meta, setMeta] = React.useState<any>({});
  const [activePage, setActivePage] = React.useState(1);
  const [search, setSearch] = React.useState("");
  const [isMutating, setIsMutating] = React.useState(false);

  const handlePageChange = (page: number) => {
    setActivePage(page);
  };

  const { authToken } = useAuth();
  const fetchmember = async () => {
    setIsMutating(true);
    try {
      const response = await axios.get(`${Api}/api/getMember`, {
        params: { search, page: activePage },
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setmember(response.data.data);
      setMeta(response.data);
      setIsMutating(false);
    } catch (error) {
      console.log(error);
      setIsMutating(false);
    }
  };

  React.useEffect(() => {
    setIsMutating(true);
    fetchmember();
  }, [activePage]);

  React.useEffect(() => {
    fetchmember();
  }, [search]);

  return (
    <>
      <Button
        variant="secondary"
        onClick={() => {
          setOpenModal(true);
          fetchmember();
        }}
        className="mr-2 w-full font-bold"
      >
        PILIH MEMBER
      </Button>
      <Dialog
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setSearch("");
        }}
        size="xl"
        className="w-96"
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
              <h2 className="mr-auto text-base font-semibold">Pilih Member</h2>
              <div>
                <MemberAdd getResponse={fetchmember} />
              </div>
            </div>
          </Dialog.Title>
          <Dialog.Description className="bg--100">
            <div className="bg-white p-3 rounded-lg shadow-sm border">
              <div className="flex w-full mt-4 sm:w-auto sm:mt-0">
                <div className="w-full sm:w-40">
                  <FormInput
                    type="text"
                    className=""
                    placeholder="Search..."
                    onChange={(e: any) => {
                      setSearch(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <Table className="border-spacing-y-[10px] border-separate w-full">
                  <Table.Thead className="">
                    <Table.Tr
                      className=" text-primary "
                      style={{
                        backgroundColor: "#f8fafc",
                        borderTop: "1px solid black",
                        borderBottom: "1px solid rgb(226 232 240 / 60%)",
                        color: "#64748b",
                      }}
                    >
                      <Table.Th className="whitespace-nowrap font-semibold">
                        ID MEMBER
                      </Table.Th>
                      <Table.Th className="whitespace-nowrap font-semibold">
                        NAMA PELANGGAN
                      </Table.Th>
                      <Table.Th className=" whitespace-nowrap font-semibold text-center">
                        NOMOR TELEPON
                      </Table.Th>
                      <Table.Th className="text- whitespace-nowrap font-semibold ">
                        ALAMAT
                      </Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  {!isMutating && member && member.length === 0 && (
                    <Table.Tbody>
                      <Table.Tr>
                        <Table.Td
                          colSpan={10}
                          className="text-center bg-white border-b-0 dark:bg-darkmode-600  shadow-sm  border-x-0 border"
                        >
                          No matching data found.
                        </Table.Td>
                      </Table.Tr>
                    </Table.Tbody>
                  )}
                  {/* {isMutating ? ( 
                  <div className="flex justify-center items-center h-[370px]">
                    <div className="loader -mr-[600px]"></div>
                  </div>
                ) : ( */}
                  <Table.Tbody>
                    {member?.map((faker: any, fakerKey: any) => (
                      <Table.Tr
                        key={fakerKey}
                        className="intro-x border cursor-pointer"
                        // data-tooltip-id="my-tooltip"
                        // data-tooltip-content="Rincian Penerimaan"
                        // data-tooltip-variant="info"
                        onDoubleClick={() => {
                          setFormData({
                            ...formData,
                            id_member: faker.id_member,
                            nama_pelanggan: faker.nama_member,
                            nomor_telepon: faker.nomor_telepon,
                            alamat: faker.alamat,
                          });
                          setOpenModal(false);
                        }}
                      >
                        <Table.Td className="first:rounded-l-md font-bold last:rounded-r-md w-40 !py-4 bg-white dark:bg-darkmode-600 shadow-sm border-r border-t border-b">
                          {faker.id_member}
                        </Table.Td>
                        <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white dark:bg-darkmode-600  shadow-sm  border-r border-t border-b">
                          {faker.nama_member}
                        </Table.Td>
                        <Table.Td className="first:rounded-l-md text-center last:rounded-r-md bg-white dark:bg-darkmode-600  shadow-sm  border-r border-t border-b">
                          {faker.nomor_telepon}
                        </Table.Td>
                        <Table.Td className="first:rounded-l-md text-clast:rounded-r-md bg-white dark:bg-darkmode-600  shadow-sm  border-r border-t border-b">
                          {faker.alamat}
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                  {/* )} */}
                </Table>
              </div>
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
