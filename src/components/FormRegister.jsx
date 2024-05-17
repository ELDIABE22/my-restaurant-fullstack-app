"use client";

import { Input } from "@nextui-org/react";
import { toast } from "react-hot-toast";
import { Button } from "@nextui-org/react";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { MailIcon } from "./icons/MailIcon";
import { useRouter } from "next/navigation";
import { EyeFilledIcon } from "./icons/EyeFilledIcon";
import { registerSchema } from "@/utils/validationSchema.js";
import { EyeSlashFilledIcon } from "./icons/EyeSlashFilledIcon";
import axios from "axios";
import UserIcon from "./icons/UserIcon";

const FormRegister = () => {
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [direccion, setDireccion] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState(null);
  const [creatingUserLoading, setCreatingUserLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreatingUserLoading(true);

    try {
      const data = registerSchema.parse({
        nombreCompleto,
        correo,
        telefono,
        ciudad,
        direccion,
        contraseña,
      });

      setError(null);

      const res = await axios.post("/api/auth/register", data);

      const { message } = res.data;

      if (message === "Usuario registrado exitosamente") {
        await signIn("credentials", {
          correo,
          contraseña,
          redirect: false,
        });

        toast.success(message);

        router.push("/menu");

        localStorage.removeItem("cart");
      } else {
        toast.error(message);
      }
      setCreatingUserLoading(false);
    } catch (error) {
      const errors = error?.errors?.map((error) => error.message);
      setError(errors);
      setCreatingUserLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-3 lg:p-7 mb-5 lg:mb-0">
        <div className="flex flex-col w-full mb-6 md:mb-0 gap-4">
          <Input
            type="text"
            label="Nombre Completo"
            color="warning"
            variant="bordered"
            autoComplete="off"
            value={nombreCompleto}
            onValueChange={setNombreCompleto}
            isInvalid={error?.some((error) => error.name)}
            errorMessage={error?.find((error) => error.name)?.name}
            className="text-white"
            endContent={
              <UserIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
            }
          />
          <Input
            type="email"
            label="Email"
            color="warning"
            variant="bordered"
            autoComplete="off"
            value={correo}
            onValueChange={setCorreo}
            isInvalid={error?.some((error) => error.email)}
            errorMessage={error?.find((error) => error.email)?.email}
            className="text-white"
            endContent={
              <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
            }
          />
          <Input
            type="number"
            label="Teléfono"
            color="warning"
            variant="bordered"
            autoComplete="off"
            isClearable
            value={telefono}
            onValueChange={setTelefono}
            isInvalid={error?.some((error) => error.phone)}
            errorMessage={error?.find((error) => error.phone)?.phone}
            className="text-white"
          />
          <div className="flex gap-3">
            <Input
              type="text"
              label="Ciudad"
              color="warning"
              variant="bordered"
              autoComplete="off"
              isClearable
              value={ciudad}
              onValueChange={setCiudad}
              isInvalid={error?.some((error) => error.city)}
              errorMessage={error?.find((error) => error.city)?.city}
              className="text-white"
            />
            <Input
              type="text"
              label="Dirección"
              color="warning"
              variant="bordered"
              autoComplete="off"
              isClearable
              value={direccion}
              onValueChange={setDireccion}
              isInvalid={error?.some((error) => error.address)}
              errorMessage={error?.find((error) => error.address)?.address}
              className="text-white"
            />
          </div>
          <Input
            type={isVisible ? "text" : "password"}
            label="Contraseña"
            color="warning"
            variant="bordered"
            autoComplete="off"
            value={contraseña}
            onValueChange={setContraseña}
            isInvalid={error?.some((error) => error.password)}
            errorMessage={error?.find((error) => error.password)?.password}
            className="text-white"
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                ) : (
                  <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                )}
              </button>
            }
          />
        </div>
        <div>
          <Button
            type="submit"
            color="warning"
            size="lg"
            variant="shadow"
            isLoading={creatingUserLoading}
            className="text-[15px] w-full"
          >
            <p className="text-white w-full tracking-widest font-bold hover:scale-110 transform transition-transform duration-[0.2s] ease-in-out">
              {creatingUserLoading ? "Registrando..." : "Registrar"}
            </p>
          </Button>
        </div>
      </div>
    </form>
  );
};

export default FormRegister;
