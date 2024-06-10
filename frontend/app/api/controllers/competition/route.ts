'use server'
import prisma from "@/prismaconfig"
import { getServerSession } from "next-auth/next"
import { AuthOptions } from "@/app/api/auth/[...nextauth]/route"
import {NextResponse} from "next/server";


export async function POST(req,res) {
    const session = await getServerSession(AuthOptions)

    if (session == null){
        return NextResponse.json({message: "Nope no session"}, {status:403});
    }
    const data = await req.json();
    // console.log('server', data);
    // return <pre>{JSON.stringify(session, null, 2)}</pre>
    const user = await prisma.user.findUnique({
        where: {
            email: session.user.email,
        },
    });
    const newComp = prisma.competition.create({
        data:{
            name: data.name,
            startDate: data.date?new Date(data.date).toISOString():null,
            ownerId: user.id,
        }
    }).then((e) => {
        console.log(e);
    })
    console.log(session, user, newComp);
    return NextResponse.json({message: ""}, {status:200});
}