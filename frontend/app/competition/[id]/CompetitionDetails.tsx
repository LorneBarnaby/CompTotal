'use client'

import {Competition} from "@prisma/client";
export const CompetitionDetails = ({comp}: {comp:Competition}) => {
    console.log(comp)
    return (
        <div>
            <p>{comp.name}</p>
        </div>

    )
};