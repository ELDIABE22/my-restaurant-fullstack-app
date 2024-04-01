/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button, Link, Spinner } from "@nextui-org/react";

import axios from "axios";
import CardMenuItem from "@/components/CardMenuItem";
import ArrowRightCircle from "@/components/icons/ArrowRightCircle";

const menuItems = () => {
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState([]);
  const [loadingMenuItems, setLoadingMenuItems] = useState(true);

  const { data: session, status } = useSession();

  const router = useRouter();

  const fetchDataMenuItems = async () => {
    try {
      const res = await axios.get("/api/profile/menu-items");
      const menuItems = res.data;

      const categoryPromises = menuItems.map(async (item) => {
        const categoryId = item.category;
        const categoryRes = await axios.get(`/api/category/${categoryId}`);
        return categoryRes.data;
      });

      const categoriesData = await Promise.all(categoryPromises);

      const itemsWithCategoryName = menuItems.map((item, index) => {
        return {
          ...item,
          category: categoriesData[index].name,
        };
      });

      const categoriesSet = new Set(
        itemsWithCategoryName.map((cat) => cat.category)
      );
      const categories = Array.from(categoriesSet).sort();

      setCategory(categories);
      setItems(itemsWithCategoryName);
      setLoadingMenuItems(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      if (session?.user.admin) {
        fetchDataMenuItems();
      } else {
        return router.push("/");
      }
    } else if (status === "unauthenticated") {
      return router.push("/");
    }
  }, [router, session?.user.admin, status]);

  return (
    <>
      {status === "loading" ? (
        <Spinner color="warning" className="flex justify-center" />
      ) : (
        <div className="flex flex-col justify-center items-center gap-5">
          <Button
            className="w-2/4"
            color="warning"
            variant="ghost"
            radius="none"
            as={Link}
            href="/profile/menu-items/new"
          >
            Crear nuevo elemento de menú
            <ArrowRightCircle />
          </Button>

          {loadingMenuItems ? (
            <Spinner label="Cargando elementos del menú..." color="warning" />
          ) : (
            <div>
              {category?.length > 0 ? (
                category.map((cat, index) => (
                  <div
                    key={index}
                    className="flex flex-col justify-center items-center mb-5"
                  >
                    <h2 className="text-2xl font-bold text-center border-b-1 mb-3">
                      {cat}
                    </h2>
                    <div className="flex gap-3 justify-center items-center flex-wrap">
                      {items.map(
                        (item) =>
                          item.category === cat && (
                            <CardMenuItem key={item._id} item={item} />
                          )
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div>No tienes elementos.</div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default menuItems;
