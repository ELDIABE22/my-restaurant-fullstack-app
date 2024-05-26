import { useState } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  Image,
  useDisclosure,
} from "@nextui-org/react";
import axios from "axios";
import ModalMenu from "./ModalMenu";

export default function CardMenu({ item }) {
  const [selectedBoxElements, setSelectedBoxElements] = useState([]);
  const [element, setElement] = useState(null);
  const [modalDataItem, setModalDataItem] = useState(null);

  const [loadingMenuItem, setLoadingMenuItem] = useState(true);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const getMenuItem = async () => {
    onOpen();

    try {
      const res = await axios.get(`/api/profile/menu-items/${item.id}`);
      const { data: dataMenuItem } = res;

      // Crear el objeto principal del plato
      const plato = {
        id: dataMenuItem[0].plato_id,
        imagen_url: dataMenuItem[0].imagen_url,
        nombre: dataMenuItem[0].plato_nombre,
        descripcion: dataMenuItem[0].plato_descripcion,
        precio: dataMenuItem[0].plato_precio,
        categoria: {
          id: dataMenuItem[0].categoria_id,
          nombre: dataMenuItem[0].categoria_nombre,
        },
      };

      // Crear un mapa para los plato_caja por id
      const cajasMap = new Map();

      dataMenuItem.forEach((row) => {
        // Verificar si hay plato_caja_id y plato_caja_item_id presentes
        if (row.plato_caja_id && row.plato_caja_item_id) {
          // Si el plato_caja ya existe, añadir el item a la caja
          if (cajasMap.has(row.plato_caja_id)) {
            const caja = cajasMap.get(row.plato_caja_id);
            caja.dataMenuItem.push({
              id: row.plato_caja_item_id,
              nombre: row.plato_caja_item_nombre,
              precio: row.plato_caja_item_precio,
              tipo: row.plato_caja_item_tipo,
            });
          } else {
            // Si el plato_caja no existe, crear una nueva entrada
            const caja = {
              id: row.plato_caja_id,
              nombre: row.plato_caja_nombre,
              descripcion: row.plato_caja_descripcion,
              cantidad_maxima: row.plato_caja_cantidad_maxima,
              dataMenuItem: [
                {
                  id: row.plato_caja_item_id,
                  nombre: row.plato_caja_item_nombre,
                  precio: row.plato_caja_item_precio,
                  tipo: row.plato_caja_item_tipo,
                },
              ],
            };
            cajasMap.set(row.plato_caja_id, caja);
          }
        }
      });

      // Convertir el mapa a un array y añadirlo al plato si hay cajas
      const cajasArray = Array.from(cajasMap.values());
      plato.cajas = cajasArray;

      AddElement(plato);
      setModalDataItem(plato);
      setLoadingMenuItem(false);
    } catch (error) {
      console.log("Error, intentar más tarde: " + error.message);
    }
  };

  // Agrega un elemento al preCarrito, incrementando la cantidad si el elemento ya existe y su cantidad es menor a 10, o añadiéndolo con una cantidad de 1 si no existe.
  function AddElement(item) {
    setElement((prevElement) => {
      if (prevElement && prevElement.nombre === item.nombre) {
        if (prevElement.cantidad >= 10) {
          return prevElement;
        } else {
          const newTotal = (prevElement.cantidad + 1) * item.precio;
          return {
            ...prevElement,
            cantidad: prevElement.cantidad + 1,
            total: newTotal,
          };
        }
      } else {
        return {
          nombre: item.nombre,
          image: item.imagen_url,
          cantidad: 1,
          total: item.precio,
        };
      }
    });
  }

  // Elimina un elemento del preCarrito, decrementando la cantidad si es mayor a 1, o eliminándolo si la cantidad es 1.
  function RemoveElement(item) {
    setElement((prevElement) => {
      if (
        prevElement &&
        prevElement.nombre === item.nombre &&
        prevElement.cantidad > 1
      ) {
        const newTotal = (prevElement.cantidad - 1) * item.precio;
        return {
          ...prevElement,
          cantidad: prevElement.cantidad - 1,
          total: newTotal,
        };
      } else {
        return null;
      }
    });
  }

  // Calcula el total de los elementos en el carrito que cumplen con ciertos criterios, sumando el producto de la cantidad y el precio de cada elemento.
  function calculateTotal() {
    let total = 0;
    selectedBoxElements.forEach(
      (item) => item.tipo === "Valor" && (total += item.cantidad * item.precio)
    );
    return total;
  }

  return (
    <>
      <Card
        className="max-w-[350px] min-w-[290px] sm:max-w-full sm:min-w-full hover:scale-90 transform transition-transform duration-[0.2s] ease-in-out"
        shadow="sm"
        isPressable
        onPress={getMenuItem}
      >
        <CardBody className="overflow-visible p-0">
          <Image
            shadow="sm"
            radius="lg"
            width="100%"
            alt={item.nombre}
            className="object-cover h-[140px] w-full"
            src={item.imagen_url}
          />
        </CardBody>

        <CardFooter className="text-small justify-between">
          <b>{item.nombre}</b>
          <p className="text-default-500">
            {parseInt(item.precio).toLocaleString("es-CO", {
              style: "currency",
              currency: "COP",
            })}
          </p>
        </CardFooter>
      </Card>

      <ModalMenu
        isOpen={isOpen}
        onClose={onClose}
        modalDataItem={modalDataItem}
        selectedBoxElements={selectedBoxElements}
        setSelectedBoxElements={setSelectedBoxElements}
        element={element}
        setElement={setElement}
        AddElement={AddElement}
        RemoveElement={RemoveElement}
        calculateTotal={calculateTotal}
        loadingMenuItem={loadingMenuItem}
      />
    </>
  );
}
