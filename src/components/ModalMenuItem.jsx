import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
} from "@nextui-org/react";

const ModalMenuItem = ({ isOpen, onOpenChange }) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-orange-peel">
              Caja de elemento extra
            </ModalHeader>
            <ModalBody>
              <Input
                autoFocus
                label="Nombre"
                type="text"
                variant="bordered"
                color="warning"
                autoComplete="off"
                isClearable
              />
              <Textarea
                label="Descripción"
                placeholder="Descripción del elemento"
                variant="bordered"
                color="warning"
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Cancelar
              </Button>
              <Button color="warning" onPress={onClose}>
                Crear
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalMenuItem;
