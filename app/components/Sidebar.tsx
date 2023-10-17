/** @format */
"use client"

import { useState } from "react"
import Icon from "@mdi/react"
import {
  mdiChevronRight,
  mdiSync,
  mdiTrashCanOutline,
  mdiCheckCircleOutline,
  mdiClockAlertOutline,
  mdiCalendarWeekOutline,
  mdiCalendarTodayOutline,
  mdiCalendarMonthOutline,
} from "@mdi/js"
import Tooltip from "@/app/components/Tooltip"
import DropdownMenu from "@/app/components/DropdownMenu"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAppSelector } from "@/lib/redux/hooks"

type Props = {
  UserInfo: JSX.Element
  LogoutBtn: JSX.Element
}

type TaskPageType =
  | {
      icon: string
      title: string
      path: string | { pathname: string; query: { [index: string]: any } }
    }
  | {
      break: boolean
    }

const taskPages: TaskPageType[] = [
  // {
  //   icon: mdiSync,
  //   title: "Habits",
  //   path: "/dashboard/habits",
  // },
  // {
  //   break: true,
  // },
  {
    icon: mdiCalendarTodayOutline,
    title: "Today",
    path: "/dashboard/today",
  },
  {
    icon: mdiCalendarWeekOutline,
    title: "Week",
    path: "/dashboard/week",
  },
  {
    icon: mdiCalendarMonthOutline,
    title: "Future",
    path: "/dashboard/future",
  },
  {
    break: true,
  },
  {
    icon: mdiCheckCircleOutline,
    title: "Finished",
    path: { pathname: "/dashboard/finished", query: { page: 1 } },
  },
  {
    icon: mdiClockAlertOutline,
    title: "Missed",
    path: { pathname: "/dashboard/missed", query: { page: 1 } },
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

function Footer({ width, isOpen }: { width: number; isOpen: boolean }) {
  return (
    <footer className={`text-xs p-2 text-center `}>
      {(width > 640 || isOpen) &&
        (isOpen ? (
          "© 2023 Levan Dolidze. All Rights Reserved."
        ) : (
          <Tooltip position="right" text="2023 Levan Dolidze. All Rights Reserved.">
            <div className="text-center text-lg">©</div>
          </Tooltip>
        ))}
    </footer>
  )
}

function Links({
  isOpen,
  width,
  toggleNav,
  pathname,
}: {
  isOpen: boolean
  width: number
  toggleNav: () => void
  pathname: string
}) {
  return (
    <div>
      {taskPages.map((page, i) => {
        if ("icon" in page) {
          return (
            (width > 640 || isOpen) && // Only render if width > 640 or isOpen is true
            (isOpen ? (
              <Link
                key={i}
                onClick={width <= 640 ? toggleNav : undefined}
                href={page.path}
                className={`${!isOpen && "justify-center w-10"} ${
                  pathname.includes(
                    typeof page.path === "string" ? page.path : page.path.pathname
                  ) && "!bg-neutral-800"
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
                className={"translate-x-7 "}
                position="right"
              >
                <Link
                  href={page.path}
                  className={`${!isOpen && "justify-center w-10"}  ${
                    pathname.includes(
                      typeof page.path === "string" ? page.path : page.path.pathname
                    ) && "!bg-neutral-800"
                  } px-2 mx-2 flex gap-2 btnIcon h-10 items-center text-sm`}
                >
                  <div>
                    <Icon path={page.icon} size={0.8} />
                  </div>
                </Link>
              </Tooltip>
            ))
          )
        }

        if ("break" in page) {
          return (
            (width > 640 || isOpen) && ( // Only render if width > 640 or isOpen is true
              <hr key={i} className="mx-4 my-1 border-t-[1px] border-neutral-800" />
            )
          )
        }
      })}
    </div>
  )
}

export default function Sidebar({ UserInfo, LogoutBtn }: Props) {
  const { windowWidth } = useAppSelector(state => state.global)
  const [isOpen, setIsOpen] = useState(false)
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
    <div className={` ${isOpen ? "sm:w-[200px] " : "sm:w-[56px]"} w-0 shrink-0`}>
      {windowWidth <= 640 && (
        <div
          className={` ${
            isOpen ? "visible opacity-40" : "collapse opacity-0"
          }  fixed top-0 right-0 bottom-0 left-0 z-30 bg-neutral-950 duration-300`}
          onMouseDown={toggleNav}
        ></div>
      )}

      <nav
        className={` ${
          isOpen ? "w-[200px] bg-neutral-950 h-screen" : "w-[56px]"
        }    sm:h-screen fixed sm:bg-neutral-950  duration-300   z-50  flex flex-col  justify-between select-none `}
      >
        <div className={`${isOpen && "flex gap-1"}`}>
          <div className="grow">
            {isOpen && (
              <DropdownMenu
                menuClassName="translate-x-12"
                items={items}
                className={"  grow  btnIcon  m-2 w-full"}
                button={UserInfo}
              />
            )}
          </div>
          <button onClick={toggleNav} className=" bg-neutral-950 w-10 h-10 m-2 btnIcon ">
            <Icon
              path={mdiChevronRight}
              className={`  ${isOpen && "rotate-180 "} duration-300 mx-auto`}
              size={1}
            />
          </button>
        </div>

        <Links
          width={windowWidth}
          isOpen={isOpen}
          pathname={pathname}
          toggleNav={toggleNav}
        />

        <div></div>

        <Footer width={windowWidth} isOpen={isOpen} />
      </nav>
    </div>
  )
}
