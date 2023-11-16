/** @format */
"use client"
import { useEffect, type ReactNode } from "react"
import Icon from "@mdi/react"
import { mdiClose } from "@mdi/js"
import { InPortal } from "react-reverse-portal"
import { createHtmlPortalNode } from "react-reverse-portal"

type PortalNodeType = ReturnType<typeof createHtmlPortalNode>

type Props = {
  title: string
  icon?: string
  node: PortalNodeType
  children: ReactNode
  isOpen: boolean
  handleClose: () => void
}

export default function Modal({
  title,
  icon,
  node,
  children,
  isOpen,
  handleClose,
}: Props) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const handleClickOutside = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      handleClose()
    }
  }

  return (
    <InPortal node={node}>
      <div
        onClick={handleClickOutside}
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${
          isOpen ? "visible opacity-100" : "collapse opacity-0"
        }`}
      >
        <div className="z-50  flex min-h-[360px] w-full max-w-[540px]  flex-col   mainContainer     md:min-h-[600px] ">
          <div className=" flex grow flex-col rounded-xl      px-6 py-4 ">
            <div className="flex  items-center justify-between">
              <div className="flex gap-1  items-center">
                {icon && <Icon path={icon} size={0.98} />}
                <h3 className="text-xl font-semibold select-none">{title}</h3>
              </div>
              <button aria-label="close" onClick={handleClose} className=" p-0.5 btnIcon">
                <Icon path={mdiClose} size={1} />
              </button>
            </div>

            <hr className="my-4 h-0.5 border-none bg-neutral-600 opacity-50" />

            <div className="flex flex-col grow">{children}</div>
          </div>
        </div>
      </div>
      ,
    </InPortal>
  )
}
