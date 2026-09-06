import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'
import { ArrowLeftIcon, DatabaseIcon, ScaleIcon, TimerIcon } from 'lucide-react'
import { formatJudge } from '../lib/formatJudged'
import { JudgedToIcon } from '../lib/judgedToIcon'
import { ShowCode } from '../components/ShowCode'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'
import { Loading } from '../components/Loading'

const ProgressCircle = ({ points }) => {
    const radius = 45;
    const perim = 2 * Math.PI * radius;

    const off = perim - (Math.max(points, 0.5) / 100) * perim;
    const hue = (Math.max(points, 0.5) / 100) * 120;

    return (
        <div className="relative w-36 h-36">
            <svg className="h-full w-full -rotate-90"
            viewBox='0 0 100 100'>
                <circle cx="50" cy="50" r={radius} fill="none" stroke="#e5e7eb"
                    strokeWidth="8" />

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

            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-extrabold" style={{color: `hsl(${hue}, 80%, 50%)` }}>
                    {points}
                </span>
            </div>
        </div>
    )
}

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
        for(let i=pid.length-1; i>=0; i--) {
            if(pid[i] < '0' || pid[i] > '9') {
                j = i + 1;
                break;
            }
        }

        const contest = pid.slice(4, j);
        const task = pid.slice(j, pid.length);

        navigate(`/judge/${year}/${contest}/${task}`)
    }

    useEffect(() => {
        if(!id || !user) return ;

        const getSubmission = async () => {
            const ref = doc(db, "submissions", id);

            const url = import.meta.env.VITE_BACKEND_URL;
            const token = await user?.getIdToken();
            const res = await fetch(`${url}/api/submission/single/${id}`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            })

            const data = await res.json();

            if(!data.success) {
                toast.error(data.message);
                return ;
            }

            const unsub = onSnapshot(
                ref,
                (snap) => {
                    console.log("Exists: ", snap.exists)
                    if(snap.exists()) {
                        setSubmission(snap.data())
                    } else {
                        setSubmission(null)
                    }
                    setload(false)   
                },
                (err) => {
                    console.log("Error load submission ", err.code, err.message);
                    setload(false)
                }
            )
            return () => unsub()
        }

        getSubmission();
    }, [id, user])

    if(load) {
        return <Loading />
    }

    if(!submission) {
        return (
            <p>Решението не е пронајдено {id}</p>
        )
    }

    if(submission.status == 'CE') {
        return (
            <div className="w-full pt-4">
                <button onClick={getBack}
                className="font-medium text-blue-700 ml-4 text-lg gap-2
                flex items-center border rounded-md border-blue-700 shadow-sm border-2 px-3.5 py-1
                hover:text-blue-800 hover:border-blue-800">
                    <ArrowLeftIcon />
                    Врати ме назад
                </button>

                <div className="flex items-center justify-center mt-6 mb-6">
                    <p className='text-4xl font-bold tracking-wide text-red-700'>Компилациска грешка!</p>
                </div>

                <div className="flex items-center justify-center mt-2 mb-6">
                    <p className='text-2xl font-semibold tracking-normal'>Пронајдени се следниве грешки во вашиот код:</p>
                </div>

                <div className="flex items-center justify-center mt-6 mb-6 mx-36">
                    <code className='bg-gray-100 px-3 py-6 shadow-sm'>{submission.errorMessage}</code>
                </div>

                <div className="flex items-center justify-center mt-6 mb-6 mx-36">
                    <ShowCode id={id} />
                    {/* <p>{submission.id}</p> */}
                </div>
            </div>
        )
    }

    return (
        <div className="w-full pt-4">
            <button onClick={getBack}
            className="font-medium text-blue-700 ml-4 text-lg gap-2
             flex items-center border rounded-md border-blue-700 shadow-sm border-2
             px-3.5 py-1 hover:text-blue-800 hover:border-blue-800">
                <ArrowLeftIcon />
                Врати ме назад
            </button>

            <div className="flex items-center justify-center mt-6 mb-6">
                <ProgressCircle points={submission.points} />
            </div>

            <div className="flex items-center gap-8 mx-24">
                <button className="flex text-blue-900 text-xl items-center">
                    <TimerIcon /> <span className="ml-1 font-semibold mr-0.5">{Math.max(0.01, submission.timeUsed/1000).toFixed(2)}</span> <span className="ml-1">s</span>
                </button>
                <button className="flex text-blue-900 text-xl items-center">
                    <DatabaseIcon /> <span className="ml-1 mr-0.5 font-semibold">{submission.memoryUsed}</span> <span className="ml-1">MB</span>
                </button>
            </div>

            {submission.subtasks.map((subtask, key) => (
                <div key={key} className={`group flex items-center justify-between
                bg-white shadow-sm rounded-md px-4 py-3.5 mx-24 mt-3 hover:bg-neutral-50
                border ${subtask.includes("AC") ? 'border-green-700' : 'border-red-700'}
                ${subtask.includes("AC") ? 'hover:border-green-800' : 'hover:border-red-800'}
                hover:border-mid hover:border-solid`}>
                    <div className='flex gap-1 items-center justify-center'>
                        <JudgedToIcon str={subtask} />
                        <p className='font-semibold ml-1.5'>Subtask {key+1} </p>
                    </div>
                    <p className={`font-bold tracking-wider ${subtask.includes('AC') ? 'text-green-700' : 'text-red-700'}
                    ${subtask.includes('AC') ? 'group-hover:text-green-800' : 'group-hover:text-red-800'}`}
                >{formatJudge(subtask)} {(subtask[0]=='A'&& subtask[1] == 'C' && 
                    <span>
                        ({ subtask.slice(2, subtask.length) })
                    </span>
                )}</p>
                </div>
            ))}

            {submission.status == "JUDGING" && (
                <div className='flex items-center justify-between bg-gray-100
                shadow-sm rounded-md px-4 py-3.5 mx-24 mt-3 border
                border-gray-200 opacity-70'>
                    <div className="flex gap-1 items-center justify-center">
                        <ScaleIcon />
                        <p className="font-semibold ml-1 5">Judging...</p>
                    </div>
                </div>    
            )}

            <div className="flex items-center justify-center mt-6 mb-6 mx-36">
                <ShowCode id={id} />
            </div>
        </div>
    )
}