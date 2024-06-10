'use client'
import { useSession, signIn, signOut } from "next-auth/react"
import {Button} from "@nextui-org/react"

export default function LogInOutButton() {
    const { data: session } = useSession();

    return (<>
           {session ? (
                    <Button color="primary" variant="ghost" onClick={() => signOut()}>Sign Out</Button>
            )
             : (
                    <Button color="primary" variant="flat" onClick={()=>signIn()}>Sign In</Button>
                )
            }</>
    );
}
