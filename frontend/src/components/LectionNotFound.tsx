import { NotebookTextIcon } from "lucide-react"

export const LectionNotFound = () => {
  return (
    <div className="text-center pt-20">
      <button className="bg-gray-100 rounded-full px-10 py-10 text-blue-600 text-4xl">
        <NotebookTextIcon className="size-9" />
      </button>
      <p className="mt-4 font-bold text-lg text-blue-700">Одберете лекција за да започнете!</p>
      <p className="mt-2">Со помош на лекциите и задачите на <span className="font-bold">MaxOJ</span> успехот е загарантиран.</p>
      <p>Најкомплицираните методи и алгоритми објаснети лесно и разбирливо.</p>
    </div>
  )
}
