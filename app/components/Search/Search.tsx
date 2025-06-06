import { useRouter } from "next/navigation";
import { ChangeEvent, FC } from "react";

type Props = {
  roomTypeFilter: string;
  searchQuery: string;
  setRoomTypeFilter: (value: string) => void;
  setSearchQuery: (value: string) => void;
};

const Search: FC<Props> = ({
  roomTypeFilter,
  searchQuery,
  setRoomTypeFilter,
  setSearchQuery,
}) => {
  const options = ["All", "Basic", "Luxury", "Suite"];
  const router = useRouter();

  const handleFilterCLick = () => {
    router.push(`/rooms?roomType=${roomTypeFilter}&searchQuery=${searchQuery}`);
  };

  const handleRoomTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setRoomTypeFilter(event.target.value);
  };

  const handleSearchQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <section className=" bg-tertiary-light px-4 py-6 rounded-lg">
      <div className="container mx-auto flex gap-4 flex-wrap justify-between items-center">
        <div className="w-full md:1/3 lg:w-auto mb-4 mb:mb-0">
          <label className="block text-sm font-medium mb-2 text-block">
            Room Type
          </label>
          <div className="relative">
            <select
              value={roomTypeFilter}
              onChange={handleRoomTypeChange}
              className="w-full px-4 py-2 capitalize rounded leading-tight dark:bg-black focus:outline-none"
            >
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="w-full md:1/3 lg:w-auto mb-4 md:mb-0">
          <label className="block text-sm font font-medium mb-2 text-black">
            Search
          </label>
          <input
            value={searchQuery}
            onChange={handleSearchQueryChange}
            type="search"
            id="search"
            placeholder="Search..."
            className="w-full px-4 py-3 rounded leading-tight dark:bg-black focus:outline-none placeholder:text-black dark:placeholder:text-white"
          />
        </div>
        <button
          className="btn-primary"
          type="button"
          onClick={handleFilterCLick}
        >
          Search
        </button>
      </div>
    </section>
  );
};

export default Search;
