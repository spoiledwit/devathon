import MarkdownDisplay from "./MarkdownDisplay";
import { useState } from "react";
import { capitalizeFirstLetter } from "@/lib/utils";
import { StarFilledIcon } from "@radix-ui/react-icons";
import { BiUser } from "react-icons/bi";
import moment from "moment";

interface Props {
  content: {
    title: string;
    markdown: string;
  }[];
  item: any
}

const Content = ({ content, item }: Props) => {
  const [open, setOpen] = useState<number[]>([]);

  return (
    <div className="mt-10 md:mr-12 text-[16px] w-full flex flex-col gap-6">
      {content.map((item, index) => (
        <div
          key={index}
          className="flex flex-col gap-1 border-b pb-6 cursor-pointer"
          onClick={() => {
            if (open.includes(index)) {
              setOpen(open.filter((i) => i !== index));
            } else {
              setOpen([...open, index]);
            }
          }}
        >
          <span className="flex flex-col items-start">
            <h2 className="md:text-2xl italic text-black w-fit font-semibold mb-2">
              {capitalizeFirstLetter(item.title)}
            </h2>
            <div className="flex flex-row gap-1 items-center">
              <StarFilledIcon className="size-[18px] text-gray-800" />
            </div>
          </span>
          {open.includes(index) && <MarkdownDisplay markdown={item.markdown} />}
        </div>
      ))}
      <div className="border-b pb-6">
        <div className="flex flex-row items-center gap-3 ">
          <div className="rounded-full p-2 w-fit bg-gray-300">
            <BiUser size={25} className="text-gray-700 " />
          </div>
          <div className="flex flex-col">
            <p className="font-medium">Hosted by {item.seller.name}</p>
            <p className="text-sm">{moment(item.seller.createdAt, "YYYYMMDD").fromNow()} hosting</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Content;
