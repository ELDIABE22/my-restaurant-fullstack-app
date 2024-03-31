"use client";

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Input,
  useDisclosure,
  Button,
} from "@nextui-org/react";
import ModalOrderData from "./ModalOrderData";
import { useOrder } from "@/context/OrderContext";
import { useState } from "react";

const CardOrderData = ({ updateCosts }) => {
  const { cart, setCart, saveCartProductsToLocalStorage } = useOrder();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [additionalDetail, setAdditionalDetail] = useState(
    cart.info.additionalDetail || ""
  );
  const [saveAdditionalDetail, setSaveAdditionalDetail] = useState(false);

  const { onOpenChange } = useDisclosure();

  // Función para actualizar detalles adiconales
  function handleSaveAdditionalDetail() {
    setCart((prevOrder) => {
      const updateAdditionalDetail = {
        ...prevOrder,
        info: {
          ...prevOrder.info,
          additionalDetail,
        },
      };

      saveCartProductsToLocalStorage(updateAdditionalDetail);

      return updateAdditionalDetail;
    });

    setSaveAdditionalDetail(false);
  }

  // Función para cancelar detalles adiconales
  function cancelSaveAdditionalDetail() {
    setAdditionalDetail(cart.info.additionalDetail);
    setSaveAdditionalDetail(false);
  }

  return (
    <>
      <Card className="w-full">
        <CardHeader
          onClick={() => setIsModalOpen(true)}
          className="flex justify-between gap-3 cursor-pointer hover:bg-black hover:bg-opacity-10"
        >
          <p className="text-xl font-semibold">Datos del pedido</p>
          <p className="text-orange-peel">Editar</p>
        </CardHeader>
        <Divider />
        <CardBody>
          <div className="flex flex-col gap-2">
            <p className="font-medium flex justify-between">
              Nombre:{" "}
              <span
                className={
                  !cart.info?.name
                    ? "text-small text-red-500"
                    : "text-small text-default-500"
                }
              >
                {cart.info?.name ? cart.info?.name : "Requerido"}
              </span>
            </p>
            {cart.deliveryMethod.method !== "Restaurante" && (
              <>
                <p className="font-medium flex justify-between">
                  Teléfono:{" "}
                  <span
                    className={
                      !cart.info?.phone
                        ? "text-small text-red-500"
                        : "text-small text-default-500"
                    }
                  >
                    {cart.info?.phone ? cart.info?.phone : "Requerido"}
                  </span>
                </p>
                <p className="font-medium flex justify-between">
                  Dirección:{" "}
                  <span
                    className={
                      !cart.info?.address
                        ? "text-small text-red-500"
                        : "text-small text-default-500"
                    }
                  >
                    {cart.info?.address ? cart.info?.address : "Requerido"}
                  </span>
                </p>
                <p className="font-medium flex justify-between">
                  Ciudad:{" "}
                  <span
                    className={
                      !cart.info?.city
                        ? "text-small text-red-500"
                        : "text-small text-default-500"
                    }
                  >
                    {cart.info?.city ? cart.info?.city : "Requerido"}
                  </span>
                </p>
              </>
            )}
            {cart.deliveryMethod.method === "Restaurante" && (
              <p className="font-medium flex justify-between">
                Mesa:{" "}
                <span
                  className={
                    !cart.deliveryMethod?.tableNum
                      ? "text-small text-red-500"
                      : "text-small text-default-500"
                  }
                >
                  {cart.deliveryMethod?.tableNum
                    ? cart.deliveryMethod?.tableNum
                    : "Requerido"}
                </span>
              </p>
            )}
          </div>
        </CardBody>
        {cart.deliveryMethod?.method !== "Restaurante" && (
          <>
            <Divider />
            <CardFooter className="px-3 py-2">
              <Input
                isClearable
                type="text"
                variant="underlined"
                placeholder="Detalles adicionales"
                color="warning"
                className="p-0"
                value={additionalDetail}
                onValueChange={(newValue) => {
                  setAdditionalDetail(newValue);
                  if (newValue !== cart.info.additionalDetail) {
                    setSaveAdditionalDetail(true);
                  } else {
                    setSaveAdditionalDetail(false);
                  }
                }}
              />
            </CardFooter>
          </>
        )}

        {cart.deliveryMethod?.method !== "Restaurante" &&
          saveAdditionalDetail && (
            <div className="flex gap-3 px-3 py-2 ">
              <Button
                radius="none"
                color="danger"
                variant="ghost"
                className="w-full"
                onPress={cancelSaveAdditionalDetail}
              >
                Cancelar
              </Button>
              <Button
                radius="none"
                color="warning"
                variant="ghost"
                className="w-full"
                onPress={handleSaveAdditionalDetail}
              >
                Guardar
              </Button>
            </div>
          )}
      </Card>

      <ModalOrderData
        isOpen={isModalOpen}
        onOpenChange={onOpenChange}
        cart={cart}
        setCart={setCart}
        saveCartProductsToLocalStorage={saveCartProductsToLocalStorage}
        setIsModalOpen={setIsModalOpen}
        updateCosts={updateCosts}
      />
    </>
  );
};

export default CardOrderData;
