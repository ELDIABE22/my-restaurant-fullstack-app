"use client";

import CardResetPassword from "@/components/CardResetPassword";
import { Spinner } from "@nextui-org/react";
import { useEffect, useState } from "react";

const ForgotPasswordPage = ({ params }) => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    fetch("/api/profile/users").then((res) => {
      res.json().then((data) => {
        const validateToken = data.find(
          (user) => user.resetPasswordToken === params.id
        );

        if (validateToken) {
          const currentDate = new Date();
          const expiresDate = new Date(validateToken.resetPasswordExpires);

          if (currentDate > expiresDate) {
            setToken("El token ha expirado");
          } else {
            setToken("El token es válido");
          }
        } else {
          setToken("No existe el token");
        }
      });
    });
  }, [params.id]);

  return (
    <section className="container mx-auto m-5 md:px-3">
      <div className="flex justify-center">
        {token === null && <Spinner color="warning" />}
        {token === "El token es válido" && (
          <CardResetPassword params={params} />
        )}
        {token === "El token ha expirado" && (
          <p className="font-bold text-2xl">El enlace expiró!</p>
        )}
        {token === "No existe el token" && (
          <p className="font-bold text-2xl">El enlace no existe!</p>
        )}
      </div>
    </section>
  );
};

export default ForgotPasswordPage;
