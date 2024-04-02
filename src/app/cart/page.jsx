"use client";

import AccordionOrder from "@/components/AccordionOrder";
import CardCupon from "@/components/CardCupon";
import CardOrderData from "@/components/CardOrderData";
import CardTotal from "@/components/CardTotal";
import Maps from "@/components/Maps";
import axios from "axios";
import { useOrder } from "@/context/OrderContext";
import { Button, Spinner, useDisclosure } from "@nextui-org/react";
import { LoadScript } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import CardDeliveryMethod from "@/components/CardDeliveryMethod";
import ModalPay from "@/components/ModalPay";
import { useRouter } from "next/navigation";

const API_KEY = "AIzaSyCd7rDmSIZcV_OrXx4mNp5AN5MWI8j0m5k";

// Coordernadas del restaurante
const center = {
  lat: 10.9888999,
  lng: -74.7880153,
};

const CartPage = () => {
  const { cart, setCart, saveCartProductsToLocalStorage } = useOrder();

  const { status } = useSession();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [shippingCost, setShippingCost] = useState(null);
  const [loadingCartData, setLoadingCartData] = useState(true);

  const [destinationCoords, setDestinationCoords] = useState(null);
  const [distance, setDistance] = useState(null);

  const router = useRouter();

  // Función para obtener la distancia entre la ubicación del restaurante y la dirección del cliente
  const getDistance = async () => {
    try {
      const destinationCoords = await getCoordinatesFromAddress(
        cart.info.address,
        cart.info.city
      );

      setDestinationCoords(destinationCoords);

      const radioTierraKm = 6371; // Radio de la Tierra en kilómetros
      const dLat = gradoARadian(destinationCoords.lat - center.lat);
      const dLon = gradoARadian(destinationCoords.lng - center.lng);

      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(gradoARadian(center.lat)) *
          Math.cos(gradoARadian(destinationCoords.lat)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      const distancia = radioTierraKm * c;
      setDistance(distancia);

      // Costo fijo por kilómetro $ 1.500,00
      const value = Math.round((distancia * 1500) / 100) * 100;

      if (value > 0) {
        setShippingCost(value); // Costo de envío redondeado
      } else {
        setShippingCost(1500); // Costo de envío redondeado
      }

      return true;
    } catch (error) {
      console.error("Error al calcular la distancia:", error);
      return true;
    }
  };

  // Obtiene las coordenadas geográficas de una dirección y ciudad utilizando la API de Google Maps Geocoding.
  async function getCoordinatesFromAddress(address, city) {
    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address + ", " + city
      )}&key=${API_KEY}`;

      const res = await axios.get(url);

      const coordinates = res.data.results[0].geometry.location;

      return { lat: coordinates.lat, lng: coordinates.lng };
    } catch (error) {
      console.log("Error al obtener las coordenadas" + error);
    }
  }

  // Convierte grados a radianes.
  function gradoARadian(grados) {
    return grados * (Math.PI / 180);
  }

  // Función para actualizar el estado del carrito con nuevas propiedades de costos
  async function updateCosts() {
    try {
      let dataInfo = {};

      let profileRes;

      profileRes = await axios.get("/api/profile");
      const { data: profileData } = profileRes;

      if (profileData) {
        dataInfo = {
          id: profileData._id || "",
          name: profileData.nombreCompleto || "",
          phone: profileData.telefono || "",
          address: profileData.direccion || "",
          city: profileData.ciudad || "",
          additionalDetail: "",
        };

        getDistance();
      }

      if (cart.deliveryMethod?.method !== "Restaurante") {
        const couponRes = await axios.get("/api/profile/coupon/used");
        const { data: couponData } = couponRes;

        if (couponData) {
          setCart((prevOrder) => {
            const productCost = prevOrder.products?.reduce(
              (acc, product) => acc + product.total,
              0
            );

            // Agregar las propiedades de los costos
            const updatedOrder = {
              ...prevOrder,
              info: {
                ...cart.info,
                ...dataInfo,
              },
              productCost,
              costOfShipping: shippingCost,
              discount:
                Math.round(
                  (productCost * couponData.discountPercentage) / 100
                ) * 100,
              tip: Math.round((productCost * 0.05) / 100) * 100,
              total:
                productCost +
                shippingCost +
                Math.round((productCost * 0.05) / 100) * 100 -
                Math.round(
                  (productCost * couponData.discountPercentage) / 100
                ) *
                  100,
            };

            saveCartProductsToLocalStorage(updatedOrder);

            return updatedOrder;
          });

          const get = await getDistance();

          if (profileRes.status && get && couponRes.status) {
            setLoadingCartData(false);
          }
        } else {
          setCart((prevOrder) => {
            const productCost = prevOrder.products?.reduce(
              (acc, product) => acc + product.total,
              0
            );

            const updateOrder = {
              ...prevOrder,
              info: {
                ...cart.info,
                ...dataInfo,
              },
              productCost,
              costOfShipping: shippingCost,
              discount: null,
              tip: Math.round((productCost * 0.05) / 100) * 100,
              total:
                productCost +
                shippingCost +
                Math.round((productCost * 0.05) / 100) * 100,
            };

            saveCartProductsToLocalStorage(updateOrder);

            return updateOrder;
          });
        }

        const get = await getDistance();

        if (profileRes.status && get) {
          setLoadingCartData(false);
        }
      } else {
        setCart((prevOrder) => {
          const productCost = prevOrder.products?.reduce(
            (acc, product) => acc + product.total,
            0
          );

          // Agregar las propiedades de los costos
          const updatedOrder = {
            ...prevOrder,
            info: {
              ...cart.info,
              ...dataInfo,
            },
            productCost,
            tip: Math.round((productCost * 0.05) / 100) * 100,
            total: productCost + Math.round((productCost * 0.05) / 100) * 100,
          };

          saveCartProductsToLocalStorage(updatedOrder);

          return updatedOrder;
        });

        if (profileRes.status) {
          setLoadingCartData(false);
        }
      }
    } catch (error) {
      console.log("Error al actualizar los costos" + error);
      setLoadingCartData(false);
    }
  }

  // useEffect para ejecutar la función updateCosts();
  useEffect(() => {
    updateCosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart.products, cart.costOfShipping, shippingCost]);

  if (typeof window !== "undefined" && cart.products?.length <= 0) {
    router.push("/");
  }

  return (
    <>
      <section className="container mx-auto m-5 md:px-3 box-content">
        {loadingCartData && status === "loading" ? (
          <Spinner
            label="Cargando carrito..."
            color="warning"
            className="flex justify-center"
          />
        ) : (
          <div className="w-full flex flex-col lg:flex-row lg:gap-5 justify-center box-content">
            <div className="flex flex-col gap-4 w-full lg:max-w-[635px] box-content">
              <CardDeliveryMethod />
              <CardOrderData updateCosts={updateCosts} />
              <AccordionOrder />
              {cart.deliveryMethod?.method !== "Restaurante" && (
                <CardCupon updateCosts={updateCosts} />
              )}
            </div>
            <div className="w-full flex flex-col">
              <LoadScript googleMapsApiKey={API_KEY}>
                {cart.deliveryMethod?.method !== "Restaurante" && (
                  <Maps
                    destinationCoords={destinationCoords}
                    distance={distance}
                    shippingCost={shippingCost}
                    cart={cart}
                  />
                )}
              </LoadScript>
              <div
                className={
                  cart.deliveryMethod?.method !== "Restaurante"
                    ? "w-full flex flex-col justify-center gap-5 lg:block lg:max-w-[635px] lg:sticky lg:top-[76px]"
                    : "w-full flex flex-col justify-center gap-5 lg:block lg:max-w-[635px] lg:sticky lg:top-[76px] mt-5 lg:mt-0"
                }
              >
                <CardTotal />
                <Button
                  className="w-full text-base p-5 lg:mt-5"
                  radius="none"
                  size="md"
                  color="warning"
                  variant="ghost"
                  onPress={onOpen}
                >
                  Hacer pedido
                </Button>
              </div>
            </div>
          </div>
        )}
      </section>

      <ModalPay isOpen={isOpen} onOpenChange={onOpenChange} />
    </>
  );
};

export default CartPage;
