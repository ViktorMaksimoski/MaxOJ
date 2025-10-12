import { ComputerIcon } from "lucide-react"

export const Home = () => {
  return (
    <div className="text-center pt-20">
      <button className="bg-gray-100 rounded-full px-10 py-10 text-blue-600 text-4xl">
        <ComputerIcon className="size-9" />
      </button>
      <p className="mt-4 font-bold text-lg text-blue-700">Сакате успех во натпреварите по програмирање?</p>
      <p className="mt-2">Со помош на лекциите и задачите на <span className="font-bold">MaxOJ</span> тоа лесно ќе го остварите.</p>
      <p>Најкомплицираните методи и алгоритми објаснети лесно и разбирливо.</p>
    </div>
  )
}
