import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { useState } from "react";
import MinusIcon from "./icons/MinusIcon";
import PlusIcon from "./icons/PlusIcon";
import CleanIcon from "./icons/CleanIcon";
import AccordionMenu from "./AccordionMenu";

const ModalMenu = ({ isOpen, onClose }) => {
  const [amount, setAmount] = useState(1);

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
              Pizza Jamón y Queso
            </ModalHeader>
            <ModalBody>
              <div className="md:flex md:gap-3 md:h-screen md:overflow-hidden md:justify-around">
                {/* IMAGEN COMIDA ITEM */}
                <div className="flex justify-center md:w-2/4">
                  <div className="bg-pizza bg-cover bg-no-repeat bg-center min-h-[245px] min-w-[245px] max-h-[345px] max-w-[345px]" />
                </div>
                <div className="flex flex-col w-full md:w-2/4">
                  <div className="py-3">$ 22.000</div>
                  <div className="text-xs pb-3">
                    Pizza de jamón y queso tamaño grande
                  </div>
                  <div className="overflow-auto">
                    <AccordionMenu />
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
                Agregar al carrito
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalMenu;
