import { useState, useEffect } from "react";
import { TbGridDots } from "react-icons/tb";
import { Link } from "react-router-dom";

const PlaceGallery = ({ photos, itemId }: { itemId: string, photos: string[] }) => {
  const [current, setCurrent] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const length = photos?.length;

  const nextSlide = () => {
    setCurrent(current === length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? length - 1 : current - 1);
  };

  const selectImage = (index: number) => {
    setCurrent(index);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (isOpen) {
        closeModal();
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isOpen]);

  if (!Array.isArray(photos) || photos.length <= 0) {
    return null;
  }

  return (
    <div className="flex md:flex-row flex-col items-center overflow-hidden gap-2 rounded-xl">
      <div className="md:w-1/2 w-full">
        <img src={photos[0]} />
      </div>
      <div className="md:w-1/2 w-full grid relative md:grid-cols-2 grid-cols-3 gap-2 ">
        {photos.slice(1, 5).map((photo, index) => {
          return (
            <div
              key={index}
            >
              <img src={photo} className="" />
            </div>
          );
        })}
        <Link to={`/item/${itemId}/gallery`} state={photos} className="flex flex-row px-3 cursor-pointer hover:bg-gray-50 py-1.5 right-5 bg-white text-black  absolute bottom-5 shadow text-sm rounded-md font-medium border border-black items-center gap-2 w-fit"><TbGridDots size={17} className="text-black" /> Show all photos</Link>
      </div>

    </div>
  );
};

export default PlaceGallery;
