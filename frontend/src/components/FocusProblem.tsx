import { ExternalLinkIcon } from "lucide-react";
import { types } from "../lib/task-types";

interface FocusProblemProps {
  url: string;
  source: string;
  task: string;
  level: number;
}

export const FocusProblem = ({
  url,
  source,
  task,
  level,
}: FocusProblemProps) => {
  return (
    <div>
      <div
        className="w-[100%] mt-6 border border-sky-300
    text-left rounded-md overflow-hidden group"
      >
        <a href={url} target="__blank">
          <div
            className={`w-full bg-blue-300 rounded-t-md
            group-hover:bg-blue-400 px-6 tracking-wide py-2`}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-xl sm:text-2xl text-white">
                {task}
              </h3>
              <ExternalLinkIcon className="text-white" />
            </div>
            <p className="text-sm text-white font-semibold tracking-wide">
              {source}
              <span className="text-white mx-1">•</span>
              {types[level].name}
            </p>
          </div>
          <div className={`w-full rounded-b-md bg-white`}>
            <p
              className="text-slate-700 font-medium tracking-wide
                leading-relaxed text-sm px-6 py-2"
            >
              Ова е пример задача. Дадете се од себе пред да го видите
              решението.
            </p>
          </div>
        </a>
      </div>
    </div>
  );
};
