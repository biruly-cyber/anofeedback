import nextAuth from "next-auth";
import { authOtions } from "./options";
import NextAuth from "next-auth/next";

const handler =  NextAuth(authOtions)


export {handler as GET, handler as POST}