import { useEffect, useState } from "react"
import { Link } from "react-router"

export const JudgeHome = () => {
  const [tasks, setTasks] = useState([])
  const [range, setRange] = useState({ L:0, R:0 })

  useEffect(() => {
    const f = (d) => {
      setTasks(d)
      setRange({ L: 0, R: Math.min(7, d.length) })
    }
    fetch('/data/tasks/types.json')
    .then(res => res.json())
    .then(data => f(data.years))
  }, [])  

  const goBack = () => {
    if(range.L != 0) {
      const newL = range.L - 7;
      const newR = newL + 7;
      setRange({ L: newL, R: newR })
    }
  }

  const goForward = () => {
    if(range.R != tasks.length) {
      const newL = range.L + 7;
      const newR = Math.min(newL + 7, tasks.length);
      setRange({ L: newL, R: newR })
    }
  }

  const displayTasks = tasks.slice(range.L, range.R)
  
  return (
    <div className="w-full py-10">
      <div className="mx-auto w-[75%] rounded-md bg-white shadow-md shadow-slate-200">
        {displayTasks.map(season => (
          <div key={season.year} className={`flex items-center py-3 px-7 gap-20
          ${season.year != displayTasks.at(-1).year && "border-b border-b-slate-500 hover:border-b-blue-500"}`}>
            <p className="font-semibold">{season.year}</p>
            <div className="flex gap-12">
              {season.types.map(comp => (
                <Link key={comp.code} to={`/judge/${season.year}/${comp.code}/1`}><button className="font-semibold
                px-2 py-0.5 hover:border border-[0.5px] hover:border-blue-600
                hover:rounded-sm hover:text-blue-600">{comp.name}</button></Link>
              ))}
            </div>
          </div>
        ))}
        <div className="flex px-7 gap-5 pb-2.5 pt-1">
          <button className={`font-semibold
          text-white ${range.L == 0 ? "bg-blue-500" : "bg-blue-700"}
          px-2 py-0.5 rounded-sm shadow-md shadow-slate-200
          ${range.L != 0 && "hover:shadow-none hover:bg-blue-800"}`}
          onClick={() => goBack()}
          disabled={range.L == 0}>Назад</button>
          <button className={`font-semibold
          text-white ${range.R == tasks.length ? "bg-blue-500" : "bg-blue-700"}
          px-2 py-0.5 rounded-sm shadow-md shadow-slate-200
          ${range.R != tasks.length && "hover:shadow-none hover:bg-blue-800"}`}
          onClick={() => goForward()}
          disabled={range.R == tasks.length}>Напред</button>
        </div>
      </div>
    </div>
  )
}
