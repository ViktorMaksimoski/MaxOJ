import { CheckCircleIcon, CircleAlertIcon, HourglassIcon, XCircleIcon } from "lucide-react"

export const JudgedToIcon = ({ str }) => {
    if(str[0] == 'A' && str[1] == 'C') return <CheckCircleIcon className="text-green-700" />
    if(str == 'WA') return <XCircleIcon className="text-red-700" />
    if(str == 'RE') return <CircleAlertIcon className="text-red-700" />
    return <HourglassIcon />
}