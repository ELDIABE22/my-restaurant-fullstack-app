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

const CardOrder = ({ order }) => {
  let disabledKeys = [];

  let color;

  if (order.status === "Pendiente") {
    disabledKeys = ["enCamino", "entregado"];
    color = "warning";
  } else if (order.status === "En camino") {
    disabledKeys = ["pendiente", "entregado"];
    color = "primary";
  } else if (order.status === "Entregado") {
    disabledKeys = ["pendiente", "enCamino"];
    color = "success";
  }

  // Convertir la fecha createdAt en un objeto de fecha
  const createdAtDate = new Date(order.createdAt);

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
  async function handleDelete(id) {
    try {
      const promise = new Promise(async (resolve, reject) => {
        const res = await axios.delete(`/api/order/${id}`);

        const { message } = res.data;

        if (message === "Pedido cancelado") {
          resolve(message);
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
  }

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
            {order.status !== "Entregado" && (
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
                      onPress={() => handleDelete(order._id)}
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
            <span className="text-small text-default-500">{order._id}</span>
          </p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <div className="flex flex-col justify-center gap-2">
          <div className="flex flex-col gap-1">
            <div>
              {order.products.length > 0 &&
                order.products.map((pro) => (
                  <div key={pro._id} className="flex justify-between">
                    <p className="font-bold text-lg">{pro.name}</p>
                    <p className="font-bold">{pro.amount}U</p>
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
                    {order.deliveryMethod.method}
                  </span>
                </p>
                {order.deliveryMethod.method === "Restaurante" && (
                  <p className="flex justify-between">
                    Número de mesa:{" "}
                    <span className="text-small text-default-500">
                      {order.deliveryMethod.tableNumber}
                    </span>
                  </p>
                )}
                {order.deliveryMethod.method === "Domicilio" && (
                  <p className="flex justify-between">
                    Dirección:{" "}
                    <span className="text-small text-default-500">
                      {order.shippingAddress}
                    </span>
                  </p>
                )}
                {order.deliveryMethod.method === "Domicilio" && (
                  <p className="flex justify-between">
                    Barrio:{" "}
                    <span className="text-small text-default-500">
                      {order.city}
                    </span>
                  </p>
                )}
                <p className="flex justify-between">
                  Metodo de pago:
                  <span className="text-small text-default-500">
                    {order.paymentMethod}
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
                  {order.deliveryMethod.method === "Domicilio" && (
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
          {order.totalAmount?.toLocaleString("es-CO", {
            style: "currency",
            currency: "COP",
          })}
        </span>
      </CardFooter>
    </Card>
  );
};

export default CardOrder;
