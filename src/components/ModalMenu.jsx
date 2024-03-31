import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Image,
} from "@nextui-org/react";
import { v4 as uuidv4 } from "uuid";
import MinusIcon from "./icons/MinusIcon";
import PlusIcon from "./icons/PlusIcon";
import CleanIcon from "./icons/CleanIcon";
import AccordionMenu from "./AccordionMenu";
import { useOrder } from "@/context/OrderContext";
import toast from "react-hot-toast";

const ModalMenu = ({
  isOpen,
  onClose,
  item,
  modalDataItem,
  selectedBoxElements,
  setSelectedBoxElements,
  element,
  setElement,
  AddElement,
  RemoveElement,
  calculateTotal,
}) => {
  const { cart, saveCartProductsToLocalStorage } = useOrder();

  // Actualiza el carrito con el elemento seleccionado y muestra un mensaje de éxito
  function handleAddToLocalStorage(onClose) {
    const updatedElement = {
      id: uuidv4(),
      ...element,
      additions: selectedBoxElements,
      total: element.total + calculateTotal(),
    };

    const updatedOrder = {
      ...cart,
      products: [...cart.products, updatedElement],
    };

    saveCartProductsToLocalStorage(updatedOrder);

    toast.success("Agregado al carrito");

    onClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        setSelectedBoxElements([]);
        setElement({});
      }}
      placement="bottom-center"
      size="5xl"
      scrollBehavior="inside"
      classNames={{
        base: "bg-black text-white",
        header: "border-b-[1px]",
        footer: "border-t-[1px]",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-center text-orange-peel">
              {modalDataItem.name}
            </ModalHeader>
            <ModalBody>
              <div className="md:flex md:gap-3 md:h-screen md:overflow-hidden md:justify-around">
                {/* IMAGEN COMIDA ITEM */}
                <div className="flex justify-center items-center md:w-2/4">
                  <Image
                    shadow="sm"
                    radius="lg"
                    width="100%"
                    alt={modalDataItem.name}
                    className="w-full object-cover min-h-[245px] max-h-[345px] max-w-[345px]"
                    src={modalDataItem.image.url}
                  />
                </div>
                <div className="flex flex-col w-full md:w-2/4">
                  <div className="py-3">
                    {modalDataItem.price.toLocaleString("es-CO", {
                      style: "currency",
                      currency: "COP",
                    })}
                  </div>
                  <div className="text-xs pb-3">
                    {modalDataItem.description}
                  </div>
                  <div className="overflow-auto">
                    {modalDataItem.itemBox.length > 0 && (
                      <AccordionMenu
                        modalDataItem={modalDataItem}
                        boxData={modalDataItem.itemBox}
                        selectedBoxElements={selectedBoxElements}
                        setSelectedBoxElements={setSelectedBoxElements}
                      />
                    )}
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <div className="flex justify-center items-center px-4 py-2 rounded-xl gap-5 border-2 border-orange-peel">
                {element.amount === 1 ? (
                  <div onClick={onClose}>
                    <CleanIcon />
                  </div>
                ) : (
                  <div onClick={() => RemoveElement(item)}>
                    <MinusIcon />
                  </div>
                )}
                <span>{element.amount}</span>
                <div onClick={() => AddElement(item)}>
                  <PlusIcon />
                </div>
              </div>
              <Button
                color="success"
                className="text-white"
                onPress={() => handleAddToLocalStorage(onClose)}
              >
                Agregar al carrito{" "}
                {(element.total + calculateTotal()).toLocaleString()}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalMenu;
