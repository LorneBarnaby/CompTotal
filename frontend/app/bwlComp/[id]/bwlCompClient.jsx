'use client'

import { Button } from "@nextui-org/react"
import { useState , useEffect} from "react";
import { set } from "react-hook-form";


export default function BwlCompClient( {comp,user,follows} ){
    
    // const {comp, user, follows} = props;
    console.log(comp, user, follows);

    const [lifters, setLifters] = useState(null)
    console.log(lifters)
    

    useEffect(() => {
        fetch(`/api/controllers/bwlCompLifters/${comp.id}`).then(res => res.json()).then(setLifters)
        setInterval(() => {
            fetch(`/api/controllers/bwlCompLifters/${comp.id}`).then(res => res.json()).then(setLifters)
        }, 3000)
        
    }, [])

    return (
        <div>
        <div className='flex items-center justify-center space-x-16'> 
            <h1>{comp.name}</h1>
            <Button color="primary">Follow</Button>
            <a href={comp.url} target="_blank">
                <Button color="danger" >Open on sport80</Button>
            </a>

           
        </div>
        <div>
        {(lifters == null)? (
                <h1>Loading...</h1>
            ) : 
                <table className="ml-auto mr-auto">
                    <thead>
                        <tr><th>Name</th><th>Club</th><th>Category</th>
                        <th>Best Snatch</th>
                        <th>Best C&J</th>
                        <th>Best Total</th>
                        <th>Number of Comps</th>
                        <th>History</th></tr>
                    </thead>
                    <tbody>
                    
                    {lifters.map((l) => {
                        return (<tr>
                            <td>{l.name}</td><td>{l.club}</td><td>{l.category}</td>
                            <td>{l.best_snatch}</td>
                            <td>{l.best_cj}</td>
                            <td>{l.best_total}</td>
                            <td>{l.num_comps}</td>
                            <td>{
                            (l.owurl != null && l.owurl != '?')? (
                                <a href={l.owurl} target="_blank">✅</a>
                            ) : <>❌</>}
                            </td>
                        </tr>)
                    })}
                    </tbody>
                </table>
            }
            
        </div>
        </div>
    )
}