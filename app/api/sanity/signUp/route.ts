import { signUpHandler } from "next-auth-sanity";
import sanityClient from "@/app/libs/sanity";

export const POST = signUpHandler(sanityClient);
