import {
  Accordion,
  AccordionItem,
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
} from "@nextui-org/react";

const AccordionMenuItem = ({ items, setItems }) => {
  const type = ["Caja", "Botón"];

  function addItems() {
    setItems((items) => {
      return [...items, { name: "", price: 0, maxLength: 0, type: "" }];
    });
  }

  function editItems(e, index, prop) {
    const newValue = e.target.value;
    setItems((prevItems) => {
      const newItems = [...prevItems];
      newItems[index][prop] = newValue;
      return newItems;
    });
  }

  console.log(items);

  return (
    <Accordion
      selectionMode="multiple"
      variant="bordered"
      itemClasses={{
        title: "text-orange-peel",
        indicator: "text-orange-peel",
      }}
    >
      <AccordionItem key="1" aria-label="Personalizala" title="Personalizala">
        <div className="flex flex-col gap-3">
          {items?.length > 0 &&
            items.map((i, index) => (
              <div key={index} className="grid grid-cols-2 gap-2">
                <Input
                  type="text"
                  label="Nombre"
                  color="warning"
                  variant="bordered"
                  autoComplete="off"
                  isClearable
                  value={i.name}
                  onChange={(e) => editItems(e, index, "name")}
                />
                <Input
                  type="number"
                  label="Precio"
                  color="warning"
                  variant="bordered"
                  autoComplete="off"
                  isClearable
                  value={i.price}
                  onChange={(e) => editItems(e, index, "price")}
                />
                <Input
                  type="number"
                  label="Cantidad máxima"
                  color="warning"
                  variant="bordered"
                  autoComplete="off"
                  isClearable
                  value={i.maxLength}
                  onChange={(e) => editItems(e, index, "maxLength")}
                />
                <Autocomplete
                  label="Seleccionar selector"
                  color="warning"
                  variant="bordered"
                  onChange={(e) => editItems(e, index, "type")}
                >
                  {type.map((select, subIndex) => (
                    <AutocompleteItem key={subIndex}>{select}</AutocompleteItem>
                  ))}
                </Autocomplete>
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
              onPress={addItems}
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
            >
              Eliminar caja
            </Button>
          </div>
        </div>
      </AccordionItem>
    </Accordion>
  );
};

export default AccordionMenuItem;
