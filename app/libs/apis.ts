import { CreateBookingDto, Room } from "../models/rooms";
import sanityClient from "./sanity";
import * as queries from "./sanityQueries";
import axios from "axios";
import { Booking } from "../models/booking";
import { User } from "../models/user";
import { CreateReviewDto, Review, UpdateReviewDto } from "../models/reviews";

export const getFeaturedRoom = async () => {
    const result = await sanityClient.fetch<Room>(queries.getFeaturedRoomQuery, {}, { cache: "no-cache" });
    return result;
};

export const getRooms = async () => {
    const result = await sanityClient.fetch<Room[]>(queries.getRoomsQuery, {}, { cache: "no-cache" });
    return result;
};

export const getRoom = async (slug: string): Promise<Room> => {
    const result = await sanityClient.fetch<Room>(queries.getRoomQuery, { slug }, { cache: "no-cache" });
    return result;
};

export const createBooking = async ({
    adults,
    checkInDate,
    checkOutDate,
    children,
    discount,
    hotelRoom,
    numberOfDays,
    totalPrice,
    user,
}: CreateBookingDto) => {
    const mutation = {
        mutations: [
            {
                create: {
                    _type: "booking",
                    user: { _type: "reference", _ref: user },
                    hotelRoom: { _type: "reference", _ref: hotelRoom },
                    checkInDate,
                    checkOutDate,
                    numberOfDays,
                    adults,
                    children,
                    totalPrice,
                    discount,
                },
            },
        ],
    };
    const { data } = await axios.post(
        `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2021-10-21/data/mutate/${process.env.NEXT_PUBLIC_SANITY_DATASET}`,
        mutation,
        { headers: { Authorization: `Bearer ${process.env.SANITY_STUDIO_TOKEN}` } }
    );

    return data;
};

export const updateHotelRoom = async (hotelRoomId: string) => {
    const mutation = {
        mutations: [
            {
                patch: {
                    id: hotelRoomId,
                    set: { isBooked: true },
                },
            },
        ],
    };

    const { data } = await axios.post(
        `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2021-10-21/data/mutate/${process.env.NEXT_PUBLIC_SANITY_DATASET}`,
        mutation,
        {
            headers: { Authorization: `Bearer ${process.env.SANITY_STUDIO_TOKEN}` },
        }
    );

    return data;
};

export const getUserBookings = async (userId: string) => {
    const result = await sanityClient.fetch<Booking[]>(queries.getUserBookingsQuery, { userId }, { cache: "no-cache" });
    return result;
};

export const getUserData = async (userId: string) => {
    console.log("userId --->", userId);

    const result = await sanityClient.fetch<User>(queries.getUserDataQuery, { userId }, { cache: "no-cache" });

    console.log("result --->", result);

    return result;
};

export const checkReviewExist = async (userId: string, hotelRoomId: string): Promise<null | { _id: string }> => {
    const result = await sanityClient.fetch(
        queries.checkUserReviewsQuery,
        { userId, hotelRoomId },
        { cache: "no-cache" }
    );
    return result ? result : null;
};

export const updateReview = async ({ reviewId, reviewText, userRating }: UpdateReviewDto) => {
    const mutation = {
        mutations: [
            {
                patch: {
                    id: reviewId,
                    set: {
                        text: reviewText,
                        userRating,
                    },
                },
            },
        ],
    };

    const { data } = await axios.post(
        `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2021-10-21/data/mutate/${process.env.NEXT_PUBLIC_SANITY_DATASET}`,
        mutation,
        { headers: { Authorization: `Bearer ${process.env.SANITY_STUDIO_TOKEN}` } }
    );
    return data;
};

export const createReview = async ({ hotelRoomId, reviewText, userRating, userId }: CreateReviewDto) => {
    const mutation = {
        mutations: [
            {
                create: {
                    _type: "review",
                    user: { _type: "reference", _ref: userId },
                    hotelRoom: { _type: "reference", _ref: hotelRoomId },
                    text: reviewText,
                    userRating,
                },
            },
        ],
    };

    const { data } = await axios.post(
        `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2021-10-21/data/mutate/${process.env.NEXT_PUBLIC_SANITY_DATASET}`,
        mutation,
        { headers: { Authorization: `Bearer ${process.env.SANITY_STUDIO_TOKEN}` } }
    );
    return data;
};

export const getRoomReviews = async (roomId: string) => {
    const result = await sanityClient.fetch<Review[]>(queries.getRoomReviewsQuery, { roomId }, { cache: "no-cache" });
    return result;
};
