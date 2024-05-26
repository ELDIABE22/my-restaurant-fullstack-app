/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { SearchIcon } from "@/components/icons/SearchIcon";
import { capitalize } from "@/utils/capitalize";
import { ChevronDownIcon } from "@/components/icons/ChevronDownIcon";
import { VerticalDotsIcon } from "@/components/icons/VerticalDotsIcon";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";

import axios from "axios";
import toast from "react-hot-toast";
import ModalOrderDetails from "@/components/ModalOrderDetails";
import ModalUpdateOrderStatus from "@/components/ModalUpdateOrderStatus";
import ModalConfirmOrderDetails from "@/components/ModalConfirmOrderDetails";

const ProfileOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState(["Pendiente", "En camino"]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const { onOpenChange } = useDisclosure();

  const { data: session, status } = useSession();

  // Estado para guardar datos del ModalOrderDetails
  const [selectedOrder, setSelectedOrder] = useState(null);
  // Estado para guardar el id a eliminar
  const [idDelete, setIdDelete] = useState(null);

  // Estado para abrir y cerrar modalOrderDatails
  const [openModal, setOpenModal] = useState(false);
  // Estado para abrir y cerrar modalConfirmOrderDatails
  const [openModalConfirmDelete, setOpenModalConfirmDelete] = useState(false);
  // Estado para abrir y cerrar ModañlUpdateOrderStatus
  const [openModalUpdateOrderStatus, setOpenModalUpdateOrderStatus] =
    useState(false);

  const router = useRouter();

  // Función para consultar los pedidos
  const getOrderAndUsers = async () => {
    try {
      const res = await axios.get("/api/profile/orders");
      const { data } = res;

      const orders = [];
      const ordersMap = new Map();

      data.forEach((row) => {
        if (!ordersMap.has(row.ordenId)) {
          const order = {
            id: row.ordenId,
            usuarioId: row.usuarioId,
            usuarioNombre: row.usuarioNombre,
            metodo_pago: row.metodo_pago,
            metodo_entrega: row.metodo_entrega,
            direccion_envio: row.direccion_envio,
            ciudad_envio: row.ciudad_envio,
            detalles_adicionales: row.detalles_adicionales,
            numero_mesa: row.numero_mesa,
            total: row.total,
            pagado: row.pagado,
            estado: row.estado,
            fecha_creado: row.fecha_creado,
            fecha_actualizado: row.fecha_actualizado,
            platos: [],
          };
          orders.push(order);
          ordersMap.set(row.ordenId, order);
        }

        const order = ordersMap.get(row.ordenId);

        if (row.ordenPlatoId) {
          let plato = order.platos.find((p) => p.id === row.ordenPlatoId);
          if (!plato) {
            plato = {
              id: row.ordenPlatoId,
              nombre: row.platoNombre,
              cantidad: row.platoCantidad,
              adicionales: [],
            };
            order.platos.push(plato);
          }

          if (row.adicionalId) {
            plato.adicionales.push({
              id: row.adicionalId,
              nombre: row.adicionalNombre,
              cantidad: row.adicionalCantidad,
            });
          }
        }
      });

      setOrders(orders);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener pedidos y usuarios:", error);
    }
  };

  // Función para abrir ModalOrderDatails
  const handleOpenModal = (order) => {
    setOpenModal(true);
    setSelectedOrder(order);
  };

  // Función para abir ModalConfirmOrderDetails
  const handleOpenModalConfirmDelete = (idDelete) => {
    setOpenModalConfirmDelete(true);
    setIdDelete(idDelete);
  };

  // Función para abir ModalUpdateOrderStatus
  const handleOpenModalUpdateOrderStatus = (order) => {
    setOpenModalUpdateOrderStatus(true);
    setSelectedOrder(order);
  };

  // Función para cancelar pedido
  const handleDelete = async (idDelete) => {
    try {
      const promise = new Promise(async (resolve, reject) => {
        const res = await axios.put("/api/order", { idDelete });

        const { message } = res.data;

        if (message === "Pedido cancelado") {
          resolve(message);
          getOrderAndUsers();
        } else {
          reject(new Error(message));
        }

        setIdDelete(null);
      });

      await toast.promise(promise, {
        loading: "Cancelando...",
        success: (message) => message,
        error: (err) => err.message,
      });
      setOpenModalConfirmDelete(false);
    } catch (error) {
      console.error("Error al cancelar el pedido: ", error);
      setOpenModalConfirmDelete(false);
    }
  };

  // Función para actualizar estado del pedido
  const handleUpdate = async (idUpdate, status, deliveryMethod) => {
    try {
      const promise = new Promise(async (resolve, reject) => {
        const updateData = {
          id: idUpdate,
          status: status,
          deliveryMethod: deliveryMethod,
        };

        const res = await axios.put("/api/profile/orders", updateData);

        const { message } = res.data;

        if (message === "Estado del pedido actualizado") {
          resolve();
          getOrderAndUsers();
        } else {
          reject();
        }

        setSelectedOrder(null);
      });

      await toast.promise(promise, {
        loading: "Cambiando estado...",
        success: "Estado del pedido actualizado",
        error: "Error al cambiar el estado!",
      });

      setOpenModalUpdateOrderStatus(false);
    } catch (error) {
      console.log(error);
      setOpenModalUpdateOrderStatus(false);
    }
  };

  // useEffect para ejecutar getOrderAndUsers()
  useEffect(() => {
    const fetchOrders = () => {
      getOrderAndUsers();
    };

    fetchOrders();

    const intervalId = setInterval(fetchOrders, 5000);

    return () => clearInterval(intervalId);
  }, []);

  // Definición de las columnas de encabezado de la tabla, especificando la clave y la etiqueta para cada columna.
  const headerColumns = [
    {
      key: "idPedido",
      label: "ID Pedido",
    },
    {
      key: "name",
      label: "Nombre",
    },
    {
      key: "date",
      label: "Fecha",
    },
    {
      key: "status",
      label: "Estado",
    },
    {
      key: "actions",
      label: "ACCIONES",
    },
  ];

  // Opciones de estado disponibles para el filtro, representando el estado del pedido.
  const statusOptions = [
    { name: "Pendiente", uid: "Pendiente" },
    { name: "En camino", uid: "En camino" },
    { name: "Entregado", uid: "Entregado" },
  ];

  // Determina si hay un filtro de búsqueda activo, basado en si el valor del filtro es verdadero (no vacío).
  const hasSearchFilter = Boolean(filterValue);

  // Número de filas por página para la paginación.
  const rowsPerPage = 10;

  // Filtra la lista de pedidos según el filtro de búsqueda y estado, memorizando el resultado para optimizar el rendimiento.
  const filteredItems = useMemo(() => {
    let filteredUsers = [...orders];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((or) =>
        or.usuarioNombre.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredUsers = filteredUsers.filter((or) =>
        Array.from(statusFilter).includes(or.estado)
      );
    }

    return filteredUsers;
  }, [
    orders,
    hasSearchFilter,
    statusFilter,
    statusOptions.length,
    filterValue,
  ]);

  // Calcula el número total de páginas basado en la cantidad de elementos filtrados y el número de filas por página.
  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  // useMemo para calcular y memorizar el subconjunto de pedidos que se mostrarán en la página actual.
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  // useCallback para manejar el cambio en el valor de búsqueda, actualizando el valor del filtro y reiniciando la página a  1 si hay un valor de búsqueda.
  const onSearchChange = useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  // useCallback para limpiar el valor del filtro y reiniciar la página a  1.
  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  // useCallback para renderizar celdas de la tabla basado en la clave de columna, aplicando estilos y componentes específicos.
  const renderCell = useCallback((order, columnKey) => {
    const cellValue = order[columnKey];

    switch (columnKey) {
      case "idPedido":
        return (
          <p className="text-bold text-tiny capitalize text-default-400">
            {order.id}
          </p>
        );
      case "name":
        return (
          <p className="text-bold text-tiny">{order.usuarioNombre || "?"}</p>
        );
      case "date":
        // Convertir la fecha fecha_creado en un objeto de fecha
        const createdAtDate = new Date(order.fecha_creado);

        // Función para formatear la fecha en el formato deseado
        const formattedDate = createdAtDate.toLocaleDateString("es-ES", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        });

        return (
          <p className="text-bold text-tiny capitalize text-default-400">
            {formattedDate}
          </p>
        );
      case "status":
        let color;

        // Condición para establecer el color del estado
        if (order.estado === "Pendiente") {
          color = "warning";
        } else if (order.estado === "En camino") {
          color = "primary";
        } else if (order.estado === "Entregado") {
          color = "success";
        }

        return (
          <Chip className="capitalize" color={color} size="sm" variant="flat">
            {order.estado}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  aria-label="Icono de opciones de acciones"
                >
                  <VerticalDotsIcon className="text-default-300" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Opciones de acciones">
                {order.estado !== "Entregado" && (
                  <DropdownItem
                    textValue="updateStatus"
                    color="success"
                    onPress={() => handleOpenModalUpdateOrderStatus(order)}
                  >
                    Cambiar Estado
                  </DropdownItem>
                )}
                <DropdownItem
                  textValue="updateStatus"
                  color="warning"
                  onPress={() => handleOpenModal(order)}
                >
                  Más detalles
                </DropdownItem>
                {order.estado !== "Entregado" && (
                  <DropdownItem
                    textValue="Cancelar"
                    color="danger"
                    onPress={() => handleOpenModalConfirmDelete(order.id)}
                  >
                    Cancelar
                  </DropdownItem>
                )}
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  // useMemo para renderizar el contenido superior de la tabla, incluyendo un campo de búsqueda y un menú desplegable para filtrar por estado.
  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Buscar por nombre..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  ESTADO
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Columnas de tabla"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => {
                  let color;
                  switch (status.name) {
                    case "Pendiente":
                      color = "warning";
                      break;
                    case "En camino":
                      color = "primary";
                      break;
                    case "Entregado":
                      color = "success";
                      break;
                  }

                  return (
                    <DropdownItem
                      key={status.uid}
                      color={color}
                      className="capitalize"
                    >
                      {capitalize(status.name)}
                    </DropdownItem>
                  );
                })}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </div>
    );
  }, [filterValue, onClear, onSearchChange, statusFilter, statusOptions]);

  // useMemo para renderizar la paginación en la parte inferior de la página, permitiendo al admin navegar entre páginas.
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

  useEffect(() => {
    if (status === "unauthenticated" && session?.user.admin === 0) {
      return router.push("/");
    } else if (status === "authenticated" && session?.user.admin === 0) {
      return router.push("/");
    }
  }, [session?.user.admin, status]);

  return (
    <>
      {loading ? (
        <Spinner
          label="Cargando pedidos..."
          color="warning"
          className="flex justify-center"
        />
      ) : (
        <Table
          aria-label="tabla de usuarios"
          className="mx-auto"
          topContent={topContent}
          bottomContent={bottomContent}
        >
          <TableHeader columns={headerColumns}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody items={items}>
            {(item) => (
              <TableRow key={item.id} emptyContent={"No hay pedidos."}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      <ModalOrderDetails
        isOpen={openModal}
        onOpenChange={onOpenChange}
        order={selectedOrder}
        setOpenModal={setOpenModal}
      />

      <ModalConfirmOrderDetails
        isOpen={openModalConfirmDelete}
        onOpenChange={onOpenChange}
        handleDelete={handleDelete}
        idDelete={idDelete}
        setOpenModalConfirmDelete={setOpenModalConfirmDelete}
      />

      <ModalUpdateOrderStatus
        isOpen={openModalUpdateOrderStatus}
        onOpenChange={onOpenChange}
        order={selectedOrder}
        handleUpdate={handleUpdate}
        setOpenModalUpdateOrderStatus={setOpenModalUpdateOrderStatus}
      />
    </>
  );
};

export default ProfileOrdersPage;
