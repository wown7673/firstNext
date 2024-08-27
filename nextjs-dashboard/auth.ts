import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import {User} from "@/app/lib/definitions";
import bcrypt from "bcrypt";

async function getUser(email:string):Promise<User|undefined>{
    try{
        const user = await sql`SELECT * FROM users WHERE email=${email}`;
        return user.row[0];
    }catch (e){
        console.error('사용자 조회가 실패하였습니다', e);
        throw new Error('사용자 조회실패');
    }
}

export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if(parsedCredentials.success){
                    const { email, password } = parsedCredentials.data;
                    const user = await getUser(email);
                    if(!user) return null;

                    const passwordMatch = await bcrypt.compare(password, user.password);
                    if( passwordMatch) return user;
                }
                console.log("인증실패");
                return null;
            },
        }),
    ],
});