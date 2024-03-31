import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@nextui-org/react";

const ModalConfirmOrderDetails = ({
  isOpen,
  onOpenChange,
  handleDelete,
  idDelete,
  setOpenModalConfirmDelete,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setOpenModalConfirmDelete(false)}
      onOpenChange={onOpenChange}
      size="xs"
      placement="center"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-lg text-center">
              ¿Eliminar pedido?
            </ModalHeader>
            <ModalBody>
              <Button
                color="success"
                variant="ghost"
                onPress={() => handleDelete(idDelete)}
              >
                Confirmar
              </Button>
              <Button color="danger" onPress={onClose}>
                Cancelar
              </Button>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalConfirmOrderDetails;
