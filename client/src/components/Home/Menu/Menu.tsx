import { useState, useRef } from "react";
import Styles from "./Menu.module.css";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
// import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { categories } from "@/constants";

export const cats = [
  {
    name: "Rooms",
    img: "https://a0.muscache.com/pictures/7630c83f-96a8-4232-9a10-0398661e2e6f.jpg",
    _id: 1,
  },
  {
    name: "Bread & Breakfast",
    img: "https://a0.muscache.com/pictures/5ed8f7c7-2e1f-43a8-9a39-4edfc81a3325.jpg",
    _id: 2,
  },
  {
    name: "Islands",
    img: "https://a0.muscache.com/pictures/8e507f16-4943-4be9-b707-59bd38d56309.jpg",
    _id: 3,
  },
  {
    name: "Lakes",
    img: "https://a0.muscache.com/pictures/a4634ca6-1407-4864-ab97-6e141967d782.jpg",
    _id: 4,
  },
  {
    name: "OMG!",
    img: "https://a0.muscache.com/pictures/c5a4f6fc-c92c-4ae8-87dd-57f1ff1b89a6.jpg",
    _id: 4,
  },
  {
    name: "Mensions",
    img: "https://a0.muscache.com/pictures/78ba8486-6ba6-4a43-a56d-f556189193da.jpg",
    _id: 4,
  },
  {
    name: "Camping",
    img: "https://a0.muscache.com/pictures/ca25c7f3-0d1f-432b-9efa-b9f5dc6d8770.jpg",
    _id: 4,
  },
  {
    name: "Countryside",
    img: "https://a0.muscache.com/pictures/6ad4bd95-f086-437d-97e3-14d12155ddfe.jpg",
    _id: 4,
  },
  {
    name: "Luxe",
    img: "https://a0.muscache.com/pictures/c8e2ed05-c666-47b6-99fc-4cb6edcde6b4.jpg",
    _id: 4,
  },
  {
    name: "Trending",
    img: "https://a0.muscache.com/pictures/3726d94b-534a-42b8-bca0-a0304d912260.jpg",
    _id: 4,
  },
  {
    name: "Amazing pools",
    img: "https://a0.muscache.com/pictures/3fb523a0-b622-4368-8142-b5e03df7549b.jpg",
    _id: 4,
  },
  {
    name: "Lakefront",
    img: "https://a0.muscache.com/pictures/677a041d-7264-4c45-bb72-52bff21eb6e8.jpg",
    _id: 4,
  },
  {
    name: "Caves",
    img: "https://a0.muscache.com/pictures/4221e293-4770-4ea8-a4fa-9972158d4004.jpg",
    _id: 4,
  },
  {
    name: "New",
    img: "https://a0.muscache.com/pictures/c0fa9598-4e37-40f3-b734-4bd0e2377add.jpg",
    _id: 4,
  },
  {
    name: "Arctic",
    img: "https://a0.muscache.com/pictures/8b44f770-7156-4c7b-b4d3-d92549c8652f.jpg",
    _id: 4,
  },
  {
    name: "Castles",
    img: "https://a0.muscache.com/pictures/1b6a8b70-a3b6-48b5-88e1-2243d9172c06.jpg",
    _id: 4,
  },
  {
    name: "Tiny homes",
    img: "https://a0.muscache.com/pictures/3271df99-f071-4ecf-9128-eb2d2b1f50f0.jpg",
    _id: 4,
  },
  {
    name: "Earth homes",
    img: "https://a0.muscache.com/pictures/d7445031-62c4-46d0-91c3-4f29f9790f7a.jpg",
    _id: 4,
  },
  {
    name: "Cycladic homes",
    img: "https://a0.muscache.com/pictures/e4b12c1b-409b-4cb6-a674-7c1284449f6e.jpg",
    _id: 4,
  },
  {
    name: "Ryokans",
    img: "https://a0.muscache.com/pictures/827c5623-d182-474a-823c-db3894490896.jpg",
    _id: 4,
  },
  {
    name: "Treehouses",
    img: "https://a0.muscache.com/pictures/4d4a4eba-c7e4-43eb-9ce2-95e1d200d10e.jpg",
    _id: 4,
  },
  {
    name: "Tropical",
    img: "https://a0.muscache.com/pictures/ee9e2a40-ffac-4db9-9080-b351efc3cfc4.jpg",
    _id: 4,
  },
  {
    name: "Golfing",
    img: "https://a0.muscache.com/pictures/6b639c8d-cf9b-41fb-91a0-91af9d7677cc.jpg",
    _id: 4,
  },
];

function Menu() {

  const [Menu, setMenu] = useState(categories);
  const menuRef = useRef(null);

  const scrollLeft = () => {
    //@ts-ignore
    menuRef.current.scrollTo({
      //@ts-ignore
      left: menuRef.current.scrollLeft - 300,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    //@ts-ignore
    menuRef.current.scrollTo({
      //@ts-ignore
      left: menuRef.current.scrollLeft + 300,
      behavior: "smooth",
    });
  };

  const [showOverlay, setShowOverlay] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);

  return (
    <div className="h-10 py-10 flex items-center font-medium my-2 relative bg-white">
      {showOverlay ? <div className="overlay" /> : null}
      <AnimatePresence>
        {!Menu && (
          <motion.div
            className="h-10 py-6 pl-3 flex items-center font-medium gap-6 relative bg-white overflow-hidden"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {Array(10)
              .fill(0)
              .map(() => (
                // <Skeleton key={i} className="min-w-[120px] h-[30px]" />
                <p>Loading..</p>
              ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {Menu && (
          <motion.div
            className={`${Styles.menuDiv} gap-10`}
            ref={menuRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* @ts-ignore */}
            {Menu?.map((cat: any, index: number) => (
              <motion.div
                key={index}
                className="cursor-pointer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Link
                  to={`/events/category/${cat.name.replace(/ /g, "-").toLowerCase()}`}
                  className="flex gap-2 items-center">
                  <div
                    className="flex flex-col items-center gap-1 justify-center"
                    onTouchStart={() => setIsScrolling(false)}
                    onTouchMove={() => setIsScrolling(true)}
                  >
                    <img src={cat.img} alt={cat.name} className="w-6" />
                    <h2 className="text-xs text-gray-600 whitespace-nowrap">{cat.name}</h2>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {Menu && (
        <motion.div
          className="border rounded-full p-0.5 absolute left-0 cursor-pointer hover:bg-gray-50 hover:shadow-md border-gray-400"
          onClick={scrollLeft}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FiChevronLeft className="text-lg" />
        </motion.div>
      )}
      {Menu && (
        <motion.div
          className="border rounded-full p-0.5 absolute right-0 cursor-pointer hover:bg-gray-50 hover:shadow-md border-gray-400"
          onClick={scrollRight}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FiChevronRight className="text-lg" />
        </motion.div>
      )}
    </div>
  );
}

export default Menu;
