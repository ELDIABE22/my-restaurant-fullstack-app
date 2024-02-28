import {
  Accordion,
  AccordionItem,
  Checkbox,
  CheckboxGroup,
} from "@nextui-org/react";
import { Fragment } from "react";
import PlusIcon from "./icons/PlusIcon";
import MinusIcon from "./icons/MinusIcon";

const AccordionMenu = ({
  boxData,
  selectedBoxElements,
  setSelectedBoxElements,
}) => {
  function AddBoxElements(element) {
    setSelectedBoxElements((prevElements) => {
      // Verificar si el objeto ya existe en prevElements
      const existingElement = prevElements.find(
        (prevElement) => prevElement._id === element._id
      );

      if (existingElement) {
        // Si existe, incrementar la propiedad cantidad en 1
        return prevElements.map((prevElement) =>
          prevElement._id === existingElement._id
            ? { ...prevElement, cantidad: prevElement.cantidad + 1 }
            : prevElement
        );
      } else {
        // Si no existe, agregar la propiedad cantidad con valor 1
        return [...prevElements, { ...element, cantidad: 1 }];
      }
    });
  }

  function RemoveBoxElements(element) {
    setSelectedBoxElements((prevElements) => {
      const existingElement = prevElements.find(
        (prevElement) => prevElement._id === element._id
      );

      if (existingElement) {
        return prevElements.map((prevElement) =>
          prevElement._id === existingElement._id
            ? { ...prevElement, cantidad: prevElement.cantidad - 1 }
            : prevElement
        );
      }
    });
  }
  console.log(selectedBoxElements);

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
            key={box._id}
            aria-label="Caja de elemento"
            title={box.name}
            subtitle={<span className="text-xs">{box.description}</span>}
          >
            {box.data.map((dataItem, index) => (
              <Fragment key={index}>
                {dataItem.typeSelect === "0" && (
                  <CheckboxGroup
                    color="warning"
                    value={selectedBoxElements}
                    onValueChange={setSelectedBoxElements}
                  >
                    <div className="flex justify-between py-6 px-4 border border-gray-800">
                      <span>{dataItem.name}</span>
                      <Checkbox
                        isDisabled={
                          selectedBoxElements.length > 0 &&
                          selectedBoxElements.length === box.maxLength &&
                          !selectedBoxElements.includes(dataItem)
                        }
                        value={dataItem}
                      />
                    </div>
                  </CheckboxGroup>
                )}

                {dataItem.typeSelect === "1" && (
                  <div className="flex justify-between py-2 px-4 border border-gray-800">
                    <div className="w-4/5">
                      <div>
                        <span className="text-sm lg:text-base font-light w-full">
                          {dataItem.name}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-light w-full text-gray-400">
                          + $ {dataItem.price}
                        </span>
                      </div>
                    </div>
                    <div className="w-1/5 flex justify-end items-center">
                      {selectedBoxElements.length > 0 ? (
                        selectedBoxElements.map((item) => (
                          <Fragment key={item._id}>
                            {item._id === dataItem._id && item.cantidad >= 1 ? (
                              <div className="flex justify-center items-center px-4 py-2 rounded-xl gap-5 border-2 border-orange-peel">
                                <div onClick={() => RemoveBoxElements(item)}>
                                  <MinusIcon />
                                </div>
                                <span>{item.cantidad}</span>
                                <div onClick={() => AddBoxElements(item)}>
                                  <PlusIcon />
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => AddBoxElements(item)}
                                className="text-white text-xl flex justify-center items-center h-6 w-6 rounded-full p-[5px] bg-orange-peel"
                              >
                                +
                              </button>
                            )}
                          </Fragment>
                        ))
                      ) : (
                        <button
                          onClick={() => AddBoxElements(dataItem)}
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
