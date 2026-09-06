import { data, useParams } from "react-router"
import { JudgeSidebar } from "../layout/JudgeSidebar"
import { useEffect, useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { SubmissionPreview } from "../components/SubmissionPreview"
import { Loading } from "../components/Loading"

export const GetSubmissions = () => {
    const { year, compId, taskId } = useParams()
    const [subs, setSubs] = useState([])
    const { user, loading } = useAuth()
    const [load, setLoad] = useState(true)
    const [limit, setLimit] = useState(false);

    useEffect(() => {
        const getSubmissions = async () => {
            if(!user) return ;
            setLoad(true)

            const pid = `${year}${compId}${taskId}`;
            const token = await user?.getIdToken();

            const res = await fetch(`http://localhost:5001/api/submission/${pid}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            })


            const data = await res.json();
            console.log(data.success)
            console.log(data.reset)

            setLimit(!data.success)
            setLoad(false);

            if(data.success) setSubs(data.data)
            else console.log(data.message)
        }

        getSubmissions();
    }, [year, compId, taskId, user])

    if(load) {
        return <Loading />
    }

    if(limit) {
        return (
            <p>Limit exceeded</p>
        )
    }

    return (
        <div className="flex justify-evenly w-full px-12 pt-3 gap-6">
              <div className="hidden sm:flex sm:flex-1 sm:sticky sm:top-24 
                sm:h-fit sm:self-start">
                <JudgeSidebar />
              </div>
              <div className="flex-[3] mb-4 w-full [&_b]:text-blue-900">
                {subs.map((sub) => (
                    <SubmissionPreview id={sub.id} key={sub.id}
                    points={sub.points} date={sub.createdAt} />
                ))}
              </div>
        </div>
    )
}