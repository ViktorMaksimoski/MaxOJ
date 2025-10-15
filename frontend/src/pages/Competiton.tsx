import { useEffect, useState } from "react"
import { JudgeSidebar } from "../layout/JudgeSidebar"
import { useNavigate, useParams } from "react-router"
import { mdxTaskComponents } from "../lib/mdx-task-components"

export const Competiton = () => {
  const [Content, setContent] = useState<React.FC | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const { year, compId, taskId } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    import(`../markdown/${year}/${compId}/${taskId}.mdx`)
    .then((module) => setContent(() => module.default))
    .catch(() => navigate('/judge'))
    .finally(() => setLoading(false))
  }, [year, compId, taskId])

  return (
    <div className="flex justify-evenly w-full px-12 pt-3 gap-6">
      <div className="flex-1 sticky top-24 h-fit self-start">
        <JudgeSidebar />
      </div>
      <div className="flex-[3] mb-4 w-full [&_b]:text-blue-900">
          {loading && <p>Loading...</p>}
          {!loading && <Content components={mdxTaskComponents} />}
      </div>
    </div>
  )
}
