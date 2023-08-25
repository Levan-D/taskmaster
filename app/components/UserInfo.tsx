/** @format */

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import Image from "next/image"

export default function UserInfo() {
  const { getUser } = getKindeServerSession()
  const user = getUser()

  return (
    <div className="flex items-center gap-2 w-full  p-1 ">
      {user?.picture ? (
        <Image
          className="rounded-md"
          src={user?.picture}
          width={40}
          height={40}
          alt="user profile avatar"
        />
      ) : (
        <div className="bg-lime-500 text-neutral-950 rounded-md  w-8 h-8   items-center flex flex-col justify-center">
          {user?.given_name?.[0]}
          {user?.family_name?.[0]}
        </div>
      )}
      <p className="">{user?.given_name}</p>
    </div>
  )
}
