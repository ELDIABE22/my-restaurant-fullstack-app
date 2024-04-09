"use client";

import { Spinner } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { socket } from "@/utils/socket";
import CardOrderKitchen from "@/components/CardOrderKitchen";

const KitchenPage = () => {
  const { data: session, status } = useSession();

  const [orders, setOrders] = useState([]);
  const [loanding, setLoanding] = useState(true);

  const router = useRouter();

  // Función para consultar las ordenes del usuario registrado
  async function getOrders() {
    try {
      socket.emit("getOrders");

      // Escucha el evento 'orders' para recibir las órdenes iniciales
      socket.on("orders", (data) => {
        const orderData = data.filter(
          (order) => order.paid === true && order.status === "Pendiente"
        );
        setOrders(orderData);
        setLoanding(false);
      });

      // Escucha el evento 'ordersUpdated' para recibir actualizaciones en tiempo real
      socket.on("ordersUpdated", (data) => {
        const orderData = data.filter(
          (order) => order.paid === true && order.status === "Pendiente"
        );
        setOrders(orderData);
        setLoanding(false);
      });

      // Limpiar los oyentes cuando el componente se desmonte
      return () => {
        socket.off("orders");
        socket.off("ordersUpdated");
        setLoanding(false);
      };
    } catch (error) {
      console.log(error.message);
      setLoanding(false);
    }
  }

  // useEffect para ejecutar getOrders()
  useEffect(() => {
    if (status === "authenticated" && session?.user.admin) {
      getOrders();
    } else if (status === "unauthenticated" && !session?.user.admin) {
      return router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user.admin, status]);

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
