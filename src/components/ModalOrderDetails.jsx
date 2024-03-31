import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Divider,
  Tabs,
  Tab,
} from "@nextui-org/react";

const ModalOrderDetails = ({ isOpen, onOpenChange, order, setOpenModal }) => {
  let disabledKeys = [];

  let color;

  if (order?.status === "Pendiente") {
    disabledKeys = ["enCamino", "entregado"];
    color = "warning";
  } else if (order?.status === "En camino") {
    disabledKeys = ["pendiente", "entregado"];
    color = "primary";
  } else if (order?.status === "Entregado") {
    disabledKeys = ["pendiente", "enCamino"];
    color = "success";
  }

  // Convertir la fecha createdAt en un objeto de fecha
  const createdAtDate = new Date(order?.createdAt);

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
    <Modal
      isOpen={isOpen}
      onClose={() => setOpenModal(false)}
      onOpenChange={onOpenChange}
      placement="center"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              <div className="flex flex-col w-full">
                <div className="flex justify-between">
                  <div className="flex">
                    <p className="font-bold text-inherit text-black">DIABE</p>
                    <p className="font-bold text-inherit text-orange-peel">
                      DELICIAS
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-default-500">
                      {formattedDate}
                    </span>
                  </div>
                </div>
                <p className="text-md">
                  ID Pedido:{" "}
                  <span className="text-small text-default-500">
                    {order?._id}
                  </span>
                </p>
              </div>
            </ModalHeader>
            <Divider />
            <ModalBody>
              <div className="flex flex-col justify-center gap-2">
                <div className="flex flex-col gap-1">
                  <div>
                    {order?.products.length > 0 &&
                      order?.products.map((pro) => (
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
                        Nombre:{" "}
                        <span className="text-small text-default-500">
                          {order?.user.name || "?"}
                        </span>
                      </p>
                      <p className="flex justify-between">
                        Método de entrega:{" "}
                        <span className="text-small text-default-500">
                          {order?.deliveryMethod.method}
                        </span>
                      </p>
                      {order?.deliveryMethod.method === "Restaurante" && (
                        <p className="flex justify-between">
                          Número de mesa:{" "}
                          <span className="text-small text-default-500">
                            {order?.deliveryMethod.tableNumber}
                          </span>
                        </p>
                      )}
                      {order?.deliveryMethod.method === "Domicilio" && (
                        <p className="flex justify-between">
                          Dirección:{" "}
                          <span className="text-small text-default-500">
                            {order?.shippingAddress}
                          </span>
                        </p>
                      )}
                      {order?.deliveryMethod.method === "Domicilio" && (
                        <p className="flex justify-between">
                          Barrio:{" "}
                          <span className="text-small text-default-500">
                            {order?.city}
                          </span>
                        </p>
                      )}
                      <p className="flex justify-between">
                        Metodo de pago:
                        <span className="text-small text-default-500">
                          {order?.paymentMethod}
                        </span>
                      </p>
                    </div>
                  </div>
                  <Divider />
                  <div className="flex flex-col gap-1">
                    <div>
                      <p className="text-center font-semibold">
                        Estado del pedido
                      </p>
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
                        <Tab key="enCamino" title="En camino" />
                        <Tab key="entregado" title="Entregado" />
                      </Tabs>
                    </div>
                  </div>
                </div>
              </div>
            </ModalBody>
            <Divider />
            <ModalFooter className="flex justify-between">
              <p className="font-medium text-xl">Total:</p>
              <span className="font-medium text-xl">
                {order?.totalAmount?.toLocaleString("es-CO", {
                  style: "currency",
                  currency: "COP",
                })}
              </span>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalOrderDetails;
