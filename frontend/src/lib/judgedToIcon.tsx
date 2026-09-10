import { CheckCircleIcon, CircleAlertIcon, FileOutputIcon, HourglassIcon, PauseCircle, XCircleIcon } from "lucide-react"

export const JudgedToIcon = ({ str }) => {
    if(str[0] == 'A' && str[1] == 'C') return <CheckCircleIcon className="text-green-700" />
    if(str == "OLE") return <FileOutputIcon className="text-red-700" />
    if(str == 'WA') return <XCircleIcon className="text-red-700" />
    if(str == 'RE') return <CircleAlertIcon className="text-red-700" />
    if(str == "SKIP") return <PauseCircle className="text-gray-600" />
    return <HourglassIcon className="text-red-700" />
}