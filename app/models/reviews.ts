import { user } from "@/schemas/users";
export type UpdateReviewDto = {
    reviewId: string;
    reviewText: string;
    userRating: number;
};

export type CreateReviewDto = {
    hotelRoomId: string;
    reviewText: string;
    userRating: number;
    userId: string;
};

export type Review = {
    _id: string;
    _createdAt: string;
    text: string;
    userRating: number;
    user: { name: string };
};
