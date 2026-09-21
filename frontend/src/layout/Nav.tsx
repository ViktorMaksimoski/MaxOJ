import { signOut } from "firebase/auth";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { auth } from "../firebase";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import { LogInIcon, LogOutIcon, ScaleIcon } from "lucide-react";

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
    <div className="absolute left-0 top-full w-full bg-white z-50
    border border-gray-200 px-7 py-3 mt-2 rounded-lg">
      <h4 className="text-sm font-semibold tracking-wide mb-1 text-blue-400">ТЕМИ</h4>
      {topics.map((t) => (
        <div key={t.code} 
        onMouseDown={() => work(t)}
        className="block cursor-pointer px-3 py-1 rounded-lg
        font-medium transition-all duration-150 mb-1 text-[14px]
        bg-gray-100 text-gray-800 tracking-wide
        hover:bg-blue-50 hover:text-blue-500 hover:shadow-sm">
          {t.name}
        </div>
      ))}
    </div>
  );
};

export const Nav = () => {
  const [open, setOpen] = useState(false);
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
    <nav className="sticky top-0 left-0 w-full shadow-sm shadow-sky-200 bg-white z-50 border-b border-b-blue-400">
      <div className="mx-auto mx-w-7xl px-7 py-5 flex items-center justify-between">
        <div>
          <Link
            to={"/"}
            className="text-2xl tracking-wider"
            onClick={() => setTopic({ name: "", code: "" })}
          >
            MaxOJ
          </Link>
        </div>
        <div>
          <input
            type="text"
            value={topic.name}
            placeholder="Изберете тема..."
            className="rounded-3xl outline-none border border-blue-400 bg-slate-50 text-blue-400
                py-2 pl-8 pr-3 min-w-[23rem] placeholder:text-blue-400
                hover:border-blue-500 hover:placeholder:text-blue-500"
            onChange={(e) => setOpen(true)}
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
          />

          <div className="relative">
            {open && <Dataset onSelect={setOpen} setInputTopic={setTopic} />}
          </div>
        </div>

        <div className="flex items-center gap-5">
          <Link to={"/judge"}>
            <button
              className="text-lg
              border border-blue-600 text-blue-500 py-1.5 px-2.5
              sm:px-6 rounded-md shadow-sm shadow-sky-100
              hover:text-blue-600 border-blue-700
              hover:shadow-none"
            >
              <div className="block sm:hidden">
                <ScaleIcon />
              </div>
              <div className="hidden sm:block">Арена</div>
            </button>
          </Link>
          {user && (
            <button
              className="text-lg px-2.5 sm:px-6 text-white
                bg-blue-600 py-1.5 rounded-md
                shadow-sm shadow-sky-200
                hover:shadow-none hover:bg-blue-600"
              onClick={() => logOut()}
            >
              <div className="block sm:hidden">
                <LogOutIcon />
              </div>
              <div className="hidden sm:block">Одјава</div>
            </button>
          )}
          {!user && (
            <Link to={"/login"}>
              <button
                className={`text-lg px-2.5 sm:px-6 ${
                  !hovered && "bg-blue-600 text-white rounded-md py-1.5"
                } ${
                  hovered &&
                  "text-blue-500 border border-blue-600 bg-white py-1.5 rounded-md"
                }`}
              >
                <div className="block sm:hidden">
                  <LogInIcon />
                </div>
                <div className="hidden sm:block">Најава</div>
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
