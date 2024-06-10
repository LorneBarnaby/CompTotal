'use server'

import {getServerSession} from "next-auth/next";
import {AuthOptions} from "@/app/api/auth/[...nextauth]/route";
import {NextResponse} from "next/server";
import prisma from "@/prismaconfig";
import {BwlComp, User, BwlEventFollower} from "@prisma/client";

export async function getComp(compId) : Promise<BwlComp | null>{
    if (compId == null) return null;

    const comp = await prisma.bwlComp.findUnique({
        where : {
            id: parseInt(compId)
        }
    }
    )
    console.log('here', comp); 
    return comp;
}


export async function userFollows (compId: number, user : User) : Promise<boolean>{
    const followRelation = await prisma.bwlEventFollower.count({
        where: {
            bwlCompId: compId,
            followerId: user.id
        }
    })

    return (followRelation != null); 
}