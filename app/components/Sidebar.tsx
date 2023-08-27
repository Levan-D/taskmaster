/** @format */
"use client"

import { useState } from "react"
import Icon from "@mdi/react"
import {
  mdiChevronRight,
  mdiOrderBoolAscendingVariant,
  mdiSync,
  mdiTrashCanOutline,
  mdiViewWeekOutline,
  mdiCheckCircleOutline,
  mdiClockAlertOutline,
} from "@mdi/js"
import Tooltip from "@/app/components/Tooltip"
import DropdownMenu from "@/app/components/DropdownMenu"
import Link from "next/link"
import { usePathname } from "next/navigation"

type Props = {
  UserInfo: JSX.Element
  LogoutBtn: JSX.Element
}

type TaskPageType =
  | {
      icon: string
      title: string
      path: string
    }
  | {
      break: boolean
    }

const taskPages: TaskPageType[] = [
  {
    icon: mdiSync,
    title: "Habits",
    path: "/dashboard/habits",
  },
  {
    icon: mdiOrderBoolAscendingVariant,
    title: "Today",
    path: "/dashboard/today",
  },
  {
    icon: mdiViewWeekOutline,
    title: "Week",
    path: "/dashboard/week",
  },
  {
    break: true,
  },
  {
    icon: mdiCheckCircleOutline,
    title: "Finished",
    path: "/dashboard/finished",
  },
  {
    icon: mdiClockAlertOutline,
    title: "Missed",
    path: "/dashboard/missed",
  },
  {
    break: true,
  },
  {
    icon: mdiTrashCanOutline,
    title: "Bin",
    path: "/dashboard/bin",
  },
]

export default function Sidebar({ UserInfo, LogoutBtn }: Props) {
  const [isOpen, setIsOpen] = useState(true)
  const pathname = usePathname()

  const toggleNav = () => {
    setIsOpen(x => !x)
  }

  const items: DropDownItemType = [
    {
      title: "test",
      action: () => console.log(`alo`),
    },
    {
      break: true,
    },
    {
      JSX: LogoutBtn,
    },
  ]

  return (
    <nav
      className={` ${
        isOpen ? "w-[200px] " : "w-[56px]"
      }  bg-neutral-950 duration-300  flex flex-col  justify-between select-none `}
    >
      <div className={`${isOpen && "flex gap-1"}`}>
        <div className="grow">
          {isOpen && (
            <DropdownMenu
              items={items}
              customCSS={"w-full block btnIcon  m-2 w-full"}
              button={UserInfo}
            />
          )}
        </div>
        <button onClick={toggleNav} className="  w-10 h-10 m-2 btnIcon ">
          <Icon
            path={mdiChevronRight}
            className={`  ${isOpen && "rotate-180 "} duration-300 mx-auto`}
            size={1}
          />
        </button>
      </div>

      <div>
        {taskPages.map((page, i) => {
          if ("icon" in page) {
            return isOpen ? (
              <Link
                key={i}
                href={page.path}
                className={`${!isOpen && "justify-center w-10"} ${
                  pathname.includes(page.path) && "!bg-neutral-700"
                } px-2 mx-2 flex gap-2 btnIcon h-10 items-center text-sm`}
              >
                <div>
                  <Icon path={page.icon} size={0.8} />
                </div>
                <p>{page.title}</p>
              </Link>
            ) : (
              <Tooltip
                key={i}
                text={page.title}
                customCSS={"translate-x-8 "}
                position="right"
              >
                <Link
                  href={page.path}
                  className={`${!isOpen && "justify-center w-10"}  ${
                    pathname.includes(page.path) && "!bg-neutral-700"
                  } px-2 mx-2 flex gap-2 btnIcon h-10 items-center text-sm`}
                >
                  <div>
                    <Icon path={page.icon} size={0.8} />
                  </div>
                </Link>
              </Tooltip>
            )
          }

          if ("break" in page) {
            return <hr key={i} className="mx-4 my-1 border-t-[1px] border-neutral-700" />
          }
        })}
      </div>

      <div></div>

      <div>
        <footer className={`text-xs p-2 text-center `}>
          {isOpen ? (
            "© 2023 Levan Dolidze. All Rights Reserved."
          ) : (
            <Tooltip position="right" text="2023 Levan Dolidze. All Rights Reserved.">
              <div className="text-center text-lg">©</div>
            </Tooltip>
          )}
        </footer>
      </div>
    </nav>
  )
}
