/** @format */

import CreateTask from "@/app/components/tasks/taskComps/CreateTask"
import Tasks from "@/app/components/tasks/Tasks"

export default function Today() {
  return (
    <section className="m-4">
      <div className="max-w-3xl mx-auto">
        <CreateTask />
        <hr className="mx-4 my-6 border-t-[1px] border-neutral-700 border-opacity-75" />
        <div className="mt-4">
          <Tasks />
        </div>
      </div>
    </section>
  )
}
