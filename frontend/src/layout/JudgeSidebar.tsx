import { ArrowLeftIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate, useParams } from "react-router";

export const JudgeSidebar = () => {
  const [tasks, setTasks] = useState([]);
  const [name, setName] = useState("");
  const { year, compId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const f = (d) => {
      setTasks(d.tasks);
      setName(d.name);
    };
    fetch(`/data/tasks/competitions/${compId}.${year}.json`)
      .then((res) => res.json())
      .then((data) => f(data));
  }, [year, compId]);

  return (
    <div>
      <div
        className="shadow-md shadow-slate-300 w-full
    rounded-md px-4 py-1.5 bg-white"
      >
        <h3 className="font-medium text-lg mb-4 flex gap-2 items-center
        text-blue-900">
          <button onClick={() => navigate("/judge")}>
            <ArrowLeftIcon />
          </button>
          {name}
        </h3>
        {tasks.map((task) => (
          <NavLink
            key={task.code}
            to={`/judge/${year}/${compId}/${task.code}`}
            className={({ isActive }) =>
              isActive ? `text-blue-600 font-medium` : `text-base`
            }
          >
            <button className="mb-1.5 hover:text-blue-600">
              {task.code}. {task.name}
            </button>
          </NavLink>
        ))}
      </div>
      <button className="w-full bg-blue-800 border-2 border-sky-400
      mt-4 py-1.5 rounded-md text-white shadow-sm shadow-slate-300
      tracking-wide hover:shadow-none hover:bg-blue-900
      hover:border-blue-500">
        Испрати Решение
      </button>
    </div>
  );
};
