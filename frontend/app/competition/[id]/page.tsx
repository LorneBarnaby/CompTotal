'use server'

import {canAccessComp} from "@/app/api/auth/permissions/accessControl";
import {Competition} from "@prisma/client";
import {CompetitionDetails} from "@/app/competition/[id]/CompetitionDetails";

export default async function Page({ params }: { params: { id: Number } }) {
    const comp : Competition | null = await canAccessComp(params.id);
    if(comp){
        return(
            <div className="m-6">
                <CompetitionDetails comp={comp} />
            </div>

        )
    } else {
        return <p>No</p>
    }

}
