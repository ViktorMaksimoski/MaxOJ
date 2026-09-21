import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import { Loading } from "../components/Loading";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CircleCheckBigIcon,
  CircleQuestionMarkIcon,
  MonitorCogIcon,
  SendIcon,
} from "lucide-react";
import { Link } from "react-router";

const DataCard = ({ icon, num, txt, color }) => {
  const textColor = `text-${color}`;
  const borderColor = `border-${color}`;
  return (
    <div
      className={`bg-white cursor-pointer rounded-md w-full px-3 py-3 border ${color}`}
    >
      {icon}
      <p className="text-center mt-1 text-xl font-semibold tracking-wider">
        {num}
      </p>
      <p className="text-center text-gray-400">{txt}</p>
    </div>
  );
};

export const Profile = () => {
  const { user, loading } = useAuth();
  const [data, setData] = useState({});
  const [load, setLoad] = useState(true);
  const [title, setTitle] = useState("");
  const [color, setColor] = useState("");
  const [shadow, setShadow] = useState("");
  const [year, setYear] = useState("");
  const [con, setCon] = useState("");
  const [pid, setPid] = useState("");
  const [showExp, setShowExp] = useState(false);

  useEffect(() => {
    if (!user) return;

    const getData = async () => {
      const token = await user.getIdToken();
      const backendUrl = import.meta.env.VITE_BACKEND_URL;

      const res = await fetch(`${backendUrl}/api/users`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const resData = await res.json();

      if (!resData.success) {
        setLoad(true);
        toast.error(resData.message);
      } else {
        setLoad(false);
        setData(resData.data);

        const {solved, lastSubmission} = resData.data;

        setYear(lastSubmission.slice(0, 4));

        let lst = lastSubmission.length;
        for(let i=lastSubmission.length-1; i>=0; i--) {
            if(lastSubmission[i] < '0' || lastSubmission[i] > '9') {
                lst = i;
                break;
            }
        }

        setCon(lastSubmission.slice(4, lst+1));
        setPid(lastSubmission.slice(lst+1, lastSubmission.length));


        if (solved <= 5) {
          setTitle("Почетник");
          setColor("bg-green-500");
          setShadow("shadow-sm shadow-green-500");
        } else if (solved <= 10) {
          setTitle("Ученик");
          setColor("bg-blue-400");
          setShadow("shadow-sm shadow-blue-400");
        } else if (solved <= 20) {
          setTitle("Специјалец");
          setColor("bg-indigo-600");
          setShadow("shadow-md shadow-indigo-600");
        } else if (solved <= 35) {
          setTitle("Експерт");
          setColor("bg-yellow-500");
          setShadow("shadow-md shadow-yellow-500");
        } else if (solved <= 55) {
          setTitle("Мајстор");
          setColor("bg-orange-600");
          setShadow("shadow-md shadow-orange-600");
        } else if (solved <= 80) {
          setTitle("Велемајстор");
          setColor("bg-red-700");
          setShadow("shadow-md shadow-red-700");
        }
      }
    };

    getData();
  }, [user]);

  if (load) return <Loading />;

  return (
    <div className="px-36 pt-8">
      <div>
        <p className="text-4xl font-bold tracking-tight text-gray-800">
          {user?.displayName}
        </p>

        <div className="flex items-center gap-2 mt-1.5">
          <span
            className={`w-2.5 h-2.5 cursor-pointer rounded-full shrink-0 ${color} ${shadow}`}
          />
          <p className="text-base text-gray-600 tracking-wider">{title}</p>
          <div className="relative"
          onMouseEnter={() => setShowExp(true)}
          onMouseLeave={() => setShowExp(false)}>
            <CircleQuestionMarkIcon size={15} className="text-gray-600
            hover:text-gray-700 cursor-pointer" />

            {showExp && (
              <div className="absolute top-7 left-1/2 w-max bg-white
               px-7 py-3 -translate-x-1/2 z-50 border
              border-gray-200 rounded-lg shadow-lg">
                <p className="text-xs text-gray-500 mb-3">Титула се одредува според број на решени задачи:</p>
                <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-green-500 font-medium">
                          Почетник
                      </span>
                      <span className="text-gray-400">0 - 5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-400 font-medium">
                          Ученик
                      </span>
                      <span className="text-gray-400">6 – 10</span>
                  </div>
                  <div className="flex justify-between">
                      <span className="text-indigo-600 font-medium">
                          Специјалец
                      </span>
                      <span className="text-gray-400">11 – 20</span>
                  </div>
                  <div className="flex justify-between">
                      <span className="text-yellow-500 font-medium">
                          Експерт
                      </span>
                      <span className="text-gray-400">21 – 35</span>
                  </div>
                  <div className="flex justify-between">
                      <span className="text-orange-600 font-medium">
                          Мајстор
                      </span>
                      <span className="text-gray-400">36 - 55</span>
                  </div>
                  <div className="flex justify-between">
                      <span className="text-red-700 font-medium">
                          Велемајстор
                      </span>
                      <span className="text-gray-400">56 - 80</span>
                  </div>
                  <div className="flex justify-between">
                      <span className="text-red-900 font-medium">
                          Лег. Велемајстор
                      </span>
                      <span className="text-gray-400">81+</span>
                  </div>
                </div>
                
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex mt-10 justify-center gap-6 items-center w-full">
        <DataCard
          icon={<CircleCheckBigIcon className="text-green-500" />}
          txt={"Решени задачи"}
          num={data.solved}
          color="border-green-500"
        />

        <DataCard
          icon={<SendIcon className="text-gray-600" />}
          txt={"Испратени решенија"}
          num={data.subCount}
          color="border-gray-600"
        />

        <DataCard
          icon={<MonitorCogIcon className="text-blue-500" />}
          txt={"Задачи на кои работам"}
          num={data.workingOn}
          color="border-blue-500"
        />
      </div>

      <div
        className={`bg-white cursor-pointer w-full
            rounded-md px-3 py-3 mt-6 border
            ${
              data.lastPoints == 100
                ? "border-green-500"
                : data.lastPoints != 0
                  ? "border-yellow-500"
                  : "border-red-500"
            }
            `}
      >
        <div className="flex justify-between items-center">
          <p className="tracking-wide font-medium text-xl">Последно решение</p>
          <p
            className={`mr-2 font-medium text-lg tracking-wider
                        ${
                          data.lastPoints == 100
                            ? "text-green-500"
                            : data.lastPoints != 0
                              ? "text-yellow-500"
                              : "text-red-500"
                        }
                    `}
          >
            {data.lastPoints}
            <span className="text-gray-400 font-normal"> / 100</span>
          </p>
        </div>

        <div className="mt-5 mb-2">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full shrink-0
                        ${
                          data.lastPoints == 100
                            ? "bg-green-500"
                            : data.lastPoints != 0
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }
                        `}
            />
            <p className="text-xl font-semibold tracking-wide">
              {data.lastName}
            </p>
          </div>
          <p className="text-sm text-gray-500 mt-1.5 ml-5">
            Испратено <span className="text-gray-400">•</span>{" "}
            {new Date(data.lastDate._seconds * 1000).toLocaleString("mk-MK", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })}
          </p>
        </div>

        <div className="flex justify-between items-center mt-8">
          <Link to={`/judge/${year}/${con}/${pid}`}>
            <button
              className={`
                        border rounded-md px-3 py-1.5 font-medium
                        flex items-center gap-1
                        ${
                          data.lastPoints == 100
                            ? "border-green-500"
                            : data.lastPoints != 0
                              ? "border-yellow-500"
                              : "border-red-500"
                        }
                        ${
                          data.lastPoints == 100
                            ? "text-green-500"
                            : data.lastPoints != 0
                              ? "text-yellow-500"
                              : "text-red-500"
                        }
                        hover:shadow-md
                    `}
            >
              <ArrowLeftIcon size={18} />
              Прочитај задача
            </button>
          </Link>

          <Link to={`/judge/submission/${data.lastId}`}>
            <button
              className={`
                        border rounded-md px-3 py-1.5 font-medium
                        flex items-center gap-1
                        ${
                          data.lastPoints == 100
                            ? "border-green-500"
                            : data.lastPoints != 0
                              ? "border-yellow-500"
                              : "border-red-500"
                        }
                        ${
                          data.lastPoints == 100
                            ? "text-green-500"
                            : data.lastPoints != 0
                              ? "text-yellow-500"
                              : "text-red-500"
                        }
                        hover:shadow-md
                    `}
            >
              Види решение
              <ArrowRightIcon size={18} />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
