/** @format */
"use client"

import { getCompletedTasks } from "../../actions"
import TaskDisplay from "./TaskDisplay"
import { useTransition, useState, useEffect } from "react"
import Pagination from "@/app/components/Pagination"

export default function Finished() {
  const take = 20
  const [skip, setSkip] = useState(0)

  const [isPending, startTransition] = useTransition()
  const [tasks, setTasks] = useState<{
    success: boolean
    data?: Task[]
    totalCount?: number
  } | null>(null)

  const handleTaskFetch = async () => {
    const result = await getCompletedTasks({ deleted: false, skip: skip, take: take })
    setTasks(result)
  }

  useEffect(() => {
    startTransition(() => {
      handleTaskFetch()
    })
  }, [skip])

  if (isPending && !tasks)
    return (
      <div className="w-fit mx-auto min-h-screen flex flex-col justify-center   ">
        <div className="loader"></div>
      </div>
    )

  if (tasks === null || !tasks.success || !tasks.totalCount) return <span></span>

  return (
    <section className=" flex  flex-col max-w-3xl mx-auto min-h-screen ">
      {!isPending ? (
        <div className="flex-1">
          <TaskDisplay tasks={tasks.data ? tasks.data : []} />
        </div>
      ) : (
        <div className="w-fit mx-auto flex-1 flex flex-col justify-center   ">
          <div className="loader"></div>
        </div>
      )}

      <Pagination
        totalCount={tasks.totalCount}
        take={take}
        skip={skip}
        setSkip={setSkip}
        disabled={isPending}
        className="w-fit mx-auto my-16"
      />
    </section>
  )
}
