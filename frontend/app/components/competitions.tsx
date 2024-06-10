import prisma from '@/prismaconfig.ts'
import {Button} from "@nextui-org/react";
import NewCompModal from "@/app/components/NewCompModal";
import {getServerSession} from "next-auth/next";
import {AuthOptions} from "@/app/api/auth/[...nextauth]/route";


export default async function Competitions() {


    const session = await getServerSession(AuthOptions)

    if (!session){
        return <></>
    }

    const user = await prisma.user.findUnique({
        where: {
            email: session.user.email,
        },
    });

    const comps = await prisma.competition.findMany({
        where:{
            ownerId: user.id
        }
    });


    return (
        <div>
            <div className="flex w-full">
                <div className="p-4 flex">
                <p>Competitions</p>
                </div>
            </div>

            <div className="border-2 border-black">
                <ul>
                {
                    comps.map(c => {
                        return (<li><a href={`/competition/${c.id}`}>{c?.name}</a></li>)
                    })
                }
                </ul>
            </div>
            <NewCompModal />

        </div>
    )
}
