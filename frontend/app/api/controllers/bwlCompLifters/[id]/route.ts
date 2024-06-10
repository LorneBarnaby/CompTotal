

'use server'
import prisma from "@/prismaconfig"
import { getServerSession } from "next-auth/next"
import { AuthOptions } from "@/app/api/auth/[...nextauth]/route"
import {NextResponse} from "next/server";
import { createClient } from 'redis';


export async function GET(request: Request,
    { params }: { params: { id: string } }
  ) {
    const id = parseInt(params.id) 
    if(isNaN(id)) return NextResponse.json({message: "beep boop"}, {status:403});

    console.log(id)
    const lifters = await getData(id);
    return NextResponse.json(lifters, {status:200});
    


}


const getData = (id) => {
    return new Promise(async (resolve) => {

        const lifters = await prisma.bwlCompLifter.findMany({
            where:{
                bwlCompId: id
            },
            orderBy: [
                {
                    category : 'asc'
                },
                {
                    best_total: 'desc'
                }
            ]
        })
    
        if(lifters.length == 0){
            const client = createClient();
            client.on('error', err => console.log('Redis Client Error', err));
    
    
            await client.connect();
    
            await client.publish("fetches", id.toString());
    
            await client.subscribe(`${id}`, async (args) => {
                console.log('got message', args);
    
                const lifters2 = await prisma.bwlCompLifter.findMany({
                    where:{
                        bwlCompId: id,
                        
                    },
                    orderBy: [
                        {
                            category : 'asc'
                        },   {
                            best_total: 'desc'
                        }
                    ]
                })

                resolve(lifters2)
            })
        }
        else{
            resolve(lifters)
        }
    })
} 