/* eslint-disable react-hooks/exhaustive-deps */
import { normalizeString } from "@/utils/stringUtils";
import { boxSchemaZod } from "@/utils/validationSchema";
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
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ModalMenuItem = ({
  isOpen,
  handleOpenModal,
  onOpenChange,
  boxItem,
  setBoxItem,
  editBox,
  setEditBox,
}) => {
  const [boxName, setBoxName] = useState("");
  const [boxMaximumQuantity, setBoxMaximumQuantity] = useState("");
  const [boxDescription, setBoxDescription] = useState("");
  const [error, setError] = useState(null);

  // Función para agregar y editar box
  const addBox = () => {
    try {
      const boxNameNormalize = normalizeString(boxName);

      // Validar los datos con el esquema Zod
      boxSchemaZod.parse({
        nombre: boxNameNormalize,
        cantidad_maxima: boxMaximumQuantity,
        descripcion: boxDescription,
      });

      setError(null);

      if (editBox != null) {
        setBoxItem((items) => {
          const updatedItems = [...items];

          updatedItems[editBox] = {
            ...updatedItems[editBox],
            nombre: boxNameNormalize,
            cantidad_maxima: boxMaximumQuantity,
            descripcion: boxDescription,
          };

          return updatedItems;
        });

        toast.success("Caja actualizada");
      } else {
        setBoxItem((items) => {
          return [
            ...items,
            {
              nombre: boxNameNormalize,
              cantidad_maxima: boxMaximumQuantity,
              descripcion: boxDescription,
              dataMenuItem: [],
            },
          ];
        });

        toast.success("Caja creada");
      }

      handleOpenModal();
      setBoxName("");
      setBoxMaximumQuantity("");
      setBoxDescription("");
    } catch (error) {
      const errors = error?.errors?.map((error) => error.message);
      setError(errors);
    }
  };

  // función para cuando se cierre el ModalMenuItem
  function handleClose() {
    if (editBox != null) {
      setError(null);
      setEditBox(null);
    } else {
      return setError(null);
    }
  }

  // useEffect para ejecutar la funcion handleClose
  useEffect(() => {
    if (!isOpen) {
      handleClose();
    }
  }, [isOpen, handleClose]);

  // useEffect para traer los datos al editar la caja
  useEffect(() => {
    if (editBox != null && boxItem?.length > 0) {
      const firstBoxData = boxItem[editBox];
      setBoxName(firstBoxData.nombre);
      setBoxMaximumQuantity(firstBoxData.cantidad_maxima);
      setBoxDescription(firstBoxData.descripcion);
    } else {
      setBoxName("");
      setBoxMaximumQuantity("");
      setBoxDescription("");
    }
  }, [editBox, boxItem]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleOpenModal}
      onOpenChange={onOpenChange}
      placement="center"
    >
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
                value={boxName}
                onValueChange={setBoxName}
                isInvalid={error?.some((error) => error.boxName)}
                errorMessage={error?.find((error) => error.boxName)?.boxName}
              />
              <Input
                type="number"
                min="0"
                label="Cantidad máxima"
                color="warning"
                variant="bordered"
                autoComplete="off"
                isClearable
                value={boxMaximumQuantity}
                onValueChange={setBoxMaximumQuantity}
                isInvalid={error?.some((error) => error.maxLength)}
                errorMessage={
                  error?.find((error) => error.maxLength)?.maxLength
                }
              />
              <Textarea
                label="Descripción"
                placeholder="Descripción del elemento"
                variant="bordered"
                color="warning"
                value={boxDescription}
                onValueChange={setBoxDescription}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={handleOpenModal}>
                Cancelar
              </Button>
              <Button color="warning" onPress={() => addBox()}>
                {editBox != null ? "Actualizar" : "Crear"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalMenuItem;
