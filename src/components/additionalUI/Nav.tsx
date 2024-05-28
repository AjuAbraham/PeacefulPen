"use client"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import {User} from 'next-auth'
import { Toast } from "../ui/toast"
import { Button } from "../ui/button"
const Nav = () => {
    const {data:session} = useSession();
    const user: User = session?.user as User;
    
  return (
    <nav className="p-4 md:p-6 shadow-lg">
        <div className="flex items-center justify-between">
            <a href="#" className="text-xl font-bold mb-4 md:mb-0">Peaceful Pen</a>
            <div className="flex gap-4 items-center">
            {
                session? (
                  <>
                  <span>{user.username}</span>
                  <Button onClick={()=>signOut()}>LogOut</Button>
                  </>
                ): (
                  <Link href={'/sign-in'}>
                    <Button>LogIn</Button>
                  </Link>
                )
            }
            </div>
        </div>
    </nav>
  )
}

export default Nav
