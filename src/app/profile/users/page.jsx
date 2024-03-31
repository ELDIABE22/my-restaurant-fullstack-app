/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { ChevronDownIcon } from "@/components/icons/ChevronDownIcon";
import { SearchIcon } from "@/components/icons/SearchIcon";
import { VerticalDotsIcon } from "@/components/icons/VerticalDotsIcon";
import { capitalize } from "@/utils/capitalize";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
  Chip,
  Pagination,
  Spinner,
  Input,
  Link,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { useCallback, useEffect, useMemo, useState } from "react";

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const { data: session, status } = useSession();

  const router = useRouter();

  // Definición de las columnas de encabezado de la tabla, especificando la clave y la etiqueta para cada columna.
  const headerColumns = [
    {
      key: "name",
      label: "NOMBRE",
    },
    {
      key: "email",
      label: "CORREO",
    },
    {
      key: "role",
      label: "ROL",
    },
    {
      key: "actions",
      label: "ACCIONES",
    },
  ];

  // Opciones de estado disponibles para el filtro, representando roles de usuario.
  const statusOptions = [
    { name: "Admin", uid: true },
    { name: "Usuario", uid: false },
  ];

  // Determina si hay un filtro de búsqueda activo, basado en si el valor del filtro es verdadero (no vacío).
  const hasSearchFilter = Boolean(filterValue);

  // Número de filas por página para la paginación.
  const rowsPerPage = 10;

  // Filtra la lista de usuarios según el filtro de búsqueda y estado, memorizando el resultado para optimizar el rendimiento.
  const filteredItems = useMemo(() => {
    let filteredUsers = [...users];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.nombreCompleto.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredUsers = filteredUsers.filter((user) => {
        let filterAdmin;

        if (user.admin) {
          filterAdmin = "true";
        } else {
          filterAdmin = "false";
        }

        return Array.from(statusFilter).includes(filterAdmin);
      });
    }

    return filteredUsers;
  }, [users, hasSearchFilter, statusFilter, statusOptions.length, filterValue]);

  // Calcula el número total de páginas basado en la cantidad de elementos filtrados y el número de filas por página.
  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  // useEffect para consultar los usuarios
  useEffect(() => {
    fetch("/api/profile/users").then((res) => {
      res.json().then((data) => {
        setUsers(data);
        setLoading(false);
      });
    });
  }, []);

  // useMemo para calcular y memorizar el subconjunto de usuarios que se mostrarán en la página actual.
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
  const renderCell = useCallback((user, columnKey) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case "name":
        return (
          <p className="text-bold text-small capitalize">
            {user.nombreCompleto}
          </p>
        );
      case "email":
        return (
          <p className="text-bold text-tiny capitalize text-default-400">
            {user.correo}
          </p>
        );
      case "role":
        return (
          <Chip
            className="capitalize"
            color={user.admin ? "warning" : "primary"}
            size="sm"
            variant="flat"
          >
            {user.admin ? "Admin" : "Usuario"}
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
                <DropdownItem textValue="Editar">
                  <Link
                    color="warning"
                    href={
                      session?.user._id === user._id
                        ? "/profile"
                        : `/profile/users/update/${user._id}`
                    }
                    className="w-full"
                  >
                    Editar
                  </Link>
                </DropdownItem>
                <DropdownItem textValue="Eliminar">Eliminar</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  // useMemo para renderizar el contenido superior de la tabla, incluyendo un campo de búsqueda y un menú desplegable para filtrar por rol.
  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by name..."
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
                  ROL
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
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </div>
    );
  }, [filterValue, onClear, onSearchChange, statusFilter, statusOptions]);

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

  if (session?.user.admin === false) {
    return router.push("/");
  }

  return (
    <>
      {loading && status === "loading" ? (
        <Spinner
          label="Cargando usuarios..."
          color="warning"
          className="flex justify-center"
        />
      ) : (
        <Table
          aria-label="tabla de usuarios"
          className="mx-auto w-[70%]"
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
              <TableRow
                key={item._id}
                emptyContent={"No hay cuentas registradas."}
              >
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </>
  );
};

export default UserPage;
