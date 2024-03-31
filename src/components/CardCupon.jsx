import { Card, CardHeader, useDisclosure } from "@nextui-org/react";
import Image from "next/image";
import ModalCupon from "./ModalCupon";
import { useOrder } from "@/context/OrderContext";
import toast from "react-hot-toast";

const CardCupon = ({ updateCosts }) => {
  const { cart } = useOrder();

  const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Card
        isDisabled={cart.discount}
        className="w-fullcursor-pointer hover:bg-black hover:bg-opacity-10"
      >
        <CardHeader
          onClick={() => {
            if (cart.discount) {
              toast("Tienes un cupón activo", {
                icon: "❗",
              });
            } else {
              onOpen();
            }
          }}
          className="flex justify-between gap-3 "
        >
          <div className="flex gap-3">
            <Image
              alt="image cupon"
              height={30}
              src="/coupons_fda43082da.webp"
              width={30}
            />
            <p className="text-xl font-semibold">Cupón</p>
          </div>
          {cart.discount ? (
            <span className="font-bold text-lg">
              DESCUENTO{" "}
              <span className="font-bold text-lg text-green-500">
                {Math.floor((cart.discount / cart.productCost) * 100)} %
              </span>
            </span>
          ) : (
            <span className="text-orange-peel text-sm">+ Agregar</span>
          )}
        </CardHeader>
      </Card>

      <ModalCupon
        isOpen={isOpen}
        onClose={onClose}
        onOpenChange={onOpenChange}
        updateCosts={updateCosts}
      />
    </>
  );
};

export default CardCupon;
