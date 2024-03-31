"use client";

import { Spinner } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";
import CardOrderKitchen from "@/components/CardOrderKitchen";
import { useRouter } from "next/navigation";

const KitchenPage = () => {
  const { data: session, status } = useSession();

  const [orders, setOrders] = useState([]);
  const [loanding, setLoanding] = useState(true);

  const router = useRouter();

  // Función para consultar las ordenes del usuario registrado
  async function getOrders() {
    try {
      const res = await axios.get("/api/order");
      const { data } = res;
      const orderData = data.filter(
        (order) => order.paid === true && order.status === "Pendiente"
      );

      setOrders(orderData);
      setLoanding(false);
    } catch (error) {
      console.log(error.message);
      setLoanding(false);
    }
  }

  // useEffect para ejecutar getOrders()
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (status === "authenticated") {
        getOrders();
      }
    }, 1000);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  if (session?.user.admin === false) {
    return router.push("/");
  }

  return (
    <section className="container mx-auto m-5 md:px-3">
      {loanding ? (
        <Spinner
          label="Cargando pedidos..."
          color="warning"
          className="flex justify-center"
        />
      ) : (
        <div className="flex justify-center gap-5 flex-wrap">
          {orders.length > 0 ? (
            orders.map((or) => <CardOrderKitchen key={or._id} order={or} />)
          ) : (
            <div className="text-center">
              <p className="font-semibold text-lg">No hay pedidos.</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default KitchenPage;
