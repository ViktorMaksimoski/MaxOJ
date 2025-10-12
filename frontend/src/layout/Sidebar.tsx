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
    <div className="border shadow-sm shadow-blue-200 rounded-md border-blue-400 py-1.5 px-4 w-full">
      <h3 className="font-semibold mb-4 text-blue-700">{topicName}</h3>
      {lections.map(lec => (
        <div key={lec.code}>
          <NavLink to={`/topic/${topicId}/${lec.code}`}
          className={({ isActive }) => isActive ? `text-blue-600` : `text-base`}>
            <button className="hover:text-blue-400">
              {lec.name}
            </button>
          </NavLink>
        </div>
      ))}
    </div>
  )
}
