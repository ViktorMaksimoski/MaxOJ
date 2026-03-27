import { useEffect, useState } from "react"
import { Link } from "react-router"
import { motion, AnimatePresence } from "framer-motion"

export const JudgeHome = () => {
  const [tasks, setTasks] = useState<any[]>([])
  const [range, setRange] = useState({ L: 0, R: 0 })
  const [direction, setDirection] = useState(1)
  const [animateRangeChange, setAnimateRangeChange] = useState(false)

  useEffect(() => {
    const f = (d: any[]) => {
      setTasks(d)
      setRange({ L: 0, R: Math.min(7, d.length) })
    }
    fetch("/data/tasks/types.json")
      .then((res) => res.json())
      .then((data) => f(data.years))
  }, [])

  const goBack = () => {
    if (range.L !== 0) {
      setDirection(-1)
      setAnimateRangeChange(true)
      const newL = range.L - 7
      const newR = newL + 7
      setRange({ L: newL, R: newR })
    }
  }

  const goForward = () => {
    if (range.R !== tasks.length) {
      setDirection(1)
      setAnimateRangeChange(true)
      const newL = range.L + 7
      const newR = Math.min(newL + 7, tasks.length)
      setRange({ L: newL, R: newR })
    }
  }

  const displayTasks = tasks.slice(range.L, range.R)

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
  }

  return (
    <div className="w-full py-10">
      <div className="mx-auto w-[75%] rounded-md bg-white shadow-md shadow-slate-200 overflow-hidden">
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
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              {displayTasks.map((season) => (
                <div
                  key={season.year}
                  className={`flex items-center py-3 px-7 gap-20 ${
                    season.year !== displayTasks.at(-1).year &&
                    "border-b border-b-slate-500 hover:border-b-blue-500"
                  }`}
                >
                  <p className="font-bold text-blue-900">{season.year}</p>
                  <div className="flex gap-12 flex-wrap">
                    {season.types.map((comp: any) => (
                      <Link
                        key={comp.code}
                        to={`/judge/${season.year}/${comp.code}/1`}
                      >
                        <button
                          className="font-semibold px-2 py-0.5 hover:border
                          border-[0.5px] hover:border-blue-600 hover:rounded-sm
                          hover:text-blue-600"
                        >
                          {comp.name}
                        </button>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        ) : (
          // 👇 static render, no animation on initial load
          <div>
            {displayTasks.map((season) => (
              <div
                key={season.year}
                className={`flex items-center py-3 px-7 gap-20 ${
                  season.year !== displayTasks.at(-1).year &&
                  "border-b border-b-slate-500 hover:border-b-blue-500"
                }`}
              >
                <p className="font-bold text-blue-900">{season.year}</p>
                <div className="flex gap-12 flex-wrap">
                  {season.types.map((comp: any) => (
                    <Link
                      key={comp.code}
                      to={`/judge/${season.year}/${comp.code}/1`}
                    >
                      <button
                        className="font-semibold px-2 py-0.5 hover:border
                        border-[0.5px] hover:border-blue-600 hover:rounded-sm
                        hover:text-blue-600"
                      >
                        {comp.name}
                      </button>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex px-7 gap-5 pb-2.5 pt-1">
          <button
            className={`font-semibold text-white ${
              range.L === 0 ? "bg-blue-500" : "bg-blue-700"
            } px-2 py-0.5 rounded-sm shadow-md shadow-slate-200 ${
              range.L !== 0 && "hover:shadow-none hover:bg-blue-800"
            }`}
            onClick={goBack}
            disabled={range.L === 0}
          >
            Назад
          </button>
          <button
            className={`font-semibold text-white ${
              range.R === tasks.length ? "bg-blue-500" : "bg-blue-700"
            } px-2 py-0.5 rounded-sm shadow-md shadow-slate-200 ${
              range.R !== tasks.length && "hover:shadow-none hover:bg-blue-800"
            }`}
            onClick={goForward}
            disabled={range.R === tasks.length}
          >
            Напред
          </button>
        </div>
      </div>
    </div>
  )
}
