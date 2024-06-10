
import { BwlComp } from "@prisma/client"
import prisma from "@/prismaconfig";

async function listComps(){
    const comps = await prisma.bwlComp.findMany({
        orderBy : [
            {fromDate: 'asc'}
        ]
    });
    return comps; 
}

export default async function Page(){
    const comps = await listComps();
    console.log(comps.length);
    return (
        <>
            <table className="ml-auto mr-auto">
                <thead>
                    <tr><th>Name</th><th>Date</th></tr>
                </thead>
                <tbody>
                    {comps.map((comp => {
                        return (
                            <tr>
                                <td>
                                    <a href={`/bwlComp/${comp.id}`}>{comp.name}</a>
                                </td>
                                <td>{comp.fromDate.toLocaleDateString()} - {comp.toDate.toLocaleDateString()}</td>
                            </tr>
                            )
                    }))}
                </tbody>
            </table>
        </>
    )
}