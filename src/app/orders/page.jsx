"use client";

import CardOrder from "@/components/CardOrder";
import { ChevronDownIcon } from "@/components/icons/ChevronDownIcon";
import { capitalize } from "@/utils/capitalize";
import {
  Button,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Pagination,
  Spinner,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const OrderPage = () => {
  const { data: session, status } = useSession();

  const [orders, setOrders] = useState([]);
  const [loadingOrderData, setLoadingOrderData] = useState(true);

  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState(["Pendiente", "En camino"]);

  const router = useRouter();

  // Opciones de estado disponibles para el filtro, representando el estado del pedido.
  const statusOptions = [
    { name: "Pendiente", uid: "Pendiente" },
    { name: "En camino", uid: "En camino" },
    { name: "Entregado", uid: "Entregado" },
  ];

  // Número de filas por página para la paginación.
  const rowsPerPage = 10;

  // Filtra la lista de usuarios según el filtro de búsqueda y estado, memorizando el resultado para optimizar el rendimiento.
  const filteredItems = useMemo(() => {
    let filteredUsers = [...orders];

    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredUsers = filteredUsers.filter((or) =>
        Array.from(statusFilter).includes(or.status)
      );
    }

    return filteredUsers;
  }, [orders, statusFilter, statusOptions.length]);

  // Calcula el número total de páginas basado en la cantidad de elementos filtrados y el número de filas por página.
  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  // useMemo para calcular y memorizar el subconjunto de usuarios que se mostrarán en la página actual.
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [filteredItems, page, rowsPerPage]);

  // Función para consultar las ordenes del usuario registrado
  async function getOrders() {
    try {
      const res = await axios.get("/api/order");
      const { data } = res;
      const orderData = data.filter(
        (order) => order.user === session?.user._id && order.paid === true
      );
      setOrders(orderData);
      setLoadingOrderData(false);
    } catch (error) {
      console.log(error.message);
    }
  }

  // useEffect para ejecutar getOrders()
  useEffect(() => {
    if (status === "authenticated") {
      getOrders();
    } else if (status === "unauthenticated") {
      return router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, status]);

  return (
    <section className="container mx-auto m-5 md:px-3">
      {loadingOrderData ? (
        <Spinner
          label="Cargando pedidos..."
          color="warning"
          className="flex justify-center"
        />
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex gap-3 justify-end">
            <Dropdown>
              <DropdownTrigger className="flex">
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
          <Divider />
          <div className="flex gap-5 flex-wrap justify-center">
            {items.length > 0 ? (
              items.map((or) => <CardOrder key={or._id} order={or} />)
            ) : (
              <p className="font-semibold text-lg">No tienes pedidos...</p>
            )}
          </div>
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
        </div>
      )}
    </section>
  );
};

export default OrderPage;
