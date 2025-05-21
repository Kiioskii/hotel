"use client";

import { getRoom } from "@/app/libs/apis";
import useSWR from "swr";
import LoadingSpinner from "../../loading";
import HotelPhotoGallery from "@/app/components/HotelPhotoGallery/HotelPhotoGallery";
import { useParams } from "next/navigation";
import { MdOutlineCleaningServices } from "react-icons/md";
import { LiaFireExtinguisherSolid } from "react-icons/lia";
import { AiOutlineMedicineBox } from "react-icons/ai";
import { GiSmokeBomb } from "react-icons/gi";
import BookRoomCta from "@/app/components/BookRoomCta/BookRoomCta";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { get } from "http";
import { getStripe } from "@/app/libs/stripe";
import RoomReview from "@/app/components/RoomReview/RoomReview";

const RoomDetails = () => {
    const props = useParams<{ slug: string }>();
    console.log("props", props);
    const { slug } = props;

    const fetchRoom = async () => getRoom(slug);

    const { data: room, error, isLoading } = useSWR("/api/room", fetchRoom);
    const [checkInDate, setCheckInDate] = useState<Date | null>(null);
    const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
    const [adults, setAdults] = useState(1);
    const [noOfChildren, setNoOfChildren] = useState(0);

    if (error) throw new Error("Cannot fetch data");
    if (typeof room === "undefined" && !isLoading) throw new Error("Cannot fetch data");

    if (!room) return <LoadingSpinner />;

    console.log("room", room);

    const calcNoOfDays = () => {
        if (!checkInDate || !checkOutDate) return 0;
        const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
        const noOfDays = Math.ceil(timeDiff / (24 * 60 * 60 * 1000));
        return noOfDays;
    };

    const handleBookNowClick = async () => {
        if (!checkInDate || !checkOutDate) return toast.error("Please select check-in and check-out dates");

        if (checkInDate > checkOutDate) return toast.error("Check-out date must be after check-in date");

        const numberOfDays = calcNoOfDays();
        const hotelRoomSlug = room.slug.current;

        //Integrate stripe
        try {
            const stripe = await getStripe();

            const { data: stripeSession } = await axios.post("/api/stripe", {
                checkInDate,
                checkOutDate,
                adults,
                children: noOfChildren,
                numberOfDays,
                hotelRoomSlug,
            });

            if (stripe) {
                const result = await stripe.redirectToCheckout({
                    sessionId: stripeSession.id,
                });

                if (result.error) {
                    toast.error("Payment Failed");
                }
            }
        } catch (error) {
            console.error("Error creating checkout session:", error);
            toast.error("Payment Failed");
        }
    };

    return (
        <div>
            <HotelPhotoGallery photos={room.images} />

            <div className="container mx-auto mt-20">
                <div className="md:grid md:grid-cols-12 gap-10 px-3">
                    <div className="md:col-span-8 md:w-full">
                        <div>
                            <h2 className="font-bold text-left text-lg md:text-2xl">
                                {room.name} ({room.dimension})
                            </h2>
                            <div className="flex my-11">
                                {room?.offeredAmenities?.map((amenity) => (
                                    <div
                                        key={amenity._key}
                                        className="md:w-44 w-fit text-center px-2 md:h-40 mr-3 bg-[#eff0f2] dark:bg-gray-800 rounded-lg grid place-content-center"
                                    >
                                        <i className={`fa-solid ${amenity.icon} md:text-2xl`}></i>
                                        <p className="text-xs md:text-base pt-3">{amenity.amenity}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mb-11">
                                <h2 className="font-bold text-3xl mb-2">Description</h2>
                                <p>{room.description}</p>
                            </div>
                            <div className="mb-11">
                                <h2 className="font-bold text-3xl mb-2">Offered Amenities</h2>
                                <div className="grid grid-cols-2">
                                    {room?.offeredAmenities?.map((amenity) => (
                                        <div key={amenity._key} className="flex items-center md:my-0 my-1">
                                            <i className={`fa-solid ${amenity.icon}`}></i>
                                            <p className="text-xs md:text-base ml-2">{amenity.amenity}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="mb-11">
                                <h2 className="font-bold text-3xl mb-2">Safety And Hygiene</h2>
                                <div className="grid grid-cols-2">
                                    <div className="flex items-center my-1 md:my-0">
                                        <MdOutlineCleaningServices />
                                        <p className="ml-2 md:text-base text-xs">Daily Cleaning</p>
                                    </div>
                                    <div className="flex items-center my-1 md:my-0">
                                        <LiaFireExtinguisherSolid />
                                        <p className="ml-2 md:text-base text-xs">Fire Extinguishers</p>
                                    </div>
                                    <div className="flex items-center my-1 md:my-0">
                                        <AiOutlineMedicineBox />
                                        <p className="ml-2 md:text-base text-xs">Disinfections and Sterilizations</p>
                                    </div>
                                    <div className="flex items-center my-1 md:my-0">
                                        <GiSmokeBomb />
                                        <p className="ml-2 md:text-base text-xs">Smoke Detectors</p>
                                    </div>
                                </div>
                            </div>

                            <div className="shadow dark:shadow-white rounded-lg p-6">
                                <div className="items-center mb-4">
                                    <p className="md:text-lg font-semibold">Customer Reviews</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <RoomReview roomId={room._id} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="md:col-span-4 rounded-xl shadow-lg dark:shadow dark:shadow-white sticky top-10 h-fit overflow-auto">
                        <BookRoomCta
                            price={room.price}
                            discount={room.discount}
                            specialNote={room.specialNote}
                            checkInDate={checkInDate}
                            checkOutDate={checkOutDate}
                            setCheckInDate={setCheckInDate}
                            setCheckOutDate={setCheckOutDate}
                            // calcMinCheckOutDate={calcMinCheckOutDate}
                            adults={adults}
                            noOfChildren={noOfChildren}
                            setAdults={setAdults}
                            setNoOfChildren={setNoOfChildren}
                            isBooked={room.isBooked}
                            handleBookNowClick={handleBookNowClick}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomDetails;
