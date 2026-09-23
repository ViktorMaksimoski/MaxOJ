import { ArrowLeftIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate, useParams } from "react-router";
import { useAuth } from "../contexts/AuthContext";

export const JudgeSidebar = () => {
  const [tasks, setTasks] = useState([]);
  const [name, setName] = useState("");
  const { year, compId, taskId } = useParams();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation()

  useEffect(() => {
    const f = (d) => {
      setTasks(d.tasks);
      setName(d.name);
    };
    fetch(`/data/tasks/competitions/${compId}.${year}.json`)
      .then((res) => res.json())
      .then((data) => f(data));
  }, [year, compId]);

  const isSubmit = location.pathname.endsWith("/submit")
  const isView = location.pathname.includes("/view")

  return (
    <div className="w-full">
      <div
        className="shadow-sm shadow-slate-300 w-full
    rounded-md px-4 pb-1.5 pt-3 bg-white border border-gray-200
    max-h-[25rem] overflow-y-auto"
      >
        <h3 className="font-medium text-lg mb-4 flex gap-2 items-center
        text-blue-900 tracking-wide">
          <button onClick={() => navigate("/judge")}>
            <ArrowLeftIcon size={23} />
          </button>
          {name}
        </h3>
        {tasks.map((task) => (
          <div className="mb-1" key={task.code}>
          <NavLink
            // key={task.code}
            to={`/judge/${year}/${compId}/${task.code}/${isSubmit?"submit":isView?"view/1":""}`}
            className={({ isActive }) => `
            block rounded-lg px-3 py-1.5
            font-medium
            transition-all duration-150 mb-2
            text-[15px]
            ${
              isActive
              ? 'bg-blue-100 text-blue-700 shadow-sm'
              : 'bg-gray-100 text-gray-800 hover:bg-blue-50 hover:text-blue-700'
            }
          `}
          >
            {task.code}. {task.name}
          </NavLink>
          </div>
        ))}
      </div>
      {!user && <button className="w-full bg-white mt-4 font-medium py-1.5
      border-2 border-blue-300 text-blue-700 rounded-md shadow-sm tracking-wide
      transition duration-200 hover:border-blue-400
      "
      onClick={() => navigate('/login')}>
        Најавете се
      </button>}
      {user && <button className="w-full bg-white mt-4 font-medium py-1.5
      border-2 border-blue-300 text-blue-700 rounded-md shadow-sm tracking-wide
      transition duration-200 hover:border-blue-400
      "
      onClick={() => navigate(`/judge/${year}/${compId}/${taskId}/${isSubmit||isView?"":"submit"}`)}>
        {isSubmit || isView ? "Прочитај Текст" : "Испрати Решение"}
      </button>}
      {user && <button className="w-full bg-white mt-4 font-medium py-1.5
      border-2 border-blue-300 text-blue-700 rounded-md shadow-sm tracking-wide
      transition duration-200 hover:border-blue-400
      "
      onClick={() => navigate(`/judge/${year}/${compId}/${taskId}/${isView?"submit":"view/1"}`)}>
        {isView ? "Испрати Решение" : "Твои Решенија"}
      </button>}
    </div>
  );
};
