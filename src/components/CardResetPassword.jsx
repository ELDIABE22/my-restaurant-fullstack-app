import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Input,
  Button,
} from "@nextui-org/react";
import { useState } from "react";
import { EyeFilledIcon } from "./icons/EyeFilledIcon";
import { EyeSlashFilledIcon } from "./icons/EyeSlashFilledIcon";
import { resetPasswordSchema } from "@/utils/validationSchema";

import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

const CardResetPassword = ({ params }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [error, setError] = useState(null);

  const [updateNewPasswordLoading, setUpdateNewPasswordLoading] =
    useState(false);

  const [isVisible, setIsVisible] = useState(false);

  const router = useRouter();

  async function handleUpdate() {
    setUpdateNewPasswordLoading(true);

    try {
      resetPasswordSchema.parse({
        newPassword,
        confirmNewPassword,
      });

      setError(null);

      if (newPassword !== confirmNewPassword) {
        setUpdateNewPasswordLoading(false);
        return toast.error("Las contraseñas no coinciden!");
      }

      const data = {
        token: params.id,
        newPassword,
      };

      const res = await axios.post("/api/auth/reset-password", data);

      const { message } = res.data;

      if (message === "Tu contraseña ha sido restablecida con éxito.") {
        toast.success(message);
        router.push("/auth/login");
      } else {
        toast.error(message);
      }

      setUpdateNewPasswordLoading(false);
    } catch (error) {
      const errors = error?.errors?.map((error) => error.message);
      setError(errors);
      setUpdateNewPasswordLoading(false);
    }
  }

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <Card className="min-w-[300px] sm:min-w-[400px]">
      <CardHeader className="flex flex-col">
        <div className="flex justify-center">
          <p className="font-bold text-sm text-inherit text-black">DIABE</p>
          <p className="font-bold text-sm *:text-inherit text-orange-peel">
            DELICIAS
          </p>
        </div>
        <div>
          <p className="font-bold text-xl">Actualizar Contraseña</p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody className="flex flex-col gap-3">
        <Input
          autoFocus
          type={isVisible ? "text" : "password"}
          label="Nueva contraseña"
          color="warning"
          variant="bordered"
          autoComplete="off"
          value={newPassword}
          onValueChange={setNewPassword}
          isInvalid={error?.some((error) => error.newPassword)}
          errorMessage={error?.find((error) => error.newPassword)?.newPassword}
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
        <Input
          type={isVisible ? "text" : "password"}
          label="Confirmar nueva contraseña"
          color="warning"
          variant="bordered"
          autoComplete="off"
          value={confirmNewPassword}
          onValueChange={setConfirmNewPassword}
          isInvalid={error?.some((error) => error.confirmNewPassword)}
          errorMessage={
            error?.find((error) => error.confirmNewPassword)?.confirmNewPassword
          }
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
      </CardBody>
      <Divider />
      <CardFooter>
        <Button
          color="warning"
          variant="ghost"
          radius="none"
          isLoading={updateNewPasswordLoading}
          fullWidth={true}
          onPress={handleUpdate}
        >
          {updateNewPasswordLoading ? "Actualizando..." : "Actualizar"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CardResetPassword;
