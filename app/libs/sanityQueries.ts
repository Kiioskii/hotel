import { groq } from "next-sanity";

export const getFeaturedRoomQuery = groq`*[_type == "hotelRoom" && isFeatured == true][0] {
    _id,
    description,
    discount,
    images,
    isFeatured,
    name,
    price,
    slug,
    coverImage
}`;

export const getRoomsQuery = groq`*[_type == "hotelRoom"] {
    _id,
    description,
    discount,
    dimension,
    images,
    isBooked,
    isFeatured,
    name,
    price,
    slug,
    type,
    coverImage
}`;

export const getRoomQuery = groq`*[_type == "hotelRoom" && slug.current == $slug][0]{
    _id,
    description,
    discount,
    dimension,
    images,
    isBooked,
    isFeatured,
    name,
    price,
    slug,
    type,
    coverImage,
    numberOfBeds,
    numberOfBeds,
    offeredAmenities,
    specialNote
}`;

export const getUserBookingsQuery = groq`*[_type == "booking" && user._ref == $userId]{
_id,
hotelRoom->{
    _id,
    name,
    slug,
    price,
},
checkInDate,
checkOutDate,
numberOfDays,
adults,
children,
totalPrice,
discount,
}`;

export const getUserDataQuery = groq`*[_type == "user" && _id == $userId][0]{
_id,
name,
email,
isAdmin,
about,
_createdAt,
image,
}`;

export const checkUserReviewsQuery = groq`*[_type == "review" && user._ref == $userId && hotelRoom._ref == $hotelRoomId][0]{
_id,
}`;

export const getRoomReviewsQuery = groq`*[_type == "review" && hotelRoom._ref == $roomId]{
_id,
_createdAt,
text,
userRating,
user->{
    _id,
    name,
},
}`;
