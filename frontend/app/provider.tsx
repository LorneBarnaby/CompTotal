"use client";


import React from "react"

import { SessionProvider } from "next-auth/react";
import {NextUIProvider} from '@nextui-org/react'
import {ThemeProvider as NextThemesProvider} from "next-themes";


type Props = {
    children?: React.ReactNode;
};

export const NextAuthProvider = ({ children, session }: Props) => {
    return (
        <SessionProvider session={session}>
            <NextUIProvider>
                <NextThemesProvider attribute="class" defaultTheme="light">
                    {children}
                </NextThemesProvider>
            </NextUIProvider>
        </SessionProvider>
    );
};
