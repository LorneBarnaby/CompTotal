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

    if (user != null && data.compId){
        return NextResponse.json({message: "No User"}, {status:403});
    }

    const follow = prisma.bwlEventFollower.create({
        data:{
            bwlCompId: data.compId,
            followerId: user?.id
        }
    }).then((e) => {
        return NextResponse.json({message: e.toString()}, {status:500});
    })
    
    return NextResponse.json({message: ""}, {status:200});
}