import { signUpHandler } from "next-auth-sanity";
import SanityClient from "@/app/libs/sanity";

export const POST = signUpHandler(SanityClient)