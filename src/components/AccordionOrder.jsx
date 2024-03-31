import { Accordion, AccordionItem, Divider, Image } from "@nextui-org/react";
import { Fragment } from "react";
import CleanIcon from "./icons/CleanIcon";
import { useOrder } from "@/context/OrderContext";

const AccordionOrder = () => {
  const { cart, removeCartProductsToLocalStorage } = useOrder();

  return (
    <Accordion variant="splitted" style={{ padding: 0 }}>
      <AccordionItem
        key="1"
        aria-label="Order"
        title="Tu orden"
        subtitle={`${cart.products?.length} ${
          cart.products?.length === 1 ? "producto" : "productos"
        }`}
        className="text-xl font-semibold w-full"
      >
        {cart.products?.length > 0 ? (
          cart.products?.map((order, index) => (
            <div key={index} className="flex flex-col">
              <div className="flex justify-between p-4">
                <div className="flex justify-items-start gap-3">
                  <div className="flex items-center">
                    <div
                      onClick={() => removeCartProductsToLocalStorage(order)}
                    >
                      <CleanIcon />
                    </div>
                  </div>
                  <div>
                    <Image
                      shadow="sm"
                      radius="lg"
                      width="100%"
                      alt={order.name}
                      className="object-cover h-[100px] w-[100px]"
                      src={order.image}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-semibold">{order.name}</p>
                    <span className="text-sm font-semibold">
                      {order.total.toLocaleString("es-CO", {
                        style: "currency",
                        currency: "COP",
                      })}
                    </span>
                    {order.additions.length > 0 && (
                      <span className="text-[10px] text-slate-500">
                        {order.additions.map((add, index) => (
                          <Fragment key={add.name}>
                            {add.name}
                            {index < order.additions.length - 1 && " · "}
                          </Fragment>
                        ))}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <p>{order.amount}u</p>
                </div>
              </div>
              {index < cart.length - 1 && <Divider />}
            </div>
          ))
        ) : (
          <p>No tienes productos.</p>
        )}
      </AccordionItem>
    </Accordion>
  );
};

export default AccordionOrder;
