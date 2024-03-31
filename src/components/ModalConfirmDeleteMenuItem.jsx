import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
} from "@nextui-org/react";

const ModalConfirmDeleteMenuItem = ({
  isOpen,
  onClose,
  onOpenChange,
  modalData,
}) => {
  const { title, funcion, index, boxIndex } = modalData;

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
              {title}
            </ModalHeader>
            <ModalBody>
              <Button
                color="success"
                variant="ghost"
                onPress={() => {
                  if (index === null) {
                    funcion(boxIndex);
                  } else {
                    funcion(index, boxIndex);
                  }
                  onClose();
                }}
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

export default ModalConfirmDeleteMenuItem;
