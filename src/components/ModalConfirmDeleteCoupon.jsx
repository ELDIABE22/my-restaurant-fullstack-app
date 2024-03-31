import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@nextui-org/react";

const ModalConfirmDeleteCoupon = ({
  isOpen,
  onClose,
  onOpenChange,
  handleDelete,
  idDelete,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onOpenChange={onOpenChange}
      size="xs"
      placement="top-center"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-lg text-center">
              ¿Eliminar cúpon?
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

export default ModalConfirmDeleteCoupon;
