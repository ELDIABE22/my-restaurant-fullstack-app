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
}) => {
  const typeSelect = ["Caja", "Botón"];

  // función para agregar elemento (INPUT: name, typeSelect y price)
  function addItems(boxIndex) {
    setBoxItem((box) => {
      return box.map((item, index) => {
        if (index === boxIndex) {
          return {
            ...item,
            data: [
              ...item.data,
              {
                name: "",
                price: "",
                typeSelect: "",
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
    if (prop === "typeSelect") {
      let newValue;

      if (e === null) {
        newValue = "";
      } else {
        newValue = e;
      }

      setBoxItem((prevItems) => {
        const newItems = [...prevItems];
        if (newValue === "0" || newValue === "") {
          newItems[boxIndex].data[index]["price"] = "";
          newItems[boxIndex].data[index][prop] = newValue;
        } else {
          newItems[boxIndex].data[index][prop] = newValue;
        }
        return newItems;
      });
    } else {
      let newValue = e.target.value;

      setBoxItem((prevItems) => {
        const newItems = [...prevItems];
        newItems[boxIndex].data[index][prop] = newValue;
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
            data: item.data.filter((v, subIndex) => subIndex !== indexToRemove),
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
    if (prop === "price") {
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
    if (prop === "name") {
      return errors?.find(
        (error) =>
          error.path[0] === "itemBox" &&
          error.path[1] === boxIndex &&
          error.path[2] === "data" &&
          error.path[3] === index &&
          error.path[4] === prop
      )?.message.boxDataName;
    } else if (prop === "price") {
      return errors?.find(
        (error) =>
          error.path.length === 4 &&
          error.path[0] === "itemBox" &&
          error.path[1] === boxIndex &&
          error.path[2] === "data" &&
          error.path[3] === index
      )?.message.boxDataPrice;
    } else if (prop === "typeSelect") {
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
        selectionMode="multiple"
        variant="bordered"
        itemClasses={{
          title: "text-orange-peel",
          indicator: "text-orange-peel",
        }}
      >
        <AccordionItem key={boxIndex} aria-label={box.name} title={box.name}>
          <div className="flex flex-col gap-3">
            {box.data.length > 0 &&
              box.data.map((data, index) => (
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
                      value={data.name}
                      onChange={(e) => editItems(e, index, boxIndex, "name")}
                      isInvalid={hasError(error, boxIndex, index, "name")}
                      errorMessage={findErrorMessage(
                        error,
                        boxIndex,
                        index,
                        "name"
                      )}
                    />
                    {data.typeSelect === "1" ? (
                      <Input
                        type="number"
                        label="Precio"
                        color="warning"
                        variant="bordered"
                        autoComplete="off"
                        value={data.price}
                        onChange={(e) => editItems(e, index, boxIndex, "price")}
                        isInvalid={hasError(error, boxIndex, index, "price")}
                        errorMessage={findErrorMessage(
                          error,
                          boxIndex,
                          index,
                          "price"
                        )}
                      />
                    ) : (
                      ""
                    )}
                    <Autocomplete
                      label="Seleccionar selector"
                      color="warning"
                      variant="bordered"
                      selectedKey={data.typeSelect}
                      onSelectionChange={(e) =>
                        editItems(e, index, boxIndex, "typeSelect")
                      }
                      isInvalid={hasError(error, boxIndex, index, "typeSelect")}
                      errorMessage={findErrorMessage(
                        error,
                        boxIndex,
                        index,
                        "typeSelect"
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
