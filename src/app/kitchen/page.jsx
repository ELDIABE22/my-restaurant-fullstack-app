"use client";

import { Spinner } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";
import CardOrderKitchen from "@/components/CardOrderKitchen";

const KitchenPage = () => {
  const { data: session, status } = useSession();

  const [orders, setOrders] = useState([]);
  const [loanding, setLoanding] = useState(true);

  const router = useRouter();

  // Función para consultar las ordenes del usuario registrado
  const getOrders = async () => {
    try {
      const res = await axios.get("/api/kitchen");
      const { data } = res;

      const orders = [];
      const ordersMap = new Map();

      data.forEach((row) => {
        if (!ordersMap.has(row.ordenId)) {
          const order = {
            id: row.ordenId,
            usuarioId: row.usuarioId,
            metodo_pago: row.metodo_pago,
            metodo_entrega: row.metodo_entrega,
            direccion_envio: row.direccion_envio,
            ciudad_envio: row.ciudad_envio,
            detalles_adicionales: row.detalles_adicionales,
            numero_mesa: row.numero_mesa,
            total: row.total,
            pagado: row.pagado,
            estado: row.estado,
            fecha_creado: row.fecha_creado,
            fecha_actualizado: row.fecha_actualizado,
            platos: [],
          };
          orders.push(order);
          ordersMap.set(row.ordenId, order);
        }

        const order = ordersMap.get(row.ordenId);

        if (row.ordenPlatoId) {
          let plato = order.platos.find((p) => p.id === row.ordenPlatoId);
          if (!plato) {
            plato = {
              id: row.ordenPlatoId,
              nombre: row.platoNombre,
              cantidad: row.platoCantidad,
              adicionales: [],
            };
            order.platos.push(plato);
          }

          if (row.adicionalId) {
            plato.adicionales.push({
              id: row.adicionalId,
              nombre: row.adicionalNombre,
              cantidad: row.adicionalCantidad,
            });
          }
        }
      });

      setOrders(orders);
      setLoanding(false);
    } catch (error) {
      console.log(error.message);
      setLoanding(false);
    }
  };

  // useEffect para ejecutar getOrders()
  useEffect(() => {
    if (status === "authenticated" && session?.user.admin === 1) {
      const fetchOrders = () => {
        getOrders();
      };

      fetchOrders();

      const intervalId = setInterval(fetchOrders, 5000);

      return () => clearInterval(intervalId);
    } else if (status === "unauthenticated" && session?.user.admin === 0) {
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
            orders.map((or) => <CardOrderKitchen key={or.id} order={or} />)
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
