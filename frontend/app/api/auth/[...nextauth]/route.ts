import { NextApiHandler } from 'next';
import NextAuth, { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GoogleProvider from "next-auth/providers/google";
// import EmailProvider from 'next-auth/providers/email';
// import prisma from '../../../lib/prisma';
import prisma from '@/prismaconfig.ts'


const options: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
    ],
    adapter: PrismaAdapter(prisma),
    secret: process.env.SECRET
};

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);
export { authHandler as GET, authHandler as POST };
export {options as AuthOptions};
// export default authHandler;
