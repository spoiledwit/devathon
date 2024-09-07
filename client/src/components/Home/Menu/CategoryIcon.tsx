import { FaMobileAlt } from 'react-icons/fa';
import { BsBuilding } from 'react-icons/bs';
import { TbMotorbike } from 'react-icons/tb';
import { BiBuildingHouse, BiBriefcaseAlt } from 'react-icons/bi';
import { CgSmartHomeWashMachine } from 'react-icons/cg';
import { RiShirtLine } from 'react-icons/ri';
import {TbSofa} from 'react-icons/tb';
import { BiCategory } from 'react-icons/bi';
import {AiOutlineCar} from 'react-icons/ai';
import {TbHorseToy} from 'react-icons/tb';
import {TbDog, TbBusinessplan} from 'react-icons/tb';
import {IoIosFootball} from 'react-icons/io';
import {MdOutlineHomeRepairService} from 'react-icons/md';

const CategoryIcon = ({ category, color="black" }:{
  category: string,
  color?: string
}) => {
  switch (category) {
    case 'Mobile Phones':
      return <FaMobileAlt className={`text-${color}`} size={20}/>;
    case 'Vehicles':
      return <AiOutlineCar className={`text-${color}`} size={20}/>;
    case 'Bikes':
      return <TbMotorbike className={`text-${color}`} size={20}/>;
    case 'Property for sale':
      return <BiBuildingHouse className={`text-${color}`} size={20}/>;
    case 'Property for rent':
      return <BsBuilding className={`text-${color}`} size={20}/>;
    case 'Jobs':
      return <BiBriefcaseAlt className={`text-${color}`} size={20}/>;
    case 'Electronics':
      return <CgSmartHomeWashMachine className={`text-${color}`} size={20}/>;
    case 'Fashion and beauty':
      return <RiShirtLine className={`text-${color}`} size={20}/>;
    case 'Furniture and Home Decor':
      return <TbSofa className={`text-${color}`} size={20}/>;
    case "Kids":
      return <TbHorseToy className={`text-${color}`} size={20}/>;
    case "Animals":
      return <TbDog className={`text-${color}`} size={20}/>;
    case "Books, Sports, Hobbies":
      return <IoIosFootball className={`text-${color}`} size={20}/>;
    case "Business, Industrial, Agriculture":
      return <TbBusinessplan className={`text-${color}`} size={20}/>;
    case "Services":
      return <MdOutlineHomeRepairService className={`text-${color}`} size={20}/>;
    default:
      return <BiCategory className={`text-${color}`} size={20}/>;
  }
};

export default CategoryIcon;