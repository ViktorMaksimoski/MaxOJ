import { useState, useEffect } from "react"
import { NavLink } from "react-router"
import type { LectionLink, Topic } from "../models/Topic.interface";

interface SidebarProps {
    topicId: string;
};

export const Sidebar = ({ topicId }: SidebarProps) => {
  const [lections, setLections] = useState<LectionLink[]>([])
  const [topicName, setTopicName] = useState<string>("")

  useEffect(() => {
    setLections([])

    const f = (d: Topic) => {
      setLections(d.lections)
      setTopicName(d.topic_name)
    }

    fetch(`/data/lections/${topicId}.json`)
    .then(res => res.json())
    .then(data => f(data));

    console.log(`Fetched from /data/lections/${topicId}.json`)
  }, [topicId])

  return (
    <aside className="w-full rounded-lg border border-blue-400 bg-white
    p-2 shadow-sm">
      <h3 className="px-3 py-2 text-sm font-semibold tracking-wide
      text-blue-500 uppercase">{topicName}</h3>

      <nav className="mt-1">
        {lections.map((lec) => (
          <NavLink key={lec.code}
          to={`/topic/${topicId}/${lec.code}`}
          className={({ isActive }) => `
            block rounded-lg px-3 py-2
            font-medium
            transition-all duration-150 mb-1
            text-[15px]
            ${
              isActive
              ? 'bg-blue-50 text-blue-700 shadow-sm'
              : 'text-gray-800 hover:bg-blue-50 hover:text-blue-700'
            }
          `}>
            {lec.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
