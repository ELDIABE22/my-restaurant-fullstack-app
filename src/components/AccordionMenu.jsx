import { Accordion, AccordionItem, Checkbox } from "@nextui-org/react";

const AccordionMenu = () => {
  const defaultContent =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

  return (
    <Accordion
      selectionMode="multiple"
      variant="bordered"
      itemClasses={{
        title: "text-orange-peel",
        indicator: "text-orange-peel",
      }}
    >
      <AccordionItem
        key="1"
        aria-label="Accordion 1"
        title="Personalizala"
        subtitle={<span className="text-xs">Selecciona máximo 2 opciones</span>}
      >
        <div>
          <div className="flex justify-between py-6 px-4 border border-gray-800">
            <span>Sin cebolla</span>
            <Checkbox color="warning" />
          </div>
          <div className="flex justify-between py-6 px-4 border border-gray-800">
            <span>Sin mostaza</span>
            <Checkbox color="warning" />
          </div>
        </div>
      </AccordionItem>
      <AccordionItem
        key="2"
        aria-label="Accordion 2"
        title="Adiciones"
        subtitle={
          <span className="text-xs">Selecciona máximo 11 opciones</span>
        }
      >
        <div>
          <div className="flex justify-between py-2 px-4 border border-gray-800">
            <div className="w-4/5">
              <div>
                <span className="text-sm lg:text-base font-light w-full">
                  Ad. tajada de queso tipo mozarel
                </span>
              </div>
              <div>
                <span className="text-sm font-light w-full text-gray-400">
                  + $ 4.000
                </span>
              </div>
            </div>
            <div className="w-1/5 flex justify-end items-center">
              <button className="text-white text-xl flex justify-center items-center h-6 w-6 rounded-full p-[5px] bg-orange-peel">
                +
              </button>
            </div>
          </div>
          <div className="flex justify-between py-2 px-4 border border-gray-800">
            <div className="w-4/5">
              <div>
                <span className="text-sm lg:text-base font-light w-full">
                  Ad. piña
                </span>
              </div>
              <div>
                <span className="text-sm font-light w-full text-gray-400">
                  + $ 6.000
                </span>
              </div>
            </div>
            <div className="w-1/5 flex justify-end items-center">
              <button className="text-white text-xl flex justify-center items-center h-6 w-6 rounded-full p-[5px] bg-orange-peel">
                +
              </button>
            </div>
          </div>
          <div className="flex justify-between py-2 px-4 border border-gray-800">
            <div className="w-4/5">
              <div>
                <span className="text-sm lg:text-base font-light w-full">
                  Ad. pepino
                </span>
              </div>
              <div>
                <span className="text-sm font-light w-full text-gray-400">
                  + $ 5.000
                </span>
              </div>
            </div>
            <div className="w-1/5 flex justify-end items-center">
              <button className="text-white text-xl flex justify-center items-center h-6 w-6 rounded-full p-[5px] bg-orange-peel">
                +
              </button>
            </div>
          </div>
        </div>
      </AccordionItem>
      <AccordionItem
        key="3"
        aria-label="Accordion 3"
        title="Accordion 3"
        subtitle={<span className="text-xs">Press to expand</span>}
      >
        {defaultContent}
      </AccordionItem>
    </Accordion>
  );
};

export default AccordionMenu;
