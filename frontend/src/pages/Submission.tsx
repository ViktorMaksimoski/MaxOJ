import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import {
  ArrowLeftIcon,
  DatabaseIcon,
  ScaleIcon,
  TimerIcon,
} from "lucide-react";
import { formatJudge } from "../lib/formatJudged";
import { JudgedToIcon } from "../lib/judgedToIcon";
import { ShowCode } from "../components/ShowCode";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import { Loading } from "../components/Loading";

const ProgressCircle = ({ points }) => {
  const radius = 45;
  const perim = 2 * Math.PI * radius;

  const off = perim - (Math.max(points, 0.5) / 100) * perim;
  const hue = (Math.max(points, 0.5) / 100) * 120;

  return (
    <div className="relative w-32 h-32">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="8"
        />

        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={`hsl(${hue}, 80%, 50%)`}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={perim}
          strokeDashoffset={off}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p
          className="text-3xl font-semibold"
          style={{ color: `hsl(${hue}, 80%, 50%)` }}
        >
          {points}
        </p>
        <p
          className="font-medium text-sm tracking-wide text-gray-600
        -mt-1.5"
        >
          поени
        </p>
      </div>
    </div>
  );
};

export const Submission = () => {
  const { id } = useParams();

  const [submission, setSubmission] = useState(null);
  const [load, setload] = useState(true);
  const { user, loading } = useAuth();

  const navigate = useNavigate();

  const getBack = () => {
    const pid = submission.pid;
    const year = pid.slice(0, 4);

    let j = pid.length - 1;
    for (let i = pid.length - 1; i >= 0; i--) {
      if (pid[i] < "0" || pid[i] > "9") {
        j = i + 1;
        break;
      }
    }

    const contest = pid.slice(4, j);
    const task = pid.slice(j, pid.length);

    navigate(`/judge/${year}/${contest}/${task}`);
  };

  useEffect(() => {
    if (!id || !user) return;

    const getSubmission = async () => {
      const ref = doc(db, "submissions", id);

      const url = import.meta.env.VITE_BACKEND_URL;
      const token = await user?.getIdToken();
      const res = await fetch(`${url}/api/submission/single/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      const unsub = onSnapshot(
        ref,
        (snap) => {
          console.log("Exists: ", snap.exists);
          if (snap.exists()) {
            setSubmission(snap.data());
          } else {
            setSubmission(null);
          }
          setload(false);
        },
        (err) => {
          console.log("Error load submission ", err.code, err.message);
          setload(false);
        },
      );
      return () => unsub();
    };

    getSubmission();
  }, [id, user]);

  if (load) {
    return <Loading />;
  }

  if (!submission) {
    return <p>Решението не е пронајдено {id}</p>;
  }

  if (submission.status == "CE") {
    return (
      <div className="w-full pt-4">
        <button
          onClick={getBack}
          className="font-medium border-2 border-blue-300 text-blue-700
                bg-white ml-4 flex items-center px-5 py-2 rounded-md gap-2
                tracking-wide transition duration-200
                hover:border-blue-400"
        >
          <ArrowLeftIcon size={21} />
          Врати ме назад
        </button>

        <div className="flex items-center justify-center mt-6 mb-6">
          <p className="text-4xl font-bold tracking-wide text-red-700">
            Компилациска грешка!
          </p>
        </div>

        <div className="flex items-center justify-center mt-2 mb-6">
          <p className="text-2xl font-semibold tracking-normal">
            Пронајдени се следниве грешки во вашиот код:
          </p>
        </div>

        <div className="flex items-center justify-center mt-6 mb-6 mx-36">
          <code className="bg-gray-100 px-3 py-6 shadow-sm">
            {submission.errorMessage}
          </code>
        </div>

        <div className="flex items-center justify-center mt-6 mb-6 mx-36">
          <ShowCode id={id} />
          {/* <p>{submission.id}</p> */}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pt-4">
      <button
        onClick={getBack}
        className="font-medium border-2 border-blue-300 text-blue-700
                bg-white ml-4 flex items-center px-5 py-2 rounded-md gap-2
                tracking-wide transition duration-200
                hover:border-blue-400"
      >
        <ArrowLeftIcon size={21} />
        Врати ме назад
      </button>

      <div className="flex justify-center">
        <div
          className="bg-white w-[75%] border-2 border-slate-200 shadow-sm
      rounded-md mt-5 mb-5 overflow-hidden"
        >
          <div className="flex gap-4 py-6 pl-10">
            <div className="flex items-center">
              <ProgressCircle points={submission.points} />
            </div>
            <div className="flex flex-col justify-center">
              <p
                className="text-xl font-medium tracking-wide
            text-gray-700"
              >
                Резултати од тестирање
              </p>
              <p
                className="text-sm font-medium tracking-wide
            text-gray-400"
              >
                ID: {id}
              </p>
              {submission.points == 100 && (
                <p
                  className="text-xl font-medium tracking-wide
            text-green-500 pt-1"
                >
                  Задачата е успешно решена!
                </p>
              )}
            </div>
          </div>

          {/* <div className="flex items-center gap-8 mx-36">
          <button className="flex text-blue-900 text-xl items-center">
            <TimerIcon />{" "}
            <span className="ml-1 font-semibold mr-0.5">
              {Math.max(0.01, submission.timeUsed / 1000).toFixed(2)}
            </span>{" "}
            <span className="ml-1">s</span>
          </button>
          <button className="flex text-blue-900 text-xl items-center">
            <DatabaseIcon />{" "}
            <span className="ml-1 mr-0.5 font-semibold">
              {submission.memoryUsed}
            </span>{" "}
            <span className="ml-1">MB</span>
          </button>
        </div> */}

          <div
            className="flex border-t-2 border-t-gray-200
          border-b-2 border-b-gray-200 justify-between"
          >
            <div
              className="py-6 border-r-2 border-r-gray-200 flex-1
            flex justify-center items-center gap-3"
            >
              <div
                className="w-10 h-10 rounded-sm bg-blue-50 flex
              justify-center items-center border-2 rounded-sm border-blue-100"
              >
                <TimerIcon size={20} className="text-blue-600" />
              </div>
              <div>
                <p
                  className="text-sm font-medium tracking-wide
                text-slate-600"
                >
                  ВРЕМЕ
                </p>
                <div>
                  <span className="font-semibold">
                    {Math.max(0.01, submission.timeUsed / 1000).toFixed(2)}
                  </span>{" "}
                  <span className="font-medium text-slate-400">s</span>
                </div>
              </div>
            </div>
            <div
              className="py-6 flex-1 flex justify-center items-center
            gap-3"
            >
              <div
                className="w-10 h-10 rounded-sm bg-purple-50 flex
              justify-center rounded-sm items-center border-2 border-purple-100"
              >
                <DatabaseIcon size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium tracking-wide
                text-slate-600">МЕМОРИЈА</p>
                <div>
                  <span className="font-semibold">
                    {submission.memoryUsed}
                  </span>{" "}
                  <span className="font-medium text-slate-400">MB</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex pr-12 pl-12 pt-8 mb-10 justify-between items-center">
            <h3 className="text-xl font-medium text-gray-700
            tracking-wide">Поздазачи</h3>
            <p className="font-medium text-gray-400 tracking-wide
            ">{submission.subtasks.length} тестирани</p>
          </div>

          {submission.subtasks.map((subtask, key) => (
            <div
              key={key}
              className={`group cursor-pointer flex items-center justify-between
                bg-white shadow-sm rounded-md px-4 py-3.5 mx-12 mt-3 hover:bg-neutral-50
                border ${subtask.includes("AC") ? "border-green-500" : subtask == "SKIP" ? "border-gray-600" : "border-red-700"}
                ${
                  subtask.includes("AC")
                    ? "hover:border-green-500"
                    : subtask == "SKIP"
                      ? "hover:border-gray-700"
                      : "hover:border-red-800"
                }
                hover:border-mid hover:border-solid`}
            >
              <div className="flex gap-1 items-center justify-center">
                <JudgedToIcon str={subtask} />
                <p className="font-medium tracking-wide ml-1.5
                text-gray-800">Подзадача {key + 1} </p>
              </div>
              <p
                className={`font-medium tracking-wider ${
                  subtask.includes("AC")
                    ? "text-green-500"
                    : subtask == "SKIP"
                      ? "text-gray-600"
                      : "text-red-700"
                }
                    ${
                      subtask.includes("AC")
                        ? "group-hover:text-green-600"
                        : subtask == "SKIP"
                          ? "group-hover:text-gray-700"
                          : "group-hover:text-red-800"
                    }`}
              >
                {formatJudge(subtask)}{" "}
                {subtask[0] == "A" && subtask[1] == "C" && (
                  <span>({subtask.slice(2, subtask.length)})</span>
                )}
              </p>
            </div>
          ))}

          {submission.status == "JUDGING" && (
            <div
              className="flex items-center justify-between bg-gray-100
                shadow-sm rounded-md px-4 py-3.5 mx-36 mt-3 border
                border-gray-200 opacity-70"
            >
              <div className="flex gap-1 items-center justify-center">
                <ScaleIcon />
                <p className="font-semibold ml-1 5">Judging...</p>
              </div>
            </div>
          )}

          <div className="bg-gray-50 mt-10 pl-12 pr-10 pt-5
          border-t-2 border-t-gray-200 pb-8">
            <h3 className="text-xl font-medium text-gray-700
            tracking-wide">Код</h3>
            <p className="font-medium text-gray-500 tracking-wide"
            >Можете да го симнете вашиот код ако ви треба!</p>
            <ShowCode id={id} />
          </div>
        </div>
      </div>
    </div>
  );
};
