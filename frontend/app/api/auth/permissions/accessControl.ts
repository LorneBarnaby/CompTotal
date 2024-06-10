'use server'

import {getServerSession} from "next-auth/next";
import {AuthOptions} from "@/app/api/auth/[...nextauth]/route";
import {NextResponse} from "next/server";
import prisma from "@/prismaconfig";
import {Competition} from "@prisma/client";

export async function canAccessComp(compId) : Promise<Competition | null>{
    const session = await getServerSession(AuthOptions)
    
    // console.log(session, typeof session, typeof null, session == null);
    if (session == null){
        return null;
    } else {
        const user = await prisma.user.findUnique({
            where: {
                email: session.user.email,
            },
        });

        const comp = await prisma.competition.findUnique({
            where: {id:parseInt(compId)}
        });

        if(!comp){
            return null;
        } else {
            if(comp.ownerId == user.id){
                return comp;
            }
            return null;
        }
    }
}


export async function isLoggedIn(){
    const session = await getServerSession(AuthOptions);
    if(session != null){
        const user = await prisma.user.findUnique({
            where: {
                email: session.user.email,
            },
        });
        return user; 
    }
    return undefined;
}