import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router"

const Dataset = ({ onSelect, setInputTopic }) => {
    const topics = [
        { name: "Динамичко Програмирање", code: "dynamic-programming" },
        { name: "Графови и Патишта", code: "graph" },
        { name: "Податочни Структури", code: "data-structures" },
        { name: "Вовед во Програмирање (C++)", code: "intro" }
    ]

    const work = (t) => {
        console.log(t)
        setInputTopic(t)
        onSelect(false)
    }

    return (
        <div className="absolute bg-white ml-4 px-4 py-2 shadow-lg">
            {topics.map((t) => (
                <div key={t.code} className="mb-1 hover:bg-gray-50 hover:text-blue-600">
                    <button onMouseDown={() => work(t)}>{t.name}</button>
                    <br />
                </div>
            ))}
        </div>
    )
}

export const Nav = () => {
  const [open, setOpen] = useState(false);
  const [topic, setTopic] = useState({ name:"", code:"" });
  const [hovered, setHovered] = useState(false)
  const navigate = useNavigate()
  const location = useLocation();

  useEffect(() => {
        if(topic.code !== "")
            navigate(`/topic/${topic.code}`)
  }, [topic])

  if(location.pathname == "/register" || location.pathname == "/login")
        return null;

  return (
    <nav className="sticky top-0 left-0 w-full shadow-sm shadow-sky-200 bg-white z-50 border-b border-b-blue-400">
        <div className="mx-auto mx-w-7xl px-7 py-5 flex items-center justify-between">
            <div>
                <Link to={'/'} className="text-2xl tracking-wider"
                onClick={() => setTopic({ name:"", code:"" })}>MaxOJ</Link>
            </div>
            <div>
                <input type="text" value={topic.name}
                placeholder="Изберете тема..."
                className="rounded-3xl outline-none border border-blue-400 bg-slate-50 text-blue-400
                py-2 pl-8 pr-3 min-w-72 placeholder:text-blue-400
                hover:border-blue-500 hover:placeholder:text-blue-500"
                onChange={(e) => setOpen(true)}
                onFocus={() => setOpen(true)}
                onBlur={() => setOpen(false)} />
                
                <div className="relative">{open && <Dataset onSelect={setOpen} setInputTopic={setTopic} />}</div>
            </div>
            <div className="flex gap-5">
                <button onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                className="text-lg px-6 hover:bg-blue-600 hover:text-white hover:rounded-md hover:py-1.5">
                    <Link to={'/register'}>Регистрација</Link>
                </button>
                <button className={`text-lg px-6 ${!hovered && "bg-blue-600 text-white rounded-md py-1.5"}`}>
                    <Link to={'/login'}>Најава</Link>
                </button>
            </div>
        </div>
    </nav>
  )
}
