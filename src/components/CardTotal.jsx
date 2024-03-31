import { useOrder } from "@/context/OrderContext";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  useDisclosure,
} from "@nextui-org/react";
import ModalEditTip from "./ModalEditTip";

const CardTotal = () => {
  const { cart, setCart, saveCartProductsToLocalStorage } = useOrder();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <p className="text-xl font-semibold">Detalles</p>
        </CardHeader>
        <Divider />
        <CardBody className="flex justify-between gap-3 ">
          <div className="flex flex-col gap-2">
            <p className="flex justify-between items-center">
              Costo de productos:
              <span className="text-small text-default-500">
                {cart.productCost?.toLocaleString("es-CO", {
                  style: "currency",
                  currency: "COP",
                })}
              </span>
            </p>
            {cart.deliveryMethod?.method !== "Restaurante" && (
              <p className="flex justify-between items-center">
                Costo de envío:
                <span className="text-small text-default-500">
                  {cart.costOfShipping !== null
                    ? cart.costOfShipping.toLocaleString("es-CO", {
                        style: "currency",
                        currency: "COP",
                      })
                    : "$ 0,00"}
                </span>
              </p>
            )}
            {cart.deliveryMethod?.method !== "Restaurante" && (
              <p className="flex justify-between items-center">
                Descuento:
                <span className="text-small text-default-500">
                  {cart.discount !== null
                    ? cart.discount.toLocaleString("es-CO", {
                        style: "currency",
                        currency: "COP",
                      })
                    : "$ 0,00"}
                </span>
              </p>
            )}
            <div className="flex justify-between items-center">
              <div>
                <p>Propina:</p>
              </div>
              <div className="flex items-center gap-1">
                <p
                  onClick={onOpen}
                  className="text-orange-peel text-sm sm:text-xs hover:cursor-pointer hover:underline"
                >
                  Cambiar
                </p>
                <span className="text-small text-default-500">
                  {cart.tip?.toLocaleString("es-CO", {
                    style: "currency",
                    currency: "COP",
                  })}
                </span>
              </div>
            </div>
          </div>
        </CardBody>
        <Divider />
        <CardFooter className="flex justify-between items-center">
          <p className="font-medium text-xl">Total:</p>
          <span className="font-medium text-xl">
            {cart.total?.toLocaleString("es-CO", {
              style: "currency",
              currency: "COP",
            })}
          </span>
        </CardFooter>
      </Card>

      <ModalEditTip
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        cart={cart}
        setCart={setCart}
        saveCartProductsToLocalStorage={saveCartProductsToLocalStorage}
      />
    </>
  );
};

export default CardTotal;
