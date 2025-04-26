"use client";

import { getRoom } from "@/app/libs/apis";
import useSWR from "swr";
import LoadingSpinner from "../../loading";
import HotelPhotoGallery from "@/app/components/HotelPhotoGallery/HotelPhotoGallery";
import { useParams } from "next/navigation";

const RoomDetails = () => {
  const props = useParams<{ slug: string }>();
  console.log("props", props);
  const { slug } = props;

  console.log("slug", slug);

  const fetchRoom = async () => getRoom(slug);

  const { data: room, error, isLoading } = useSWR("/api/room", fetchRoom);

  if (error) throw new Error("Cannot fetch data");
  if (typeof room === "undefined" && !isLoading)
    throw new Error("Cannot fetch data");

  if (!room) return <LoadingSpinner />;

  return (
    <div>
      <HotelPhotoGallery photos={room.images} />
    </div>
  );
};

export default RoomDetails;
