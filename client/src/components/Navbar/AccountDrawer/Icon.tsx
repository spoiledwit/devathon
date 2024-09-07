import { User } from "lucide-react";

function Icon({
  text,
  click,
  image = null,
}: {
  text?: string;
  click: (e: any) => void;
  image?: string | null;
  id: string;
}) {
  return (
    <>
      {text && !image && (
        <div
          id="icon2"
          onClick={(e) => {
            click(e);
          }}
          className="bg-black cursor-pointer text-white text-[10px]"
          style={{
            borderRadius: "50%",
            display: "inline-block",
            width: "30px",
            height: "30px",
            textAlign: "center",
            lineHeight: "30px",
          }}
        >
          {text.charAt(0).toUpperCase()}
        </div>
      )}
    </>
  );
}

export default Icon;
