import {
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import { useCallback, useMemo, useState } from "react";
import ModalConfirmDeleteCoupon from "./ModalConfirmDeleteCoupon";
import axios from "axios";
import toast from "react-hot-toast";

const CouponsTable = ({ coupons, getCoupons }) => {
  const [page, setPage] = useState(1);
  const [idDelete, setIdDelete] = useState(null);

  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  // Definición de las columnas de encabezado de la tabla, especificando la clave y la etiqueta para cada columna.
  const headerColumns = [
    {
      key: "code",
      label: "CÓDIGO",
    },
    {
      key: "discount",
      label: "DESCUENTO",
    },
    {
      key: "expiration",
      label: "EXPIRACIÓN",
    },
    {
      key: "actions",
      label: "ACCIONES",
    },
  ];

  // Número de filas por página para la paginación.
  const rowsPerPage = 5;

  // Calcula el número total de páginas basado en la cantidad de elementos filtrados y el número de filas por página.
  const pages = Math.ceil(coupons.length / rowsPerPage);

  // Funcíon para eliminar cúpon
  async function handleDelete(id) {
    try {
      const promise = new Promise(async (resolve, reject) => {
        const res = await axios.delete(`/api/profile/coupon?id=${id}`);

        const { message } = res.data;

        if (message === "Cúpon eliminado") {
          resolve();
          getCoupons();
        } else {
          reject();
        }

        setIdDelete(null);
        onClose();
      });

      await toast.promise(promise, {
        loading: "Eliminando...",
        success: "Cúpon eliminado",
        error: "Error al eliminar el cúpon!",
      });
    } catch (error) {
      console.error("Error al eliminar el cúpon:", error);
    }
  }

  // useMemo para calcular y memorizar el subconjunto de usuarios que se mostrarán en la página actual.
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return coupons.slice(start, end);
  }, [coupons, page]);

  // useCallback para renderizar celdas de la tabla basado en la clave de columna, aplicando estilos y componentes específicos.
  const renderCell = useCallback(
    (coupon, columnKey) => {
      const cellValue = coupon[columnKey];

      switch (columnKey) {
        case "code":
          return (
            <p className="font-semibold text-small capitalize">
              {coupon.codigo}
            </p>
          );
        case "discount":
          return (
            <p className="font-semibold text-center capitalize text-green-500">
              {coupon.porcentaje_descuento} %
            </p>
          );
        case "expiration":
          return (
            <p
              className={
                new Date() > new Date(coupon.fecha_caducidad)
                  ? "text-bold text-small capitalize line-through text-gray-400"
                  : "text-bold text-small capitalize"
              }
            >
              {coupon.fecha_caducidad.split("T")[0]}
            </p>
          );
        case "actions":
          return (
            <div
              onClick={() => {
                onOpen();
                setIdDelete(coupon.id);
              }}
              className="text-red-500 font-semibold hover:cursor-pointer hover:text-red-700 hover:text-opacity-70"
            >
              Eliminar
            </div>
          );
        default:
          return cellValue;
      }
    },
    [onOpen]
  );

  // useMemo para renderizar la paginación en la parte inferior de la página, permitiendo al usuario navegar entre páginas.
  const bottomContent = useMemo(() => {
    return (
      <div className="flex w-full justify-center">
        <Pagination
          isCompact
          showControls
          showShadow
          color="warning"
          page={page}
          total={pages}
          onChange={(page) => setPage(page)}
        />
      </div>
    );
  }, [page, pages]);

  return (
    <>
      <Table
        aria-label="Example static collection table"
        className="max-w-[500px]"
        bottomContent={bottomContent}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={items}>
          {(item) => (
            <TableRow key={item.id} emptyContent={"No hay cupones."}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <ModalConfirmDeleteCoupon
        isOpen={isOpen}
        onClose={onClose}
        onOpenChange={onOpenChange}
        handleDelete={handleDelete}
        idDelete={idDelete}
      />
    </>
  );
};

export default CouponsTable;
