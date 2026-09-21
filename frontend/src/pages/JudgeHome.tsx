import { useEffect, useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

export const JudgeHome = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [range, setRange] = useState({ L: 0, R: 0 });
  const [direction, setDirection] = useState(1);
  const [animateRangeChange, setAnimateRangeChange] = useState(false);

  useEffect(() => {
    const f = (d: any[]) => {
      setTasks(d);
      setRange({ L: 0, R: Math.min(7, d.length) });
    };
    fetch("/data/tasks/types.json")
      .then((res) => res.json())
      .then((data) => f(data.years));
  }, []);

  const goBack = () => {
    if (range.L !== 0) {
      setDirection(-1);
      setAnimateRangeChange(true);
      const newL = range.L - 7;
      const newR = newL + 7;
      setRange({ L: newL, R: newR });
    }
  };

  const goForward = () => {
    if (range.R !== tasks.length) {
      setDirection(1);
      setAnimateRangeChange(true);
      const newL = range.L + 7;
      const newR = Math.min(newL + 7, tasks.length);
      setRange({ L: newL, R: newR });
    }
  };

  const displayTasks = tasks.slice(range.L, range.R);

  // animation variants
  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({
      x: dir > 0 ? -50 : 50,
      opacity: 0,
    }),
  };

  const taskRows = (
  <>
    {displayTasks.map((season) => (
      <div
        key={season.year}
        className={`flex items-center py-3 px-7 gap-16
          border-b border-b-slate-200 group
          ${
            season.year === displayTasks.at(0)?.year &&
            "border-t border-t-slate-200"
          }
        `}
      >
        <p
          className="font-medium text-[17px] tracking-wide
          text-blue-800 group-hover:text-blue-900"
        >
          {season.year}
        </p>

        <div className="flex gap-9 flex-wrap">
          {season.types.map((comp: any) => (
            <Link
              key={comp.code}
              to={`/judge/${season.year}/${comp.code}/1`}
            >
              <button
                className="font-medium tracking-wide px-3 py-1
                  bg-slate-100 text-gray-800 text-sm
                  hover:text-blue-700 hover:bg-blue-100
                  transition-colors duration-200
                  border border-gray-200 rounded-sm"
              >
                {comp.name}
              </button>
            </Link>
          ))}
        </div>
      </div>
    ))}
  </>
);

  return (
    <div className="w-full py-10">
      <div className="mx-auto w-[75%] rounded-md bg-white shadow-sm border border-2 border-gray-200 shadow-slate-200 overflow-hidden">
        <div className="px-8 pt-6 pb-4">
          <h3 className="font-medium text-2xl tracking-wide text-gray-800">
            Натпревари
          </h3>
          <p className="tracking-wide text-sm text-gray-500">
            Сите македонски натпревари достапни на едно место, како и специјални
            натпревари и задачи за <span className="font-medium">MaxOJ</span>
          </p>
        </div>
        {animateRangeChange ? (
          <AnimatePresence
            mode="wait"
            custom={direction}
            onExitComplete={() => setAnimateRangeChange(false)} // reset after animation
          >
            <motion.div
              key={`${range.L}-${range.R}`}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: "easeInOut" }}
            >
              {taskRows}
            </motion.div>
          </AnimatePresence>
        ) : (
          <div>{taskRows}</div>
        )}

        <div className="flex px-7 gap-5 pb-5 pt-4">
          <button
            className={`gap-1 text-sm font-medium rounded-sm tracking-wide
              shadow-sm shadow-blue-100
              flex items-center transition disabled:cursor-not-allowed
              px-5 py-2 text-blue-700 bg-blue-100 hover:bg-blue-100
              disabled:opacity-40 hover:text-blue-800
              border border-blue-200 hover:border-blue-300`}
            onClick={goBack}
            disabled={range.L === 0}
          >
            <ArrowLeftIcon size={16} />
            Назад
          </button>
          <button
            className={`gap-1 text-sm font-medium rounded-sm tracking-wide
              shadow-sm shadow-blue-100
              flex items-center transition disabled:cursor-not-allowed
              px-5 py-2 text-blue-700 bg-blue-100 hover:bg-blue-100
              disabled:opacity-40 hover:text-blue-800
              border border-blue-200 hover:border-blue-300`}
            onClick={goForward}
            disabled={range.R === tasks.length}
          >
            Напред
            <ArrowRightIcon size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
