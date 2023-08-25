/** @format */
"use client"

import { useState } from "react"
import Icon from "@mdi/react"
import { mdiChevronRight } from "@mdi/js"
import Tooltip from "@/app/components/Tooltip"
import DropdownMenu from "@/app/components/DropdownMenu"

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

  return (
    <nav
      className={` ${
        isOpen ? "w-[280px] " : "w-[48px]"
      }  bg-neutral-950 duration-300  flex flex-col  justify-between select-none `}
    >
      <div className="flex ">
        <div className="grow">
          {isOpen && (
            <DropdownMenu
              items={items}
              customCSS={"w-full block btnIcon rounded-md w-full"}
              button={UserInfo}
            />
          )}
        </div>
        <button onClick={toggleNav} className="  w-8 h-8 m-2 btnIcon ">
          <Icon
            path={mdiChevronRight}
            className={`  ${!isOpen && "rotate-180 "} duration-300 mx-auto`}
            size={1}
          />
        </button>
      </div>

      <div>
        <div>eqwewqe</div>
        <div>eqwewqe</div>
        <div>eqwewqe</div>
        <div>eqwewqe</div>
      </div>

      <div>
        <div>eqwewqe</div>
        <div>eqwewqe</div>
        <div>eqwewqe</div>
        <div>eqwewqe</div>

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

//          <LogoutLink className="text-[#3377ff]">Log out</LogoutLink>
