"use client";

import axios from "axios";
import CardMenu from "@/components/CardMenu";
import { Spinner } from "@nextui-org/react";
import { useEffect, useState } from "react";

const MenuPage = () => {
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState([]);
  const [loadingMenuItems, setLoadingMenuItems] = useState(true);

  // Recupera los elementos del menú, obtiene sus categorías correspondientes, y actualiza el estado con las categorías y los elementos del menú con sus nombres de categoría.
  const fetchDataMenuItems = async () => {
    try {
      const res = await axios.get("/api/profile/menu-items");
      const menuItems = res.data;

      const categoryPromises = menuItems.map(async (item) => {
        const categoryId = item.categoriaId;
        const categoryRes = await axios.get(`/api/category/${categoryId}`);
        return categoryRes.data;
      });

      const categoriesData = await Promise.all(categoryPromises);

      const flatCategoriesData = categoriesData.flat();

      const itemsWithCategoryName = menuItems.map((item, index) => {
        return {
          ...item,
          categoriaId: flatCategoriesData[index].nombre,
        };
      });

      const categoriesSet = new Set(
        itemsWithCategoryName.map((cat) => cat.categoriaId)
      );

      const categories = Array.from(categoriesSet).sort();

      setCategory(categories);
      setItems(itemsWithCategoryName);
      setLoadingMenuItems(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  // Ejecuta la función fetchDataMenuItems
  useEffect(() => {
    fetchDataMenuItems();
  }, []);

  return (
    <section className="container mx-auto m-5 px-5">
      {loadingMenuItems ? (
        <Spinner
          label="Cargando menú..."
          color="warning"
          className="flex justify-center"
        />
      ) : (
        <>
          {category.length > 0 ? (
            category.map((cat, index) => (
              <div className="mb-4 pb-3" key={index}>
                <div className="border-b-2 mb-4 pb-3">
                  <h2 className="font-bold text-2xl text-center sm:text-start">
                    {cat}
                  </h2>
                </div>
                <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center">
                  {items.length > 0 &&
                    items.map(
                      (item) =>
                        item.categoriaId === cat && (
                          <CardMenu key={item.id} item={item} />
                        )
                    )}
                </div>
              </div>
            ))
          ) : (
            <div>No hay elementos en el menú.</div>
          )}
        </>
      )}
    </section>
  );
};

export default MenuPage;
