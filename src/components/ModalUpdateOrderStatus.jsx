import {
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";

const ModalUpdateOrderStatus = ({
  isOpen,
  onOpenChange,
  order,
  handleUpdate,
  setOpenModalUpdateOrderStatus,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setOpenModalUpdateOrderStatus(false)}
      onOpenChange={onOpenChange}
      size="sm"
      placement="center"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-lg text-center">
              Cambiar Estado Del Pedido
            </ModalHeader>
            <Divider />
            <ModalBody>
              <div className="flex justify-center">
                <Breadcrumbs variant="bordered">
                  <BreadcrumbItem
                    color="warning"
                    isCurrent={order.estado === "Pendiente"}
                    isDisabled={order.estado !== "Pendiente"}
                  >
                    Pendiente
                  </BreadcrumbItem>
                  {order.metodo_entrega === "Domicilio" && (
                    <BreadcrumbItem
                      color="primary"
                      isCurrent={order.estado === "En camino"}
                      isDisabled={order.estado !== "En camino"}
                    >
                      En Camino
                    </BreadcrumbItem>
                  )}
                  <BreadcrumbItem
                    color="success"
                    isCurrent={order.estado === "Entregado"}
                    isDisabled={order.estado !== "Entregado"}
                  >
                    Entregado
                  </BreadcrumbItem>
                </Breadcrumbs>
              </div>
            </ModalBody>
            <Divider />
            <ModalFooter>
              <Button color="danger" onPress={onClose}>
                Cancelar
              </Button>
              <Button
                color="success"
                variant="ghost"
                onPress={() =>
                  handleUpdate(order.id, order.estado, order.metodo_entrega)
                }
              >
                Confirmar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalUpdateOrderStatus;
