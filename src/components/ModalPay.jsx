import {
  Divider,
  Image,
  RadioGroup,
  Radio,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import CheckmarkIcon from "./icons/CheckmarkIcon";
import { useState } from "react";
import { useOrder } from "@/context/OrderContext";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const ModalPay = ({ isOpen, onOpenChange }) => {
  const { cart, setCart, saveCartProductsToLocalStorage } = useOrder();

  const [paymentMethod, setPaymentMethod] = useState(
    cart.paymentMethod || null
  );

  const router = useRouter();

  async function handlePay(onClose) {
    try {
      if (paymentMethod === "Tarjeta") {
        const promise = new Promise(async (resolve, reject) => {
          const res = await axios.post("/api/payment-method/checkout", cart);

          const { message } = res.data;

          if (res.data.url) {
            resolve(res.data.url);
          } else {
            reject(new Error(message));
          }
        });

        await toast.promise(promise, {
          loading: "Redireccionando...",
          success: "Pedido realizado",
          error: (err) => err.message,
        });

        const url = await promise;

        router.push(url);

        localStorage.removeItem("cart");
      } else if (paymentMethod === "Efectivo") {
        const promise = new Promise(async (resolve, reject) => {
          const res = await axios.post("/api/payment-method/cash", cart);

          const { message } = res.data;

          if (message === "Pedido realizado") {
            resolve(message);
          } else {
            reject(new Error(message));
          }
        });

        await toast.promise(promise, {
          loading: "Realizando pedido...",
          success: (message) => message,
          error: (err) => err.message,
        });

        const message = await promise;

        if (message === "Pedido realizado") {
          router.push("/orders");

          localStorage.removeItem("cart");
        }
      }

      onClose();
    } catch (error) {
      console.log("Error al seleccionar el método de pago" + error.message);
    }
  }

  const handleToggle = (value) => {
    setPaymentMethod(value);
    setCart((prevOrder) => {
      const updatePaymentMethod = {
        ...prevOrder,
        paymentMethod: value,
      };

      saveCartProductsToLocalStorage(updatePaymentMethod);

      return updatePaymentMethod;
    });
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex gap-3">
              <CheckmarkIcon />
              <p className="text-xl font-semibold">Método de pago</p>
            </ModalHeader>
            <Divider />
            <ModalBody>
              <RadioGroup
                color="warning"
                value={paymentMethod}
                onValueChange={(value) => handleToggle(value)}
              >
                <div
                  className="flex justify-between items-center p-5 rounded-lg cursor-pointer hover:bg-black hover:bg-opacity-10"
                  onClick={() => handleToggle("Efectivo")}
                >
                  <div className="flex items-center gap-3 ">
                    <Image
                      alt="image cash"
                      height={30}
                      src="/circle-cash.webp"
                      width={30}
                    />
                    <p>Efectivo</p>
                  </div>

                  <Radio value="Efectivo" />
                </div>
                <Divider />
                <div
                  className="flex justify-between items-center p-5 rounded-lg cursor-pointer hover:bg-black hover:bg-opacity-10"
                  onClick={() => handleToggle("Tarjeta")}
                >
                  <div className="flex items-center gap-3">
                    <Image
                      alt="image cc"
                      height={30}
                      src="/cc_round.png"
                      width={30}
                    />
                    <p>Agregar tarjeta de crédito o débito</p>
                  </div>

                  <Radio value="Tarjeta" />
                </div>
              </RadioGroup>
            </ModalBody>

            {paymentMethod && (
              <>
                <Divider />
                <ModalFooter>
                  <Button color="danger" variant="flat" onPress={onClose}>
                    Cancelar
                  </Button>
                  <Button color="warning" onPress={() => handlePay(onClose)}>
                    Confirmar
                  </Button>
                </ModalFooter>
              </>
            )}
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalPay;
