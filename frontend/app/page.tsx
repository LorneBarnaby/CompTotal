import LogInOutButton from "@/app/components/LogInOutButton";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button} from "@nextui-org/react";
import Competitions from "@/app/components/competitions";

import { redirect } from 'next/navigation'

export default function Home() {
      redirect('/bwlComp')
      return (
        <main className="m-6">
            <div>
            <Competitions />
            </div>
        </main>
      );
}