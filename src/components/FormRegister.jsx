"use client";

import { Input } from "@nextui-org/react";
import { toast } from "react-hot-toast";
import { Button } from "@nextui-org/react";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { MailIcon } from "./icons/MailIcon";
import { useRouter } from "next/navigation";

import { GoogleIcon } from "./icons/GoogleIcon";
import { EyeFilledIcon } from "./icons/EyeFilledIcon";
import { registerSchema } from "@/utils/validationSchema.js";
import { EyeSlashFilledIcon } from "./icons/EyeSlashFilledIcon";
import axios from "axios";
import UserIcon from "./icons/UserIcon";

const FormRegister = () => {
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [correo, setCorreo] = useState("");
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
        contraseña,
      });

      setError(null);

      const res = await axios.post("/api/auth/register", data);

      const { message } = res.data;

      if (message === "El usuario ya existe!") {
        toast.error(message);
        localStorage.removeItem("cart");
      }

      if (message === "Usuario registrado exitosamente") {
        await signIn("credentials", {
          correo,
          contraseña,
          redirect: false,
        });

        toast.success(message);

        router.push("/menu");
        setCreatingUserLoading(false);
      } else {
        setCreatingUserLoading(false);
      }
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
            endContent={
              <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
            }
          />
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
            <p className="text-white tracking-widest font-bold hover:scale-110 transform transition-transform duration-[0.2s] ease-in-out">
              {creatingUserLoading ? "Registrando..." : "Registrar"}
            </p>
          </Button>
          {/* <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/menu" })}
            className="flex justify-center gap-3 bg-white lg:mb-[5px] lg:mr-[10px] lg:ml-[10px] p-[14px] rounded-2xl cursor-pointer border"
          >
            <GoogleIcon />
            <p className="font-bold text-[15px] hover:scale-105 transform transition-transform duration-[0.2s] ease-in-out">
              Continuar con Google
            </p>
          </button> */}
        </div>
      </div>
    </form>
  );
};

export default FormRegister;
