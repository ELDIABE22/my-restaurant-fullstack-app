import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Tabs,
  Tab,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownItem,
  DropdownMenu,
} from "@nextui-org/react";
import toast from "react-hot-toast";
import axios from "axios";
import { VerticalDotsIcon } from "./icons/VerticalDotsIcon";

const CardOrder = ({ order, getOrders }) => {
  let disabledKeys = [];

  let color;

  if (order.estado === "Pendiente") {
    disabledKeys = ["enCamino", "entregado"];
    color = "warning";
  } else if (order.estado === "En camino") {
    disabledKeys = ["pendiente", "entregado"];
    color = "primary";
  } else if (order.estado === "Entregado") {
    disabledKeys = ["pendiente", "enCamino"];
    color = "success";
  }

  // Convertir la fecha createdAt en un objeto de fecha
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

  // Función para cancelar pedido
  const handleUpdate = async (id) => {
    try {
      const promise = new Promise(async (resolve, reject) => {
        const res = await axios.put("/api/order", { id });

        const { message } = res.data;

        if (message === "Pedido cancelado") {
          resolve(message);
          getOrders();
        } else {
          reject(new Error(message));
        }
      });

      await toast.promise(promise, {
        loading: "Cancelando pedido...",
        success: (message) => message,
        error: (err) => err.message,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card className="min-w-[300px]">
      <CardHeader>
        <div className="relative flex flex-col w-full">
          <div className="flex justify-between">
            <div className="flex">
              <p className="font-bold text-inherit text-black">DIABE</p>
              <p className="font-bold text-inherit text-orange-peel">
                DELICIAS
              </p>
            </div>
            <div>
              <span className="text-xs text-default-500">{formattedDate}</span>
            </div>
            {order.estado !== "Entregado" && (
              <div className="absolute right-0">
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      aria-label="Icono de opciones de acciones"
                    >
                      <VerticalDotsIcon className="text-black" />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Opciones de acciones">
                    <DropdownItem
                      textValue="Eliminar"
                      color="danger"
                      onPress={() => handleUpdate(order.id)}
                    >
                      Cancelar
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            )}
          </div>
          <p className="text-md">
            ID Pedido:{" "}
            <span className="text-small text-default-500">{order.id}</span>
          </p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <div className="flex flex-col justify-center gap-2">
          <div className="flex flex-col gap-1">
            <div>
              {order.platos.length > 0 &&
                order.platos.map((pro) => (
                  <div key={pro.id} className="flex justify-between">
                    <p className="font-bold text-lg">{pro.nombre}</p>
                    <p className="font-bold">{pro.cantidad}U</p>
                  </div>
                ))}
            </div>
            <Divider />
            <div className="flex flex-col gap-1">
              <div>
                <p className="text-center font-semibold">
                  Detalles de la orden
                </p>
              </div>
              <div>
                <p className="flex justify-between">
                  Método de entrega:{" "}
                  <span className="text-small text-default-500">
                    {order.metodo_entrega}
                  </span>
                </p>
                {order.metodo_entrega === "Restaurante" && (
                  <p className="flex justify-between">
                    Número de mesa:{" "}
                    <span className="text-small text-default-500">
                      {order.numero_mesa}
                    </span>
                  </p>
                )}
                {order.metodo_entrega === "Domicilio" && (
                  <p className="flex justify-between">
                    Dirección:{" "}
                    <span className="text-small text-default-500">
                      {order.direccion_envio}
                    </span>
                  </p>
                )}
                {order.metodo_entrega === "Domicilio" && (
                  <p className="flex justify-between">
                    Barrio:{" "}
                    <span className="text-small text-default-500">
                      {order.ciudad_envio}
                    </span>
                  </p>
                )}
                <p className="flex justify-between">
                  Metodo de pago:
                  <span className="text-small text-default-500">
                    {order.metodo_pago}
                  </span>
                </p>
              </div>
            </div>
            <Divider />
            <div className="flex flex-col gap-1">
              <div>
                <p className="text-center font-semibold">Estado del pedido</p>
              </div>
              <div className="w-full">
                <Tabs
                  key="pendiente"
                  variant="bordered"
                  aria-label="Estado"
                  color={color}
                  fullWidth={true}
                  disabledKeys={disabledKeys}
                >
                  <Tab key="pendiente" title="Pendiente" />
                  {order.metodo_entrega === "Domicilio" && (
                    <Tab key="enCamino" title="En camino" />
                  )}
                  <Tab key="entregado" title="Entregado" />
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
      <Divider />
      <CardFooter className="flex justify-between">
        <p className="font-medium text-xl">Total:</p>
        <span className="font-medium text-xl">
          {parseInt(order.total).toLocaleString("es-CO", {
            style: "currency",
            currency: "COP",
          })}
        </span>
      </CardFooter>
    </Card>
  );
};

export default CardOrder;
