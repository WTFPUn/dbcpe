/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/rules-of-hooks */
import Template from "@/components/Template";
import ConfirmBookBox from "@/components/booking/ConfirmBookBox";
import Section from "@/components/booking/Section";
import { useEffect, useState } from "react";

export default function confirmbook() {
  const [bookRoom, setBookRoom] = useState([]);
  const [bookRoomTick, setBookRoomkTick] = useState([]);

  const [bookExhibition, setBookExhibition] = useState([]);
  const [bookExhibitionTick, setBookExhibitionTick] = useState([]);

  const [token, setToken] = useState();

  const [roomCount, setRoomCount] = useState(0);
  const [exhibitionCount, setExhibitionCount] = useState(0);

  const [coupon, setCoupon] = useState("");
  const [couponUse, setCouponUse] = useState(false);
  const [couponVerify, setCouponVerify] = useState(false);
  

  useEffect(() => {
    const token = localStorage.getItem("token");
    setToken(token);
    fetch("/api/book/getroombookbyuserid", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": token,
        },
      })
      .then((res) => res.json())
      .then((data) => {
        setBookRoom(data.getbook);
        let roomTick = [];
        bookRoom?.map((book) => {
          roomTick.push({ book_id: book.book_id, tick: false, book_type: 0 });
        });
        setBookRoomkTick(roomTick);
        setRoomCount(data.getbook.length);
      }
    );
    
  }, []);

  const handleCouponVerify = async () => {
    // fetch
  }

  const handleCancelCoupon = () => {
    setCoupon("");
    setCouponUse(false);
    setCouponVerify(false);
  }

  const handleRoomTick = (index) => {
    setBookRoomkTick(
      bookRoomTick.map((book, i) => {
        if (i === index) {
          book.tick = !book.tick;
        }
        return book;
      }
    ));
  }
  
  return(
    <Template title="Confirmbook" hscreen>
      <div className="bg-white w-3/4 rounded-t-md flex flex-col place-items-center py-2 h-full ">
        <Section/>
        <div className="flex flex-col py-4 w-[85%] h-full">
          <div className="text-2xl font-semibold">{"Booking(" + roomCount + ")"}</div>
          <div className="flex w-full h-[18rem] gap-4 divide-x-2">
            <div className="w-[50%]  h-full">
              <div className="text-xl font-semibold h-[20%]">{"Room"}</div>
              <div className="flex flex-col w-full  overflow-y-scroll snap-y h-[80%] ">
                {bookRoom?.map((book, index) => (
                  <div key={index+"book"} className="flex flex-row w-full h-max rounded-md shadow-md gap-2 snap-center">
                    <div className="w-full flex place-items-center gap-4 py-2">
                      <input
                        type="checkbox"
                        className="w-4"
                        checked={bookRoomTick[index]?.tick}
                        onChange={() => handleRoomTick(index)}  
                      />
                      <ConfirmBookBox roomtype={"room"} data={book}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-[50%] px-4">
              <div className="text-xl font-semibold">{"Exhibition"}</div>
            </div>
          </div>
          <div className="ml-auto w-96 h-[11.25rem]  bg-[#ECF1F4] rounded-md mt-8 py-4 px-8 flex flex-col">
            <div className="w-full flex justify-between">
              <p className="font-semibold">Total price</p>
              <p className="font-semibold">$220</p>
            </div>
            <p className="text-[#8C8CA1] text-sm">2 blablabla</p>
            <div className="mt-4 rounded-md bg-white text-black h-8 relative py-2 place-items-center flex px-2">
              <input
                type="text"
                className="w-full h-full rounded-md px-2 outline-none"
                placeholder="Coupon"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
              />
              {!couponUse ? (
              <button
              className="absolute right-0 w-20 rounded-md  text-[#6C6EF2] border-[#6C6EF2] border mr-2"
              onClick={handleCouponVerify}
            >
              Verify
            </button>
            ) : (
              <>
                <div className="absolute right-0 flex gap-4 mr-2">
                  {couponVerify ? 
                    <p className="text-green-500">✓</p>
                    :
                    <p className="text-red-500">✗</p>
                  
                  }
                  <button
                    className=" text-[#6C6EF2] border-[#6C6EF2] border rounded-md px-2"
                    onClick={handleCancelCoupon}
                  >
                    Cancel
                  </button>
                </div>
              </>
            )
              }
            </div>
            <div className="mt-auto w-full rounded-md bg-[#6C6EF2] text-white text-center py-2 text-sm uppercase">Confirm order NOW</div>
          </div>
        </div>
      
      </div>
    </Template>
  )
}