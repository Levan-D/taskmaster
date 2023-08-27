/** @format */

import Step from "./Step"
import { getSteps } from "@/app/actions"

type Props = {
  taskId: string
}

export default async function Steps({ taskId }: Props) {
  const steps = await getSteps({ taskId: taskId, deleted: false })

  if (steps.success)
    return (
      <div>
        {steps.data.map(step => (
          <Step key={step.id} {...step} />
        ))}
      </div>
    )
}