import MarkdownDisplay from "./MarkdownDisplay";
import { useState } from "react";
import { capitalizeFirstLetter } from "@/lib/utils";
import { StarFilledIcon } from "@radix-ui/react-icons";
import { BiUser } from "react-icons/bi";
import moment from "moment";

interface Props {
  content: string;
  item: any
}

const Content = ({ content, item }: Props) => {

  return (
    <div className="mt-10 md:mr-12 text-[16px] w-full flex flex-col gap-6">
      {/* {content.map((item, index) => ( */}
      <div
        className="flex flex-col gap-1 border-b pb-6 cursor-pointer"
      >
        <span className="flex flex-col items-start">
          <h2 className="md:text-2xl italic text-black w-fit font-semibold mb-2">
            {capitalizeFirstLetter(item.title)}
          </h2>
        </span>
        <p>{content}</p>
      </div>
      {/* ))} */}
      <div className="border-b pb-6">
        <div className="flex flex-row items-center gap-3 ">
          <div className="rounded-full p-2 w-fit bg-gray-300">
            <BiUser size={25} className="text-gray-700 " />
          </div>
          <div className="flex flex-col">
            <p className="font-medium">Hosted by {item.agentId.name}</p>
            <p className="text-sm">{moment(item.eventDate, "YYYYMMDD").fromNow()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Content;
