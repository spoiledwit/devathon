import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import "./SearchBar.css";
import { useLocation } from "react-router-dom";
import { ListRestart } from "lucide-react";

// @ts-ignore
const FullSearchBar = ({ input, setInput, startingDate, setCheckIn, endingDate, setCheckOut, handleClick, resetFilters }) => (
  <form className="items-center justify-between flex w-full h-full" onSubmit={handleClick}>
    <div className="flex-1 px-4 py-4 ml-6 min-w-[280px]">
      <label className="block text-[13px] font-medium">Where</label>
      <input
        type="text"
        className="w-full border-none text-sm placeholder-gray-500 placeholder:font-light focus:outline-none"
        placeholder="Search location"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
    </div>
    <div className="border-l border-gray-300 h-12"></div>
    <div className="flex-1 px-4 py-4">
      <label className="block text-[13px] font-medium">Starting date</label>
      <input
        type="date"
        className="w-full border-none text-sm placeholder-gray-500 placeholder:font-light focus:outline-none"
        value={startingDate}
        onChange={(e) => setCheckIn(e.target.value)}
      />
    </div>
    <div className="border-l border-gray-300 h-12"></div>
    <div className="flex-1 px-4 py-4">
      <label className="block text-[13px] font-medium">Ending date</label>
      <input
        type="date"
        className="w-full border-none text-sm text-gray-800 placeholder-gray-500 placeholder:font-light focus:outline-none"
        value={endingDate}
        onChange={(e) => setCheckOut(e.target.value)}
      />
    </div>
    <div title="Reset Filters" className="border-l w-fit px-4 py-4">
      <ListRestart onClick={resetFilters} size={20} />
    </div>
    <button
      type="submit"
      className="flex items-center justify-center w-12 h-12 bg-black text-white rounded-full mr-2"
    >
      <FiSearch size={24} />
    </button>
  </form>
);

const CompactSearchBar = ({ handleClick }: { handleClick: any }) => (
  <div className="flex h-full w-full items-center justify-between px-4 py-2">
    <div className="flex-1 text-center">
      <span className="text-sm font-medium">Anywhere</span>
    </div>
    <div className="border-l border-gray-300 h-full"></div>
    <div className="flex-1 text-center">
      <span className="text-sm font-medium">Any week</span>
    </div>
    <div className="border-l border-gray-300 h-full"></div>
    <button
      type="button"
      className="flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full mr-[-10px]"
      onClick={handleClick}
    >
      <FiSearch size={15} />
    </button>
  </div>
);

const SearchBar = () => {

  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }
  const query = useQuery();
  const [input, setInput] = useState(query.get("region"));
  const [startingDate, setCheckIn] = useState(query.get("startingDate"));
  const [endingDate, setCheckOut] = useState(query.get("endingDate"));
  const [isScrolled, setIsScrolled] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  const focusTimeoutRef = useRef(null);
  const isBlockedRef = useRef(false);

  const resetFilters = () => {
    setInput("");
    setCheckIn("");
    setCheckOut("");
    navigate("");
  };

  const handleClick = (e: any) => {
    e.preventDefault();
    const query: any = {};

    if (input) {
      query.region = input.toLowerCase().replace(/\s/g, "-");
    }
    if (startingDate) {
      query.startingDate = startingDate;
    }
    if (endingDate) {
      query.endingDate = endingDate;
    }
    const queryString = new URLSearchParams(query).toString();
    navigate(`?${queryString}`);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (isBlockedRef.current) return;

      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (focusTimeoutRef.current) {
        clearTimeout(focusTimeoutRef.current);
      }
    };
  }, []); // No dependencies to ensure this effect runs only once

  const handleFocus = () => {
    setIsScrolled(false);
    setIsFocused(true);
    isBlockedRef.current = true;

    // @ts-ignore
    focusTimeoutRef.current = setTimeout(() => {
      setIsFocused(false);
      isBlockedRef.current = false;
    }, 500);
  };

  return (
    <div>
      <div
        onClick={handleFocus}
        className={`search-bar-container md:block hidden cursor-pointer mx-auto transition-all duration-300 ${isScrolled
          ? "compact mt-[-50px] top-6 transform mx-auto md:w-[375px] overflow-hidden"
          : "full"
          }`}
      >
        {isScrolled ? (
          <CompactSearchBar handleClick={handleClick} />
        ) : (
          <FullSearchBar
            input={input}
            resetFilters={resetFilters}
            setInput={setInput}
            startingDate={startingDate}
            setCheckIn={setCheckIn}
            endingDate={endingDate}
            setCheckOut={setCheckOut}
            handleClick={handleClick}
          />
        )}
      </div>
      <br />
    </div>
  );
};

export default SearchBar;
