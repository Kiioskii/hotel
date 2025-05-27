"use client";
import ThemeContext from "@/app/context/themeContext";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useContext } from "react";
import { FaUserCircle } from "react-icons/fa";
import { MdDarkMode, MdOutlineLightMode } from "react-icons/md";
import Image from "next/image";
export const Header = () => {
    const { darkTheme, setDarkTheme } = useContext(ThemeContext);
    const session = useSession();

    console.log("session", session);

    return (
        <header className="py-10 px-4 container mx-auto text-xl flex flex-wrap md:flex-nowrap">
            <div className="flex items-center w-full md:2/3">
                <Link href="/" className="font-black text-tertiary-dark">
                    HOTEL APP
                </Link>
                <ul className="flex items-center ml-5">
                    <li className="flex items-center">
                        {session?.data?.user ? (
                            <Link href={`/users/${session?.data?.user.id}`}>
                                {session?.data?.user.image ? (
                                    <div className="w-10 h-10 rounded-full overflow-hidden">
                                        <Image
                                            src={session?.data?.user?.image}
                                            alt={session?.data?.user?.name || "User Name"}
                                            width={40}
                                            height={40}
                                            className="scale-animation img"
                                        />
                                    </div>
                                ) : (
                                    <FaUserCircle className="cursor-pointer" />
                                )}
                            </Link>
                        ) : (
                            <Link href={"/auth"} className="hover:-translate-y-2 duration-500 transition-all">
                                Log In
                            </Link>
                        )}
                    </li>
                    <li className="ml-2">
                        {darkTheme ? (
                            <MdOutlineLightMode
                                className="cursor-pointer"
                                onClick={() => {
                                    setDarkTheme(false);
                                    localStorage.removeItem("hotel-theme");
                                }}
                            />
                        ) : (
                            <MdDarkMode
                                className="cursor-pointer"
                                onClick={() => {
                                    setDarkTheme(true);
                                    localStorage.setItem("hotel-theme", "true");
                                }}
                            />
                        )}
                    </li>
                </ul>
            </div>
            <ul className="flex items-center justify-between w-full md:w-1/3 mt-4">
                <li className="hover:-translate-y-2 duration-500 transition-all">
                    <Link href={"/"}>Home</Link>
                </li>
                <li className="hover:-translate-y-2 duration-500 transition-all">
                    <Link href={"/rooms"}>Rooms</Link>
                </li>
                <li className="hover:-translate-y-2 duration-500 transition-all">
                    <Link href={"/"}>Contact</Link>
                </li>
            </ul>
        </header>
    );
};
