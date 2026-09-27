import { ArrowRightCircleIcon } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export const SubmissionPreview = ({ id, date, points }) => {
  const navigate = useNavigate();

  const hue = (Math.max(points, 0.5) / 100) * 120;

  return (
    <div
      className="flex bg-white rounded-md shadow-sm pr-5 py-3
        mb-4 cursor-pointer items-center justify-between border-2 hover:border-gray-300
        border-gray-200 transition duration-200"
      onClick={() => navigate(`/judge/submission/${id}`)}
    >
      <div className="flex gap-3 h-full">
        <div className="w-1.5 self-stretch rounded-r-md"
        style={{ backgroundColor: `hsl(${hue}, 80%, 50%)`}}></div>
        <div className="">
          <h3 className="text-xl font-medium text-gray-700 tracking-wide">
            Решение #{id}
          </h3>
          <p className="text-sm text-gray-500 font-medium
          tracking-wide">
            {new Date(date._seconds * 1000).toLocaleString("mk-MK", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-10">
        <div className="flex flex-col ">
          <p
            className="mr-2 font-medium text-lg tracking-wider"
            style={{ color: `hsl(${hue}, 80%, 50%)` }}
          >
            {points}
<span className="font-medium -ml-0.5 text-gray-400"> /<span className="text-xs">100</span> </span>
          </p>
          <p
            className="font-medium text-sm text-gray-400
                tracking-wide text-right mr-2"
          >
            поени
          </p>
        </div>
        <ArrowRightCircleIcon size={28} className="text-gray-400" />
      </div>
    </div>
  );
};
