import { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
} from "@nextui-org/react";
import axios from "axios";
import toast from "react-hot-toast";

const CardOrderKitchen = ({ order }) => {
  const [updateStatusLoanding, setUpdateStatusLoanding] = useState(false);

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

  // Función para actualizar estado del pedido
  const handleUpdate = async (id, status, deliveryMethod) => {
    setUpdateStatusLoanding(true);
    try {
      const updateStatus = {
        id,
        status,
        deliveryMethod,
      };

      const res = await axios.put("/api/kitchen", updateStatus);

      const { message } = res.data;

      toast.success(message);
      setUpdateStatusLoanding(false);
    } catch (error) {
      console.log(error.message);
      setUpdateStatusLoanding(false);
    }
  };

  return (
    <Card className="sm:min-w-[400px]">
      <CardHeader>
        <div className="flex flex-col w-full">
          <div className="flex gap-2 sm:gap-0 justify-between">
            <div className="flex">
              <p className="font-bold text-inherit text-black">DIABE</p>
              <p className="font-bold text-inherit text-orange-peel">
                DELICIAS
              </p>
            </div>
            <div>
              <span className="text-xs text-default-500">{formattedDate}</span>
            </div>
          </div>
          <p className="text-md">
            ID Pedido:{" "}
            <span className="text-small text-default-500">{order.id}</span>
          </p>
          <Divider />
          <div className="flex flex-col gap-1 pt-3">
            {order.metodo_entrega === "Restaurante" && (
              <>
                <p className="text-xl font-bold text-center">
                  {order.metodo_entrega.toUpperCase()}
                </p>
                <p className="font-medium text-center">
                  MESA {order.numero_mesa}
                </p>
              </>
            )}
            {order.metodo_entrega === "Domicilio" && (
              <>
                <p className="text-xl font-bold text-center">
                  {order.metodo_entrega.toUpperCase()}
                </p>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <div className="flex flex-col justify-center gap-2">
          <div className="flex flex-col gap-1">
            <div>
              {order.platos.length > 0 &&
                order.platos.map((pro) => (
                  <div key={pro.id} className="flex flex-col justify-center">
                    <div className="flex justify-between">
                      <p className="font-bold text-lg">{pro.nombre}</p>
                      <span className="font-bold">{pro.cantidad}U</span>
                    </div>
                    {pro.adicionales.length > 0 && (
                      <div>
                        <p className="text-sm font-bold text-default-500">
                          Adicional
                        </p>
                        <div>
                          {pro.adicionales.map((ad) => (
                            <div key={ad.id} className="flex justify-between">
                              <p className="text-xs text-default-500">
                                + {ad.nombre}
                              </p>
                              <span className="text-xs text-default-500">
                                {ad.cantidad}U
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </CardBody>
      <Divider />
      <CardFooter className="flex flex-col gap-3">
        <div className="flex justify-between w-full">
          <p className="font-medium text-xl">Total:</p>
          <span className="font-medium text-xl">
            {parseInt(order.total).toLocaleString("es-CO", {
              style: "currency",
              currency: "COP",
            })}
          </span>
        </div>
        <Divider />
        <Button
          color="success"
          variant="ghost"
          radius="none"
          onPress={() =>
            handleUpdate(order.id, order.estado, order.metodo_entrega)
          }
          isLoading={updateStatusLoanding}
          fullWidth={true}
        >
          Preparado
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CardOrderKitchen;
