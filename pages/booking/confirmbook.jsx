/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/rules-of-hooks */
import Template from "@/components/Template";
import Section from "@/components/booking/Section";
import { useEffect, useState } from "react";

export default function confirmbook() {
  const [book, setBook] = useState([]);
  const [bookTick, setBookTick] = useState([]);
  const[token, setToken] = useState();

  const [roomCount, setRoomCount] = useState(0);
  

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
        setBook(data.getbook);
        let roomTick = [];
        book?.map((book) => {
          roomTick.push({ book_id: book.book_id, tick: false, book_type: 0 });
        });
        setBookTick(roomTick);
        setRoomCount(data.getbook.length);

        console.log("book: ", book);
      }
    );

  }, []);

  const handleTick = (index) => {
    setBookTick(
      bookTick.map((book, i) => {
        if (i === index) {
          book.tick = !book.tick;
        }
        return book;
      }
    ));
  }
  
  return(
    <Template title="Confirmbook" hscreen>
      <div className="bg-white w-3/4 rounded-t-md flex flex-col place-items-center py-4 h-full ">
        <Section/>
        <div className="flex flex-col py-4 w-[85%] h-full">
          <div className="text-2xl font-semibold">{"Booking(" + roomCount + ")"}</div>
          <div className="flex w-full h-full gap-4 divide-x-2">
            <div className="w-[50%] px-4">
              <div className="text-xl font-semibold">{"Room"}</div>
              <div className="flex flex-col w-full h-full overflow-y-auto">
                {book?.map((book, index) => (
                  <div key={index+"book"} className="flex flex-row w-full h-20 border-b-2 border-[#E4E4E4]">
                    <div className="w-full flex place-items-center gap-4 py-2">
                      <input
                        type="checkbox"
                        className="w-4"
                        checked={bookTick[index]?.tick}
                        onChange={() => handleTick(index)}  
                      />
                      <div className="flex w-full h-full gap-4">
                        <img src={`data:image/jpeg;base64,`+book.roomtype.image} className="w-[100px] object-cover rounded-md" />
                        <div className="flex flex-col">
                          <div className="text-xl font-semibold">{book.roomtype.name}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-[50%] px-4">
              <div className="text-xl font-semibold">{"Exhibition"}</div>
            </div>
          </div>
        </div>
      
      </div>
    </Template>
  )
}