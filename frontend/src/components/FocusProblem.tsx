import { types } from "../lib/task-types";

interface FocusProblemProps {
    url: string;
    source: string;
    task: string;
    level: number;
};

export const FocusProblem = ({ url, source, task, level }: FocusProblemProps) => {
    return (
    <button className="w-[60%] mt-6 shadow-md hover:shadow-sm shadow-sky-300 text-left">
        <a href={url} target="__blank">
            <div className={`w-full bg-blue-500 rounded-t-md px-6 py-1`}>
                <h3 className="font-semibold text-2xl text-white">{task}</h3>
                <p className="text-sm pl-1 text-slate-100 font-semibold">{source} - {types[level].name}</p>
            </div>
            <div className={`w-full rounded-b-md bg-blue-600`}>
                <p className="text-white text-sm px-6 pt-0.5 pb-1">
                    Ова е пример задача. Дадете се од себе пред да го видите решението.
                </p>
            </div>
        </a>
    </button>
  )
}
