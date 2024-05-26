import PlusIcon from "./icons/PlusIcon";
import MinusIcon from "./icons/MinusIcon";
import { Fragment } from "react";
import {
  Accordion,
  AccordionItem,
  Checkbox,
  CheckboxGroup,
} from "@nextui-org/react";

const AccordionMenu = ({
  boxData,
  selectedBoxElements,
  setSelectedBoxElements,
}) => {
  // Agrega un elemento al carrito, incrementando la cantidad si el elemento ya existe y su cantidad es menor a 10, o añadiéndolo con una cantidad de 1 si no existe.
  function AddBoxElements(element, maxLength, idBox, selectedElementId) {
    if (element.tipo === "Sin valor") {
      setSelectedBoxElements((prevElements) => {
        const existingElementIndex = prevElements.findIndex(
          (prevElement) => prevElement.id === selectedElementId
        );

        if (existingElementIndex !== -1) {
          // Si el elemento ya existe, lo eliminamos
          return prevElements.filter(
            (prevElement, index) => index !== existingElementIndex
          );
        } else {
          // Si el elemento no existe, lo agregamos
          return [
            ...prevElements,
            {
              ...element,
              boxProperty: { idBox, maxLength },
            },
          ];
        }
      });
    } else {
      setSelectedBoxElements((prevElements) => {
        const existingElement = prevElements.find(
          (prevElement) => prevElement.id === element.id
        );

        if (existingElement) {
          const totalCantidad = prevElements.reduce(
            (sum, prevElement) =>
              prevElement.boxProperty?.idBox ===
              existingElement.boxProperty.idBox
                ? sum + prevElement.cantidad
                : sum,
            0
          );

          const maxLength = existingElement.boxProperty.cantidad_maxima;

          if (totalCantidad >= maxLength) {
            return prevElements;
          } else {
            // Verificar si la cantidad del elemento existente ya es 5
            if (existingElement.cantidad >= 5) {
              // Si la cantidad ya es 5, no hacer cambios
              return prevElements;
            } else {
              // Si la cantidad es menor que 5, incrementa la cantidad
              return prevElements.map((prevElement) =>
                prevElement.id === existingElement.id
                  ? { ...prevElement, cantidad: prevElement.cantidad + 1 }
                  : prevElement
              );
            }
          }
        } else {
          // Calcula la suma total de la propiedad cantidad para todos los elementos con el mismo idBox
          const totalCantidadForNewElement = prevElements.reduce(
            (sum, prevElement) =>
              prevElement.boxProperty?.idBox === idBox
                ? sum + prevElement.cantidad
                : sum,
            0
          );

          // Verifica si la suma total de la propiedad cantidad es menor que maxLength
          if (totalCantidadForNewElement >= maxLength) {
            // Si la suma total ya es igual o mayor que maxLength, no hacer cambios
            return prevElements;
          } else {
            // Si la suma total es menor que maxLength, agrega el objeto al estado con cantidad inicial de 1
            return [
              ...prevElements,
              {
                ...element,
                cantidad: 1,
                boxProperty: { idBox, maxLength },
              },
            ];
          }
        }
      });
    }
  }

  // Elimina un elemento del carrito, decrementando la cantidad si es mayor a 1, o eliminándolo si la cantidad es 1.
  function RemoveBoxElements(element) {
    setSelectedBoxElements((prevElements) => {
      const existingElementIndex = prevElements.findIndex(
        (prevElement) => prevElement.id === element.id
      );

      if (existingElementIndex !== -1) {
        // Si el elemento existe, reduce su cantidad en 1
        const updatedElement = {
          ...prevElements[existingElementIndex],
          cantidad: prevElements[existingElementIndex].cantidad - 1,
        };

        // Si la cantidad del elemento es 0 o menos, elimina el elemento
        if (updatedElement.cantidad <= 0) {
          return prevElements.filter(
            (prevElement) => prevElement.id !== element.id
          );
        } else {
          // Si la cantidad es mayor que 0, actualiza el elemento en el estado
          return prevElements.map((prevElement) =>
            prevElement.id === element.id ? updatedElement : prevElement
          );
        }
      }

      // Si el elemento no se encuentra, retorna el estado anterior sin cambios
      return prevElements;
    });
  }

  return (
    <Accordion
      selectionMode="multiple"
      variant="bordered"
      itemClasses={{
        title: "text-orange-peel",
        indicator: "text-orange-peel",
      }}
    >
      {boxData.length > 0 &&
        boxData.map((box) => (
          <AccordionItem
            key={box.id}
            aria-label="Caja de elemento"
            title={box.nombre}
            subtitle={<span className="text-xs">{box.descripcion}</span>}
          >
            {box.dataMenuItem.map((dataItem, index) => (
              <Fragment key={index}>
                {dataItem.tipo === "Sin valor" && (
                  <CheckboxGroup
                    color="warning"
                    value={selectedBoxElements.map((item) => item.id)}
                    onValueChange={() => {
                      const selectedElementId = dataItem.id;
                      AddBoxElements(
                        dataItem,
                        box.cantidad_maxima,
                        box.id,
                        selectedElementId
                      );
                    }}
                  >
                    <div className="flex justify-between py-6 px-4 border border-gray-800">
                      <span>{dataItem.nombre}</span>
                      <Checkbox
                        isDisabled={
                          selectedBoxElements.length > 0 &&
                          selectedBoxElements.filter(
                            (item) => item.boxProperty.idBox === box.id
                          ).length === box.cantidad_maxima &&
                          !selectedBoxElements.some(
                            (item) => item.id === dataItem.id
                          )
                        }
                        value={dataItem.id}
                      />
                    </div>
                  </CheckboxGroup>
                )}

                {dataItem.tipo === "Valor" && (
                  <div className="flex justify-between py-2 px-4 border border-gray-800">
                    <div className="w-4/5">
                      <div>
                        <span className="text-sm lg:text-base font-light w-full">
                          {dataItem.nombre}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-light w-full text-gray-400">
                          +{" "}
                          {dataItem.precio.toLocaleString("es-CO", {
                            style: "currency",
                            currency: "COP",
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="w-1/5 flex justify-end items-center">
                      {selectedBoxElements.some(
                        (selectedItem) => selectedItem?.id === dataItem.id
                      ) ? (
                        // Renderizar botones de incremento y decremento si el elemento está seleccionado
                        <div className="flex items-center space-x-4">
                          <div
                            onClick={() => RemoveBoxElements(dataItem)}
                            className="cursor-pointer"
                          >
                            <MinusIcon />
                          </div>
                          <span>
                            {
                              selectedBoxElements.find(
                                (el) => el.id === dataItem.id
                              ).cantidad
                            }
                          </span>
                          <div
                            onClick={() =>
                              AddBoxElements(
                                dataItem,
                                box.cantidad_maxima,
                                box.id
                              )
                            }
                            className="cursor-pointer"
                          >
                            <PlusIcon />
                          </div>
                        </div>
                      ) : (
                        // Renderizar botón de adición si el elemento no está seleccionado
                        <button
                          onClick={() =>
                            AddBoxElements(
                              dataItem,
                              box.cantidad_maxima,
                              box.id
                            )
                          }
                          className="text-white text-xl flex justify-center items-center h-6 w-6 rounded-full p-[5px] bg-orange-peel"
                        >
                          +
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </Fragment>
            ))}
          </AccordionItem>
        ))}
    </Accordion>
  );
};

export default AccordionMenu;
