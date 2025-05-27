"use client";

import Link from "next/link";

export default function Error({ error }: { error: Error & { digest?: string } }) {
    console.error("Error: ", error);
    return (
        <div className="container mx-auto">
            <h2 className="font-heading text-green-800 mb-10">To visit this page You have to sign in</h2>

            <Link href={"/auth"} className="btn-primary">
                Log In
            </Link>
        </div>
    );
}
