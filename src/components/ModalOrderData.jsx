import { categorySchema, orderDataSchema } from "@/utils/validationSchema";
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
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ModalOrderData = ({
  isOpen,
  onOpenChange,
  cart,
  setCart,
  saveCartProductsToLocalStorage,
  setIsModalOpen,
  updateCosts,
}) => {
  const { status } = useSession();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState(null);

  const router = useRouter();

  // Función para cerrar el modal y actualizar el estado error a null
  const handleCloseModal = () => {
    setError(null);
    setIsModalOpen(false);
  };

  // Función para actualizar datos del pedido
  async function handleUpdate() {
    try {
      if (cart.deliveryMethod.method !== "Restaurante") {
        const validatedData = orderDataSchema.parse({
          nombreCompleto: name,
          telefono: phone,
          direccion: address,
          ciudad: city,
        });

        setError(null);

        const promise = new Promise(async (resolve, reject) => {
          const res = await axios.put("/api/profile", validatedData);

          const { message, updatedUser } = res.data;

          if (message === "Usuario actualizado exitosamente") {
            resolve({ message, updatedUser });
          } else {
            reject(new Error(message));
          }
        });

        await toast.promise(promise, {
          loading: "Actualizando datos...",
          success: ({ message }) => message,
          error: (err) => err.message,
        });

        const dataUser = await promise;

        if (
          (dataUser.message === "Usuario actualizado exitosamente" &&
            dataUser.updatedUser.direccion !== cart.info.address) ||
          dataUser.updatedUser.ciudad !== cart.info.city
        ) {
          updateCosts();
          router.reload();
        } else if (dataUser.message === "Usuario actualizado exitosamente") {
          updateCosts();
        }
      } else {
        categorySchema.parse({ name });

        setError(null);

        if (status === "authenticated") {
          const promise = new Promise(async (resolve, reject) => {
            const res = await axios.put("/api/profile", {
              nombreCompleto: name,
              telefono: phone,
              direccion: address,
              ciudad: city,
            });

            const { message } = res.data;

            if (message === "Usuario actualizado exitosamente") {
              resolve(message);
            } else {
              reject(new Error(message));
            }
          });

          await toast.promise(promise, {
            loading: "Actualizando datos...",
            success: (message) => message,
            error: (err) => err.message,
          });

          const dataUser = await promise;

          if (dataUser === "Usuario actualizado exitosamente") {
            updateCosts();
          }
        } else if (status === "unauthenticated") {
          setCart((prevOrder) => {
            const nameUpdate = {
              ...prevOrder,
              info: {
                ...prevOrder.info,
                name: name,
              },
            };

            saveCartProductsToLocalStorage(nameUpdate);
            return nameUpdate;
          });

          toast.success("Nombre actualizado");
        }
      }

      handleCloseModal();
    } catch (error) {
      const errors = error?.errors?.map((error) => error.message);
      setError(errors);
    }
  }

  // useEffect para guardar los datos del pedido en su estado
  useEffect(() => {
    setName(cart.info?.name || "");
    setPhone(cart.info?.phone || "");
    setAddress(cart.info?.address || "");
    setCity(cart.info?.city || "");
  }, [isOpen, cart]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleCloseModal}
        onOpenChange={onOpenChange}
        placement="center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Actualizar datos del pedido
              </ModalHeader>
              <ModalBody>
                <Input
                  isClearable
                  label="Nombre"
                  placeholder="Nombre y apellido"
                  variant="bordered"
                  color="warning"
                  value={name}
                  onValueChange={setName}
                  isInvalid={error?.some((error) => error.name)}
                  errorMessage={error?.find((error) => error.name)?.name}
                />
                {cart.deliveryMethod.method !== "Restaurante" && (
                  <>
                    <Input
                      label="Teléfono"
                      placeholder="Número de teléfono"
                      type="number"
                      variant="bordered"
                      color="warning"
                      isClearable
                      value={phone}
                      onValueChange={setPhone}
                      isInvalid={error?.some((error) => error.phone)}
                      errorMessage={error?.find((error) => error.phone)?.phone}
                    />
                    <Input
                      isClearable
                      label="Dirección"
                      placeholder="## ## - ##"
                      variant="bordered"
                      color="warning"
                      value={address}
                      onValueChange={setAddress}
                      isInvalid={error?.some((error) => error.address)}
                      errorMessage={
                        error?.find((error) => error.address)?.address
                      }
                    />
                    <Input
                      isClearable
                      label="Ciudad"
                      placeholder="Barranquilla, soledad..."
                      variant="bordered"
                      color="warning"
                      value={city}
                      onValueChange={setCity}
                      isInvalid={error?.some((error) => error.city)}
                      errorMessage={error?.find((error) => error.city)?.city}
                    />
                    <p className="text-[10px] text-gray-500">
                      ¡La página se actualizará automáticamente después de
                      realizar la actualización de la dirección o ciudad!
                    </p>
                  </>
                )}
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="flat"
                  onPress={handleCloseModal}
                >
                  Cancelar
                </Button>
                <Button color="warning" onPress={handleUpdate}>
                  Actualizar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalOrderData;
