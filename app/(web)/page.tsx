import FeaturedRoom from "../components/FeaturedRoom/FeaturedRoom";
import Gallery from "../components/Gallery/Gallery";
import HeroSection from "../components/HeroSection/HeroSection";
import NewsLetter from "../components/NewsLetter/NewsLetter";
import PageSearch from "../components/PageSearch/PageSearch";
import { getFeaturedRoom } from "../libs/apis";

export default async function Home() {
  const featuredRoom = await getFeaturedRoom();

  console.log("featuredRoom", featuredRoom);

  return (
    <div>
      <HeroSection />
      <PageSearch />
      <FeaturedRoom featuredRoom={featuredRoom} />
      <Gallery />
      <NewsLetter />
    </div>
  );
}
