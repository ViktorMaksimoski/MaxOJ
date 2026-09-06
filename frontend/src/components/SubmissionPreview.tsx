import { ArrowRightCircleIcon } from "lucide-react"
import { useEffect } from "react";
import { useNavigate } from "react-router"

export const SubmissionPreview = ({ id, date, points }) => {
    const navigate = useNavigate();

    const hue = (Math.max(points, 0.5) / 100) * 120;

    return (
        <div className="flex bg-white rounded-md shadow-md pl-3 pr-5 py-2.5 
        mb-6 cursor-pointer items-center justify-between border
        hover:border-2 hover:shadow-lg"
        style={{ borderColor: `hsl(${hue}, 80%, 50%)` }}
        onClick={() => navigate(`/judge/submission/${id}`)}>
            <div>
                <h3 className="text-xl font-semibold">Решение #{id}</h3>
                <p className="mt-1.5 text-sm text-gray-600">
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
                <p className="text-lg font-semibold"
                style={{ color: `hsl(${hue}, 80%, 50%)` }}>{points}</p>
                <ArrowRightCircleIcon size={28}
                style={{ color: `hsl(${hue}, 80%, 50%)`}} />
            </div>
        </div>
    )
}