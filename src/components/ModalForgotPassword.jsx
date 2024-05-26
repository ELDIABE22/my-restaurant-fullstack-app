import { correoForgotPasswordSchema } from "@/utils/validationSchema";
import {
  Button,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

const ModalForgotPassword = ({ isOpen, onOpenChange }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);

  const [sendingMail, setSendingMail] = useState(false);

  async function handleSubmit(onClose) {
    setSendingMail(true);

    try {
      const validateEmail = correoForgotPasswordSchema.parse({ correo: email });

      setError(null);

      const promise = new Promise(async (resolve, reject) => {
        const res = await axios.post(
          "/api/auth/forgot-password",
          validateEmail
        );

        const { message } = res.data;

        if (
          message === "Se ha enviado un correo para restablecer tu contraseña."
        ) {
          resolve(message);
        } else {
          reject(new Error(message));
        }
      });

      await toast.promise(promise, {
        loading: "Enviando correo...",
        success: (message) => message,
        error: (err) => err.message,
      });

      onClose();
      setSendingMail(false);
    } catch (error) {
      const errors = error?.errors?.map((error) => error.message);
      setError(errors);
      setSendingMail(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setError(null);
        setEmail("");
      }}
      onOpenChange={onOpenChange}
      placement="center"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Recuperar contraseña
            </ModalHeader>
            <Divider />
            <ModalBody>
              <Input
                isDisabled={sendingMail}
                autoFocus
                isClearable
                label="Correo"
                variant="bordered"
                color="warning"
                value={email}
                onValueChange={setEmail}
                isInvalid={error?.some((error) => error.email)}
                errorMessage={error?.find((error) => error.email)?.email}
              />
            </ModalBody>
            <Divider />
            <ModalFooter>
              <Button
                color="danger"
                isDisabled={sendingMail}
                variant="flat"
                onPress={onClose}
              >
                Cancelar
              </Button>
              <Button
                onPress={() => handleSubmit(onClose)}
                isLoading={sendingMail}
                color="warning"
              >
                Enviar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalForgotPassword;
