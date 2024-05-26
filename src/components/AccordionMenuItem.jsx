import {
  Accordion,
  AccordionItem,
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
} from "@nextui-org/react";
import CleanIcon from "./icons/CleanIcon";
import toast from "react-hot-toast";

const AccordionMenuItem = ({
  box,
  setBoxItem,
  boxIndex,
  handleOpenModal,
  setEditBox,
  error,
  setError,
  handleOpenModalDelete,
  deleteEvent,
  updateItem,
  savingItem,
}) => {
  const typeSelect = ["Sin valor", "Valor"];

  const allKeysDisabled = savingItem || updateItem || deleteEvent;

  // función para agregar elemento (INPUT: name, typeSelect y price)
  function addItems(boxIndex) {
    setBoxItem((box) => {
      return box.map((item, index) => {
        if (index === boxIndex) {
          return {
            ...item,
            dataMenuItem: [
              ...item.dataMenuItem,
              {
                nombre: "",
                precio: "",
                tipo: "Sin valor",
              },
            ],
          };
        } else {
          return item;
        }
      });
    });
  }

  // función para editar elementos
  function editItems(e, index, boxIndex, prop) {
    if (prop === "tipo") {
      let newValue;

      if (e === null) {
        newValue = "";
      } else {
        newValue = e === "1" ? "Valor" : "Sin valor";
      }

      setBoxItem((prevItems) => {
        const newItems = [...prevItems];
        if (newValue === "Sin valor" || newValue === "") {
          newItems[boxIndex].dataMenuItem[index]["precio"] = "";
          newItems[boxIndex].dataMenuItem[index][prop] = newValue;
        } else {
          newItems[boxIndex].dataMenuItem[index][prop] = newValue;
        }
        return newItems;
      });
    } else {
      let newValue = e.target.value;

      setBoxItem((prevItems) => {
        const newItems = [...prevItems];
        newItems[boxIndex].dataMenuItem[index][prop] = newValue;
        return newItems;
      });
    }
  }

  // función para eliminar elementos
  function removeItem(indexToRemove, boxIndex) {
    setBoxItem((box) => {
      return box.map((item, index) => {
        if (index === boxIndex) {
          return {
            ...item,
            dataMenuItem: item.dataMenuItem.filter(
              (v, subIndex) => subIndex !== indexToRemove
            ),
          };
        } else {
          return item;
        }
      });
    });

    toast.success("Campos de entrada eliminados");
    setError(null);
  }

  // función para eliminar caja de elementos
  function removeBox(indexToRemove) {
    setBoxItem((prev) => prev.filter((v, index) => index !== indexToRemove));
    toast.success("Caja eliminada");
  }

  // función para verificar si existe un error en la caja de elementos
  function hasError(errors, boxIndex, index, prop) {
    if (prop === "precio") {
      return errors?.some(
        (error) =>
          error.path[0] === "itemBox" &&
          error.path[1] === boxIndex &&
          error.path[2] === "data" &&
          error.path[3] === index
      );
    } else {
      return errors?.some(
        (error) =>
          error.path[0] === "itemBox" &&
          error.path[1] === boxIndex &&
          error.path[2] === "data" &&
          error.path[3] === index &&
          error.path[4] === prop
      );
    }
  }

  // función para obtener mensaje de error de la caja de elementos
  function findErrorMessage(errors, boxIndex, index, prop) {
    if (prop === "nombre") {
      return errors?.find(
        (error) =>
          error.path[0] === "itemBox" &&
          error.path[1] === boxIndex &&
          error.path[2] === "data" &&
          error.path[3] === index &&
          error.path[4] === prop
      )?.message.boxDataName;
    } else if (prop === "precio") {
      return errors?.find(
        (error) =>
          error.path.length === 4 &&
          error.path[0] === "itemBox" &&
          error.path[1] === boxIndex &&
          error.path[2] === "data" &&
          error.path[3] === index
      )?.message.boxDataPrice;
    } else if (prop === "tipo") {
      return errors?.find(
        (error) =>
          error.path[0] === "itemBox" &&
          error.path[1] === boxIndex &&
          error.path[2] === "data" &&
          error.path[3] === index &&
          error.path[4] === prop
      )?.message.typeSelect;
    }
  }

  return (
    <>
      <Accordion
        disabledKeys={allKeysDisabled ? ["0", "1", "2", "3", "4"] : []}
        selectionMode="multiple"
        variant="bordered"
        itemClasses={{
          title: "text-orange-peel",
          indicator: "text-orange-peel",
        }}
      >
        <AccordionItem
          key={boxIndex}
          aria-label={box.nombre}
          title={box.nombre}
        >
          <div className="flex flex-col gap-3">
            {box.dataMenuItem.length > 0 &&
              box.dataMenuItem.map((data, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 max-w-[460px]"
                >
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="text"
                      label="Nombre"
                      color="warning"
                      variant="bordered"
                      autoComplete="off"
                      value={data.nombre}
                      onChange={(e) => editItems(e, index, boxIndex, "nombre")}
                      isInvalid={hasError(error, boxIndex, index, "nombre")}
                      errorMessage={findErrorMessage(
                        error,
                        boxIndex,
                        index,
                        "nombre"
                      )}
                    />
                    {data.tipo === "Valor" && (
                      <Input
                        type="number"
                        label="Precio"
                        color="warning"
                        variant="bordered"
                        autoComplete="off"
                        value={data.precio}
                        onChange={(e) =>
                          editItems(e, index, boxIndex, "precio")
                        }
                        isInvalid={hasError(error, boxIndex, index, "precio")}
                        errorMessage={findErrorMessage(
                          error,
                          boxIndex,
                          index,
                          "precio"
                        )}
                      />
                    )}
                    <Autocomplete
                      label="Seleccionar selector"
                      color="warning"
                      variant="bordered"
                      selectedKey={data.tipo === "Valor" ? "1" : "0"}
                      onSelectionChange={(e) =>
                        editItems(e, index, boxIndex, "tipo")
                      }
                      isInvalid={hasError(error, boxIndex, index, "tipo")}
                      errorMessage={findErrorMessage(
                        error,
                        boxIndex,
                        index,
                        "tipo"
                      )}
                    >
                      {typeSelect.map((select, subIndex) => (
                        <AutocompleteItem key={subIndex}>
                          {select}
                        </AutocompleteItem>
                      ))}
                    </Autocomplete>
                  </div>
                  <div>
                    <Button
                      isIconOnly
                      onClick={() =>
                        handleOpenModalDelete(
                          "¿Eliminar campos de entrada?",
                          removeItem,
                          boxIndex,
                          index
                        )
                      }
                    >
                      <CleanIcon />
                    </Button>
                  </div>
                </div>
              ))}

            <div className="flex gap-3">
              <Button
                type="button"
                color="warning"
                size="lg"
                variant="ghost"
                radius="none"
                className="w-full"
                onPress={() => addItems(boxIndex)}
              >
                Agregar opción
              </Button>
              <Button
                type="button"
                color="primary"
                size="lg"
                radius="none"
                variant="shadow"
                className="w-full"
                onPress={() => {
                  handleOpenModal();
                  setEditBox(boxIndex);
                }}
              >
                Editar caja
              </Button>
              <Button
                type="button"
                color="danger"
                size="lg"
                variant="shadow"
                radius="none"
                className="w-full"
                onPress={() =>
                  handleOpenModalDelete(
                    "¿Eliminar caja?",
                    removeBox,
                    boxIndex,
                    null
                  )
                }
              >
                Eliminar caja
              </Button>
            </div>
          </div>
        </AccordionItem>
      </Accordion>
    </>
  );
};

export default AccordionMenuItem;
