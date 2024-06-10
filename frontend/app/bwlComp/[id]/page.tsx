'use server'

import { isLoggedIn } from '@/app/api/auth/permissions/accessControl';
import { getComp, userFollows } from '@/app/bwlComp/[id]/bwlComp';
import { Button } from '@nextui-org/react';
import BwlCompClient from "@/app/bwlComp/[id]/bwlCompClient"; 
import { redirect } from 'next/navigation'

export default async function Page({ params }: { params: { id: Number } }) {

    const comp = await getComp(params.id);
    console.log(comp); 

    if(comp == null){
        redirect('/bwlComp')
    }

    const user = await isLoggedIn();

    let follows = false;
    if(user){
        follows = await userFollows(comp.id, user);
    }
    
    
    return (

        <div className='flex items-center justify-center bg-slate-600'>
            <div className='bg-slate-400 w-2/3'>
               <BwlCompClient user={user} follows={follows.toString()} comp={comp} />
            </div>
            
        </div>
        )
}

