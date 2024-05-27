"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { couponsSchema } from "@/utils/validationSchema";
import { useEffect, useState } from "react";
import { Button, Input, Spinner } from "@nextui-org/react";

import toast from "react-hot-toast";
import axios from "axios";
import CouponsTable from "@/components/CouponsTable";

const CouponsPage = () => {
  const [code, setCode] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [coupons, setCoupons] = useState([]);
  const [creatingCoupon, setCreatingCoupon] = useState(false);
  const [loadingCoupons, setLoadingCoupons] = useState(true);
  const [error, setError] = useState(null);

  const { data: session, status } = useSession();

  const router = useRouter();

  // Función para crear un cúpon
  const handleSubmit = async () => {
    setCreatingCoupon(true);
    try {
      const validatedCoupon = couponsSchema.parse({
        code,
        discountPercentage,
        expirationDate,
      });

      setError(null);

      const res = await axios.post("/api/profile/coupon", validatedCoupon);

      const { message } = res.data;

      if (message === "Cúpon creado") {
        setCode("");
        setDiscountPercentage("");
        setExpirationDate("");

        toast.success(message);

        getCoupons();
        setCreatingCoupon(false);
      } else {
        toast.error(message);
        setCreatingCoupon(false);
      }
    } catch (error) {
      const errors = error?.errors?.map((error) => error.message);
      setError(errors);
      setCreatingCoupon(false);
    }
  };

  // Función para obtener los cupones de la base de datos
  const getCoupons = async () => {
    try {
      const res = await axios.get("/api/profile/coupon");
      setCoupons(res.data);
      if (res) setLoadingCoupons(false);
    } catch (error) {
      console.error("Error al obtener los cupones:", error);
    }
  };

  // useEffect para ejecutar la función getCoupons();
  useEffect(() => {
    if (status === "authenticated") {
      if (session?.user.admin === 1) {
        getCoupons();
      } else {
        return router.push("/");
      }
    } else if (status === "unauthenticated") {
      return router.push("/");
    }
  }, [router, session?.user.admin, status]);

  if (loadingCoupons)
    return (
      <Spinner
        label="Cargando cupones..."
        color="warning"
        className="flex justify-center items-center"
      />
    );

  return (
    <>
      {status === "loading" ? (
        <Spinner color="warning" className="flex justify-center" />
      ) : (
        <section className="flex gap-5 justify-center items-center">
          <form className="flex flex-col gap-3">
            <p className="font-bold text-xl text-center">AGREGAR CÚPON</p>
            <Input
              isDisabled={creatingCoupon}
              type="text"
              label="Código del cupón"
              color="warning"
              variant="bordered"
              radius="none"
              size="sm"
              autoComplete="off"
              isClearable
              value={code}
              onValueChange={setCode}
              isInvalid={error?.some((error) => error.code)}
              errorMessage={error?.find((error) => error.code)?.code}
            />
            <Input
              isDisabled={creatingCoupon}
              type="number"
              label="Descuento"
              color="warning"
              min="1"
              variant="bordered"
              radius="none"
              size="sm"
              autoComplete="off"
              isClearable
              value={discountPercentage}
              onValueChange={setDiscountPercentage}
              isInvalid={error?.some((error) => error.discountPercentage)}
              errorMessage={
                error?.find((error) => error.discountPercentage)
                  ?.discountPercentage
              }
            />
            <Input
              isDisabled={creatingCoupon}
              type="date"
              label="Expiración"
              color="warning"
              variant="bordered"
              radius="none"
              size="sm"
              autoComplete="off"
              value={expirationDate}
              onValueChange={setExpirationDate}
              isInvalid={error?.some((error) => error.expirationDate)}
              errorMessage={
                error?.find((error) => error.expirationDate)?.expirationDate
              }
            />
            <Button
              color="warning"
              size="lg"
              variant="ghost"
              radius="none"
              isLoading={creatingCoupon}
              onPress={handleSubmit}
            >
              {creatingCoupon ? "Creando..." : "Crear"}
            </Button>
          </form>

          {coupons.length > 0 && (
            <CouponsTable coupons={coupons} getCoupons={getCoupons} />
          )}
        </section>
      )}
    </>
  );
};

export default CouponsPage;
