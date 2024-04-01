import { editTipSchema } from "@/utils/validationSchema";
import {
  Button,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useState } from "react";

const ModalEditTip = ({
  isOpen,
  onOpenChange,
  cart,
  setCart,
  saveCartProductsToLocalStorage,
}) => {
  const [tip, setTip] = useState("");
  const [error, setError] = useState(null);

  // Función para editar propina
  function handleUpdate(onClose) {
    try {
      const validateTip = editTipSchema.parse({ tip });

      setError(null);

      setCart((prevOrder) => {
        let updateTip = {};

        const productCost = prevOrder.products?.reduce(
          (acc, product) => acc + product.total,
          0
        );

        if (prevOrder.deliveryMethod?.method !== "Restaurante") {
          if (prevOrder.discount) {
            updateTip = {
              ...prevOrder,
              tip: parseInt(validateTip.tip),
              total:
                productCost +
                prevOrder.costOfShipping +
                parseInt(validateTip.tip) -
                prevOrder.discount,
            };
          } else {
            updateTip = {
              ...prevOrder,
              tip: parseInt(validateTip.tip),
              total:
                productCost +
                prevOrder.costOfShipping +
                parseInt(validateTip.tip),
            };
          }
        } else {
          updateTip = {
            ...prevOrder,
            tip: parseInt(validateTip.tip),
            total: productCost + parseInt(validateTip.tip),
          };
        }

        saveCartProductsToLocalStorage(updateTip);

        return updateTip;
      });

      onClose();
    } catch (error) {
      const errors = error?.errors?.map((error) => error.message);
      setError(errors);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setError(null);
        setTip("");
      }}
      onOpenChange={onOpenChange}
      placement="top-center"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Editar propina</ModalHeader>
            <Divider />
            <ModalBody>
              <Input
                autoFocus
                label="Propina"
                placeholder="Ingresar valor"
                variant="bordered"
                color="warning"
                isClearable
                value={tip}
                onValueChange={setTip}
                isInvalid={error?.some((error) => error.tip)}
                errorMessage={error?.find((error) => error.tip)?.tip}
              />
              <p className="text-[10px] text-gray-500">
                * Si prefieres no dejar propina, por favor ingresa el valor 0.
              </p>
            </ModalBody>
            <Divider />
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Cerrar
              </Button>
              <Button color="warning" onPress={() => handleUpdate(onClose)}>
                Actualizar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalEditTip;
