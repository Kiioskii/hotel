import { Room } from "../models/rooms";
import sanityClient from "./sanity";
import * as queries from "./sanityQueries";

export const getFeaturedRoom = async () => {
  const result = await sanityClient.fetch<Room>(
    queries.getFeaturedRoomQuery,
    {},
    { cache: "no-cache" }
  );
  return result;
};

export const getRooms = async () => {
  const result = await sanityClient.fetch<Rooms[]>(queries.getRoomsQuery);
  return result;
};
