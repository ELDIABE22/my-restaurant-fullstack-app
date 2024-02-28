import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Image,
} from "@nextui-org/react";
import { useState } from "react";
import MinusIcon from "./icons/MinusIcon";
import PlusIcon from "./icons/PlusIcon";
import CleanIcon from "./icons/CleanIcon";
import AccordionMenu from "./AccordionMenu";
import { useOrder } from "@/context/OrderContext";

const ModalMenu = ({ isOpen, onClose, modalDataItem }) => {
  const [selectedBoxElements, setSelectedBoxElements] = useState([]);
  const [amount, setAmount] = useState(1);

  const { orders } = useOrder();
  console.log(orders);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
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
                    $ {modalDataItem.price.toLocaleString()}
                  </div>
                  <div className="text-xs pb-3">
                    {modalDataItem.description}
                  </div>
                  <div className="overflow-auto">
                    {modalDataItem.itemBox.length > 0 && (
                      <AccordionMenu
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
                {amount === 1 ? (
                  <CleanIcon
                    setAmount={setAmount}
                    amount={amount}
                    onClose={onClose}
                  />
                ) : (
                  <MinusIcon setAmount={setAmount} amount={amount} />
                )}
                <span>{amount}</span>
                <PlusIcon setAmount={setAmount} amount={amount} />
              </div>
              <Button color="success" className="text-white" onPress={onClose}>
                Agregar al carrito {modalDataItem.price}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalMenu;
