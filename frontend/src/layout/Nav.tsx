import { signOut } from "firebase/auth";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { auth } from "../firebase";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import {
  ChevronDown,
  ChevronDownIcon,
  ChevronUpIcon,
  LogInIcon,
  LogOutIcon,
  Scale,
  ScaleIcon,
  SearchIcon,
  UserCircleIcon,
  UserIcon,
} from "lucide-react";

const Dataset = ({ onSelect, setInputTopic }) => {
  const topics = [
    { name: "Динамичко Програмирање", code: "dynamic-programming" },
    { name: "Графови и Патишта", code: "graph" },
    { name: "Податочни Структури", code: "data-structures" },
    { name: "Вовед во Програмирање (C++)", code: "intro" },
  ];

  const work = (t) => {
    console.log(t);
    setInputTopic(t);
    onSelect(false);
  };

  return (
    <div
      className="absolute left-0 top-full w-full bg-white z-50
    border border-gray-200 px-7 py-3 mt-2 rounded-lg"
    >
      <h4 className="text-sm font-semibold tracking-wide mb-1 text-blue-400">
        ТЕМИ
      </h4>
      {topics.map((t) => (
        <div
          key={t.code}
          onMouseDown={() => work(t)}
          className="block cursor-pointer px-3 py-1 rounded-lg
        font-medium transition-all duration-150 mb-1 text-[14px]
        bg-gray-100 text-gray-800 tracking-wide
        hover:bg-blue-50 hover:text-blue-500 hover:shadow-sm"
        >
          {t.name}
        </div>
      ))}
    </div>
  );
};

export const Nav = () => {
  const [open, setOpen] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [topic, setTopic] = useState({ name: "", code: "" });
  const [hovered, setHovered] = useState(false);
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (topic.code !== "") navigate(`/topic/${topic.code}`);
  }, [topic]);

  const logOut = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (err) {
      console.log(err);
      toast.error("Не може да се одјавите! Пробајте повторно");
    }
  };

  if (location.pathname == "/register" || location.pathname == "/login")
    return null;

  return (
    <nav
      className="sticky top-0 left-0 w-full shadow-sm px-16
     bg-white z-50 border-b-2 border-b-gray-200"
    >
      <div className="mx-auto mx-w-7xl px-7 py-5 flex items-center justify-between">
        <div>
          <Link
            to={"/"}
            className="text-xl font-medium"
            onClick={() => setTopic({ name: "", code: "" })}
          >
            Max<span className="text-blue-700">OJ</span>
          </Link>
        </div>
        <div>
          <div className="flex gap-2 h-11 pl-4 pr-4 min-w-[24rem] border-2
          outline-none border-slate-300 rounded-lg text-slate-600 font-medium
          text-sm justify-between items-center hover:border-blue-200"
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}>
            <input
            type="text"
            value={topic.name}
            placeholder="Изберете тема..."
            className="outline-none min-w-[23rem] tracking-wide"
            onChange={(e) => setOpen(true)} />
            
            {!open && <ChevronDownIcon size={18} onClick={() => setOpen(true)} />}
            {open && <ChevronUpIcon size={18} onClick={() => setOpen(false)} />}
          </div>
          

          <div className="relative">
            {open && <Dataset onSelect={setOpen} setInputTopic={setTopic} />}
          </div>
        </div>

        <div className="flex items-center gap-5">
          <Link
            to={"/judge"}
            className="group flex items-center gap-2
          rounded-lg border-2 border-slate-200 bg-white px-4 py-3
          text-sm font-medium transition text-slate-600 h-11 tracking-wide
          duration-200 hover:border-blue-200 hover:text-blue-600
          focus:border-blue-300"
          >
            <ScaleIcon size={18} />
            Арена
          </Link>
          {user && (
            <div
            className="relative"
            onMouseEnter={() => setOpenProfile(true)}
            onMouseLeave={() => setOpenProfile(false)}>
              <button
                className="group flex items-center gap-2
              rounded-lg border-2 border-slate-200 bg-white px-7 py-3
              text-sm font-medium transition text-slate-600 tracking-wide h-11
              duration-200 hover:border-blue-200 hover:text-blue-600"
                
              >
                <div
                  className="w-6 h-6 flex items-center justify-center rounded-full
                bg-blue-100 px-1 py-1 text-blue-700"
                >
                  <UserIcon size={18} />
                </div>
                {user.displayName}
              </button>

              {openProfile &&
                <div className="absolute left-0 top-full z-50 pt-2 w-full">
                <div
                className="bg-white border border-gray-200 w-full py-2
                rounded-lg shadow-sm flex flex-col items-center">
                  <Link className="h-9 w-[80%] flex items-center gap-2 text-sm
                  font-medium text-slate-600 tracking-wide transition
                  duration-200 hover:bg-blue-50 rounded-lg px-3 py-1"
                  to={'/judge/profile'}>
                    <div className="w-6 h-6 flex items-center justify-center
                    rounded-full bg-blue-100 px-1.5 py-1.5 text-blue-700">
                      <SearchIcon size={16} />
                    </div>
                    Види профил
                  </Link>

                  <div className="h-1 w-[80%] border-t-2 border-gray-200 my-1.5"></div>

                  <button className="h-9 w-[80%] flex items-center gap-2 text-sm
                  font-medium text-red-600 tracking-wide transition duration-200
                  hover:bg-red-50 rounded-lg px-3 py-1"
                  onClick={logOut}>
                    <div className="w-6 h-6 flex items-center justify-center
                    rounded-full bg-red-100 px-1.5 py-1.5 text-red-700">
                      <LogOutIcon size={16} />
                    </div>
                    Одјави се
                  </button>
                </div>
                </div>}
            </div>
          )}
          {!user && (
            <Link
              to={"/login"}
              className="group flex items-center gap-2
              rounded-lg border-2 border-slate-200 bg-white px-4 py-3
              text-sm font-medium transition text-slate-600 h-11 tracking-wide
              duration-200 hover:border-blue-200 hover:text-blue-600"
            >
              <LogInIcon size={18} />
              Најава
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
