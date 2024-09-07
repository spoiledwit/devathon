/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useState } from "react";
import React from "react";
import axios from "axios";
import HomeItem from "@/components/HomeItem";
import useAuthStore from "@/store/authStore";
import { useLocation } from "react-router-dom";

interface Props {
  title: React.ReactNode;
  description: string;
}

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Recommendations = ({ title, description }: Props) => {
  const query = useQuery();
  const region = query.get("region");
  const checkIn = query.get("checkIn");
  const checkOut = query.get("checkOut");
  const guests = query.get("guests");
  const [items, setItems] = useState<any[]>([]);
  const { user, appendToWishlist, removeFromWishlist } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  const checkIfInWishlist = (id: string) => {
    if (!user) return false;
    //@ts-ignore
    const isWishlisted = user.wishlist.includes(id);
    return isWishlisted;
  };

  const handleWishlist = async (id: string) => {
    setUpdating(true);
    if (!user?._id) return;
    try {
      if (checkIfInWishlist(id)) {
        removeFromWishlist(id);
        await axios.post(
          `${import.meta.env.VITE_BASE_URI}/auth/wishlist/remove/${id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setUpdating(false);
      } else {
        appendToWishlist(id);
        await axios.post(
          `${import.meta.env.VITE_BASE_URI}/auth/wishlist/append/${id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setUpdating(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [region, checkIn, checkOut, guests]);

  const queryBuilder = () => {
    const query: any = {};

    if (region) {
      query.region = region;
    }
    if (checkIn) {
      query.checkIn = checkIn;
    }
    if (checkOut) {
      query.checkOut = checkOut;
    }

    if (guests) {
      query.guests = guests;
    }

    return new URLSearchParams(query).toString();
  };

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URI}/item?${queryBuilder()}`
      );
      setItems(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center w-full mb-24">
      <div className=" min-w-xs flex-wrap flex  gap-10   justify-start items-center px-5 ">
        {loading && (
          <div className="flex flex-col gap-3 ">
            <div className="h-[200px] bg-gray-100/20 dark:bg-gray-200 w-[260px] rounded-xl" />
            <div className="h-[50px] bg-gray-100/20 dark:bg-gray-200 w-[260px] rounded-xl" />
          </div>
        )}
        {!loading && items.length === 0 && <p>No items found.</p>}
        {!loading &&
          items.map((item, index) => <HomeItem key={index} item={item} />)}
      </div>
    </div>
  );
};

export default Recommendations;
