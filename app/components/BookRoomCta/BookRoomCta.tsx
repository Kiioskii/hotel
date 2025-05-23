import { Dispatch, FC, SetStateAction } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type Props = {
    price: number;
    discount: number;
    specialNote?: string;
    checkInDate: Date | null;
    checkOutDate: Date | null;
    adults: number;
    noOfChildren: number;
    setCheckInDate: Dispatch<SetStateAction<Date | null>>;
    setCheckOutDate: Dispatch<SetStateAction<Date | null>>;
    setAdults: Dispatch<SetStateAction<number>>;
    setNoOfChildren: Dispatch<SetStateAction<number>>;
    calcMinCheckOutDate: () => Date | undefined;
    isBooked: boolean;
    handleBookNowClick: () => void;
};

const BookRoomCta: FC<Props> = (props) => {
    const {
        price,
        discount,
        specialNote,
        checkInDate,
        checkOutDate,
        setCheckInDate,
        setCheckOutDate,
        calcMinCheckOutDate,
        adults,
        setAdults,
        noOfChildren,
        setNoOfChildren,
        isBooked,
        handleBookNowClick,
    } = props;
    const discountPrice = price - (price / 100) * discount;

    const calcNoOfDays = () => {
        if (!checkInDate || !checkOutDate) return 0;
        const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
        const noOfDays = Math.ceil(timeDiff / (24 * 60 * 60 * 1000));
        return noOfDays;
    };

    return (
        <div className="px-7 py-6">
            <h3>
                <span className={`${discount ? "text-gray-400" : ""} font-bold text-xl`}>$ {price}</span>
                {discount ? (
                    <span className="font-bold text-xl">
                        {" "}
                        | discount {discount}%. Now <span className="text-tertiary-dark">${discountPrice}</span>{" "}
                    </span>
                ) : (
                    ""
                )}
            </h3>

            <div className="w-full border-b-2 border-b-secondary my-2" />
            <h4 className="my-8">{specialNote}</h4>

            <div className="flex">
                <div className="w-1/2 pr-2">
                    <label
                        htmlFor="check-in-date"
                        className="text-sm font-medium block text-gray-900 dark:text-gray-400"
                    >
                        Check In date
                    </label>
                    <DatePicker
                        selected={checkInDate}
                        onChange={(date) => setCheckInDate(date)}
                        dateFormat="dd/MM/yyyy"
                        minDate={new Date()}
                        id="check-in-date"
                        className="w-full border text-black border-gray-300 rounded-lg p-2.5 focus:ring-primary focus:border-primary"
                    />
                </div>
                <div className="w-1/2 pl-2">
                    <label
                        htmlFor="check-out-date"
                        className="text-sm font-medium block text-gray-900 dark:text-gray-400"
                    >
                        Check Out date
                    </label>
                    <DatePicker
                        selected={checkOutDate}
                        onChange={(date) => setCheckOutDate(date)}
                        dateFormat="dd/MM/yyyy"
                        disabled={!checkInDate}
                        minDate={calcMinCheckOutDate()}
                        id="check-out-date"
                        className="w-full border text-black border-gray-300 rounded-lg p-2.5 focus:ring-primary focus:border-primary"
                    />
                </div>
            </div>

            <div className="flex mt-4">
                <div className="w-1/2 pr-2">
                    <label htmlFor="adults" className="block text-sm font-medium text-gray-900 dark:text-gray-400">
                        Adults
                    </label>
                    <input
                        type="number"
                        id="adults"
                        value={adults}
                        onChange={(e) => setAdults(+e.target.value)}
                        min={1}
                        max={5}
                        className="w-full border border-gray-300 rounded-lg p-2.5"
                    />
                </div>
                <div className="w-1/2 pl-2">
                    <label htmlFor="children" className="block text-sm font-medium text-gray-900 dark:text-gray-400">
                        Children
                    </label>
                    <input
                        type="number"
                        id="children"
                        value={noOfChildren}
                        onChange={(e) => setNoOfChildren(+e.target.value)}
                        min={0}
                        max={5}
                        className="w-full border border-gray-300 rounded-lg p-2.5"
                    />
                </div>
            </div>

            {calcNoOfDays() > 0 ? <p className="mt-3">Total Price: $ {calcNoOfDays() * discountPrice}</p> : <></>}

            <button
                disabled={isBooked}
                onClick={handleBookNowClick}
                className="btn-primary w-full mt-6 disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
                {isBooked ? "Booked" : "Book Now"}
            </button>
        </div>
    );
};

export default BookRoomCta;
