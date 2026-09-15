import { ArrowRightCircleIcon } from "lucide-react"
import { useEffect } from "react";
import { useNavigate } from "react-router"

export const SubmissionPreview = ({ id, date, points }) => {
    const navigate = useNavigate();

    const hue = (Math.max(points, 0.5) / 100) * 120;

    return (
        <div className="flex bg-white rounded-md shadow-sm pl-3 pr-5 py-2.5 
        mb-6 cursor-pointer items-center justify-between border hover:shadow-md"
        style={{ borderColor: `hsl(${hue}, 80%, 50%)` }}
        onClick={() => navigate(`/judge/submission/${id}`)}>
            <div>
                <h3 className="text-xl font-semibold tracking-wide">Решение #{id}</h3>
                <p className="text-sm text-gray-500 mt-1.5">
                    {new Date(date._seconds * 1000).toLocaleString("mk-MK", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false
                    })}
                </p>
            </div>
            <div className="flex items-center gap-10">
                <p className="mr-2 font-medium text-lg tracking-wider"
                style={{ color: `hsl(${hue}, 80%, 50%)` }}>
                    {points}
                    <span className="font-normal text-gray-400"> / 100 </span>
                </p>
                <ArrowRightCircleIcon size={28}
                style={{ color: `hsl(${hue}, 80%, 50%)`}} />
            </div>
        </div>
    )
}