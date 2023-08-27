/** @format */

import CreateTask from "@/app/components/tasks/CreateTask"
import Tasks from "@/app/components/tasks/Tasks"

export default function Today() {
  return (
    <section className="m-4">
      <CreateTask />
      <div className="mt-4">
        <Tasks />
      </div>
    </section>
  )
}
