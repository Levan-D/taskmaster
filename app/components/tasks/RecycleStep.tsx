/** @format */

"use client"
import { recycleStep } from "../../actions"
import { useTransition } from "react"
import { useRouter } from "next/navigation"
import Icon from '@mdi/react';
import { mdiTrashCanOutline } from '@mdi/js';


type Props = { stepId: string }

export default function RecycleStep({ stepId }: Props) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleRecycleStep = async () => {
    await recycleStep({ stepId: stepId })
    router.refresh()
  }

  return (
    <button
      className="btnError"
      onClick={() => {
        startTransition(handleRecycleStep)
        router.refresh()
      }}
    >
      <Icon path={mdiTrashCanOutline} size={0.8} />
    </button>
  )
}
