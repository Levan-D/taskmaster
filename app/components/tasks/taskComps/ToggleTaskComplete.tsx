/** @format */

import { toggleTaskComplete } from "@/app/actions/taskActions"
import { useTransition } from "react"
import Icon from "@mdi/react"
import { mdiCheckBold } from "@mdi/js"

type Props = {
  task: Task
  addOptimisticTask: (action: Task[]) => void
  expired: boolean
}

export default function ToggleTaskComplete({ task, addOptimisticTask, expired }: Props) {
  const [isPending, startTransition] = useTransition()

  const handleToggleTaskComplete = async () => {
    addOptimisticTask([{ ...task, complete: !task.complete }])

    await toggleTaskComplete({ taskId: task.id, complete: !task.complete })
  }

  return (
    <button
      disabled={isPending || task.deleted || expired}
      className={` ${
        task.complete
          ? "bg-lime-600 md:hover:bg-lime-500"
          : "bg-neutral-950 md:hover:bg-neutral-900"
      } block  rounded-tl-lg rounded-br-lg p-1 sm:p-2 duration-300 transition-colors   `}
      onClick={() => startTransition(handleToggleTaskComplete)}
    >
      <Icon
        path={mdiCheckBold}
        className={`${
          task.complete
            ? "text-white"
            : task.priority === "LOW"
            ? "text-sky-400"
            : task.priority === "MEDIUM"
            ? "text-amber-400"
            : "text-rose-400"
        }  scale-75 sm:scale-100`}
        size={1}
      />
    </button>
  )
}
