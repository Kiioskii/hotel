import SanityClient from "@/app/libs/sanity";
import { signUpHandler } from "next-auth-sanity";

export const POST = signUpHandler(SanityClient)