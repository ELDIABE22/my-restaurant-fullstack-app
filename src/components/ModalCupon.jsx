import { usedCouponSchema } from "@/utils/validationSchema";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

const ModalCupon = ({ isOpen, onOpenChange, updateCosts }) => {
  const [coupon, setCoupon] = useState("");
  const [error, setError] = useState(null);

  // Función para aplicar cupón
  const handleSubmit = async (e, onClose) => {
    e.preventDefault();
    try {
      const validateCoupon = usedCouponSchema.parse({
        couponCode: coupon,
      });

      setError(null);

      const promise = new Promise(async (resolve, reject) => {
        const res = await axios.post(
          "/api/profile/coupon/used",
          validateCoupon
        );

        const { message } = res.data;

        if (message.includes("Cupón") && message.includes("aplicado")) {
          resolve(message);
          updateCosts();
        } else {
          reject(new Error(message));
        }

        onClose();
        setCoupon("");
      });

      await toast.promise(promise, {
        loading: "Aplicando cupón...",
        success: (message) => message,
        error: (err) => err.message,
      });
    } catch (error) {
      const errors = error?.errors?.map((error) => error.message);
      setError(errors);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setError(null);
        setCoupon("");
      }}
      onOpenChange={onOpenChange}
      placement="top-center"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Cupón</ModalHeader>
            <form onSubmit={(e) => handleSubmit(e, onClose)}>
              <ModalBody>
                <Input
                  autoFocus
                  label="Cupón"
                  placeholder="Ingresar cupón"
                  variant="bordered"
                  color="warning"
                  isClearable
                  value={coupon}
                  onValueChange={setCoupon}
                  isInvalid={error?.some((error) => error.couponCode)}
                  errorMessage={
                    error?.find((error) => error.couponCode)?.couponCode
                  }
                />
                <p className="text-[10px] text-gray-500">
                  * Una vez que apliques el cupón, no podrás cambiarlo hasta que
                  lo uses o expire.
                </p>
                <p className="text-[10px] text-gray-500">
                  * Este cupón solo aplica al costo de los productos.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Cerrar
                </Button>
                <Button color="warning" type="submit">
                  Validar
                </Button>
              </ModalFooter>
            </form>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalCupon;
