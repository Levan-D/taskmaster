/** @format */
"use client"
import { useRef, useEffect, useState, useImperativeHandle, forwardRef } from "react"

type Props = {
  children: JSX.Element
  items: DropDownItemType
  disabled?: boolean
  className?: string
  menuClassName?: string
}

const DropdownMenu = forwardRef(
  ({ items, children, disabled = false, className, menuClassName }: Props, ref) => {
    const [isDropdownMenuOpen, setIsDropdownMenuOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const setDropdownMenu = (action: () => void) => {
      setIsDropdownMenuOpen(false)
      action()
    }

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          isDropdownMenuOpen &&
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsDropdownMenuOpen(false) // close the dropdown if clicked outside
        }
      }
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [isDropdownMenuOpen])

    const handleDropdownClick = () => {
      if (!isDropdownMenuOpen) setIsDropdownMenuOpen(true) // toggle the dropdown
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === "Enter") {
        handleDropdownClick()
      }
    }

    useImperativeHandle(ref, () => ({
      closeDropdown: () => {
        setIsDropdownMenuOpen(false)
      },
    }))

    return (
      <div>
        <button
          onKeyDown={handleKeyDown}
          aria-label="Open dropdown label"
          type="button"
          disabled={disabled}
          className={`${className} block relative`}
          onMouseDown={handleDropdownClick}
        >
          {children}
        </button>
        {isDropdownMenuOpen && (
          <div
            aria-expanded={isDropdownMenuOpen}
            ref={dropdownRef}
            className={` ${menuClassName} absolute   shadow-md shadow-neutral-950 shad bg-neutral-800 border-[1px] border-neutral-700 mt-1 z-40 rounded-md text-left`}
          >
            <ul className="dropdown-menu">
              {items.map((item, i) => {
                if ("break" in item) {
                  if (item.break)
                    return (
                      <li key={i}>
                        <hr className="mx-4 my-1 border-t-[1px] border-neutral-700" />
                      </li>
                    )
                }

                if ("JSX" in item) {
                  return (
                    <li
                      className={`${item.disabled && "opacity-60"} ${
                        item.invisible && "hidden"
                      }  `}
                      key={i}
                    >
                      {item.JSX}
                    </li>
                  )
                }

                if ("title" in item) {
                  return (
                    <li key={i}>
                      <button
                        aria-label={item.title + " options"}
                        disabled={item.disabled}
                        onClick={() => setDropdownMenu(item.action)}
                        className={`${item.disabled && "opacity-60"} ${
                          item.invisible && "hidden"
                        } hover:bg-neutral-600 text-sm pl-4 pr-8 py-1.5 whitespace-nowrap rounded-md block text active:bg-neutral-700 duration-300 text-left w-full`}
                      >
                        <div className="flex items-center gap-2">
                          {item.icon && <div>{item.icon}</div>}
                          <div> {item.title}</div>
                        </div>
                      </button>
                    </li>
                  )
                }
              })}
            </ul>
          </div>
        )}
      </div>
    )
  }
)
DropdownMenu.displayName = "DropdownMenu"

export default DropdownMenu
