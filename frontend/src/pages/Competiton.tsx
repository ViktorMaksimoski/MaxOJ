import { useEffect, useState } from "react"
import { JudgeSidebar } from "../layout/JudgeSidebar"
import { useNavigate, useParams } from "react-router"
import { mdxTaskComponents } from "../lib/mdx-task-components"
import { AnimatePresence, motion } from 'framer-motion'

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
      <div className="hidden sm:flex sm:flex-1 sm:sticky sm:top-24 
      sm:h-fit sm:self-start">
        <JudgeSidebar />
      </div>
      <div className="flex-[3] mb-4 w-full [&_b]:text-blue-900">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.p
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              Loading...
            </motion.p>
          ) : (
            Content && (
              <motion.div
                key={taskId} // 👈 VERY IMPORTANT: tells AnimatePresence when content changes
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15, ease: "easeInOut" }}
              >
                <Content components={mdxTaskComponents} />
              </motion.div>
            )
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
