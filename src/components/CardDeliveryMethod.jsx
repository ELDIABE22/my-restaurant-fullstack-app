import {
  Card,
  CardHeader,
  CardBody,
  Divider,
  RadioGroup,
  Radio,
  CardFooter,
  Button,
  Input,
} from "@nextui-org/react";
import TruckIcon from "./icons/TruckIcon";
import { useState } from "react";
import { useOrder } from "@/context/OrderContext";
import { deliveryMethodSchema } from "@/utils/validationSchema";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

const CardDeliveryMethod = () => {
  const { cart, setCart, saveCartProductsToLocalStorage } = useOrder();

  const { status } = useSession();

  const [deliveryMethod, setDeliveryMethod] = useState(
    cart.deliveryMethod?.method || ""
  );

  const [tableNumber, setTableNumber] = useState(
    cart.deliveryMethod?.tableNum || ""
  );
  const [saveTableNumber, setSaveTableNumber] = useState(false);

  const [error, setError] = useState(null);

  // Función para actualizar número de mesa
  function handleSaveTableNumber() {
    try {
      deliveryMethodSchema.parse({ tableNumber });

      setError(null);

      setCart((prevOrder) => {
        const updateDeliveryMethod = {
          ...prevOrder,
          deliveryMethod: {
            method: deliveryMethod,
            tableNum: tableNumber,
          },
        };

        saveCartProductsToLocalStorage(updateDeliveryMethod);

        return updateDeliveryMethod;
      });

      setSaveTableNumber(false);
    } catch (error) {
      const errors = error?.errors?.map((error) => error.message);
      setError(errors);
    }
  }

  // Función para cancelar número de mesa
  function cancelSaveTableNumber() {
    setTableNumber(cart.deliveryMethod?.tableNum);
    setSaveTableNumber(false);
    setError(null);
  }

  const handleToggle = (value) => {
    if (value === "Domicilio") {
      if (status === "authenticated") {
        setDeliveryMethod(value);
        setCart((prevOrder) => {
          const updateDeliveryMethod = {
            ...prevOrder,
            deliveryMethod: {
              method: value,
            },
          };

          saveCartProductsToLocalStorage(updateDeliveryMethod);
        });

        if (value === "Domicilio") {
          setTableNumber("");
        }

        setError(null);
        window.location.reload();
      } else if (status === "unauthenticated") {
        toast.error(
          "¡Debes iniciar sesión para realizar un pedido a domicilio!",
          {
            icon: "❗",
          }
        );
      }
    } else {
      setDeliveryMethod(value);
      setCart((prevOrder) => {
        const updateDeliveryMethod = {
          ...prevOrder,
          deliveryMethod: {
            method: value,
          },
        };

        saveCartProductsToLocalStorage(updateDeliveryMethod);
      });

      if (value === "Domicilio") {
        setTableNumber("");
      }

      setError(null);
      window.location.reload();
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex gap-3">
        <TruckIcon />
        <p className="text-xl font-semibold">Método de entrega</p>
      </CardHeader>
      <Divider />
      <CardBody>
        <RadioGroup
          color="warning"
          value={deliveryMethod}
          onValueChange={(value) => handleToggle(value)}
          defaultValue="Restaurante"
        >
          <div className="flex justify-between gap-3">
            <div
              onClick={() => handleToggle("Restaurante")}
              className="w-full flex justify-between items-center mb-2 p-5 border rounded-lg cursor-pointer hover:bg-black hover:bg-opacity-10"
            >
              <p className="font-semibold">Restaurante</p>
              <Radio value="Restaurante" />
            </div>
            <div
              onClick={() => handleToggle("Domicilio")}
              className="w-full flex justify-between items-center mb-2 p-5 border rounded-lg cursor-pointer hover:bg-black hover:bg-opacity-10"
            >
              <p className="font-semibold">Domicilio</p>
              <Radio value="Domicilio" />
            </div>
          </div>
        </RadioGroup>
      </CardBody>
      {deliveryMethod === "Restaurante" && (
        <>
          <Divider />
          <CardFooter className="px-3 py-2">
            <Input
              isClearable
              type="number"
              min="0"
              variant="underlined"
              placeholder="Número de mesa (max 10)"
              color="warning"
              className="p-0"
              value={tableNumber}
              onValueChange={(newValue) => {
                setTableNumber(newValue);
                if (newValue !== cart.deliveryMethod?.tableNum) {
                  setSaveTableNumber(true);
                } else {
                  setSaveTableNumber(false);
                }
              }}
              isInvalid={error?.some((error) => error.tableNum)}
              errorMessage={error?.find((error) => error.tableNum)?.tableNum}
            />
          </CardFooter>
        </>
      )}

      {deliveryMethod === "Restaurante" && saveTableNumber && (
        <div className="flex gap-3 px-3 py-2 ">
          <Button
            radius="none"
            color="danger"
            variant="ghost"
            className="w-full"
            onPress={cancelSaveTableNumber}
          >
            Cancelar
          </Button>
          <Button
            radius="none"
            color="warning"
            variant="ghost"
            className="w-full"
            onPress={handleSaveTableNumber}
          >
            Guardar
          </Button>
        </div>
      )}
      <Divider />
      <div className="p-3">
        <p className="text-[10px] text-gray-500">
          ! La página se actualizará automáticamente después de cambiar el
          método.
        </p>
      </div>
    </Card>
  );
};

export default CardDeliveryMethod;
