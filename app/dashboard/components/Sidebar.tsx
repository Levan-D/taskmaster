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
} from "@mdi/js"
import Tooltip from "@/app/components/Tooltip"
import DropdownMenu from "@/app/components/DropdownMenu"
import Link from "next/link"

type Props = {
  UserInfo: JSX.Element
  LogoutBtn: JSX.Element
}

export default function Sidebar({ UserInfo, LogoutBtn }: Props) {
  const [isOpen, setIsOpen] = useState(true)

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

  const taskPages = [
    {
      icon: mdiSync,
      title: "mdiSync",
      path: "",
    },
    {
      icon: mdiOrderBoolAscendingVariant,
      title: "mdiOrderBoolAscendingVariant",
      path: "",
    },
    {
      icon: mdiViewWeekOutline,
      title: "mdiViewWeekOutline",
      path: "",
    },
    {
      icon: mdiTrashCanOutline,
      title: "mdiTrashCanOutline",
      path: "",
    },
  ]

  return (
    <nav
      className={` ${
        isOpen ? "w-[280px] " : "w-[60px]"
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
        {taskPages.map((page, i) => (
          <Link
            key={i}
            href={page.path}
            className={`${
              !isOpen && "justify-center w-10"
            } px-2 mx-2 flex gap-2 btnIcon h-10 items-center`}
          >
            <div>
              <Icon path={page.icon} size={1} />
            </div>
            {isOpen && <p>{page.title}</p>}
          </Link>
        ))}
      </div>

      <div></div>

      <div>
        <footer className={`text-xs p-2 `}>
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
