/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { useRouter } from "next/router";
import Template from "../../../components/Template";
import { useEffect, useState } from "react";
import Section from "@/components/booking/Section";
import BookForm from "@/components/booking/BookForm";
import BookExhibitionForm from "@/components/booking/BookExhibitionForm";

export default function booking() {
  const router = useRouter();
  const [room_id, setRoom_id] = useState();
  useEffect(() => {
    setRoom_id(router.query.room_id);
  });

  // fetch room data with room id from slug
  const [room, setRoom] = useState({});

  const asyncFetch = async () => {
    const res = await fetch(`/api/exhibition/getexhibitionbyid?exhibitionId=${room_id}`);
    const data = await res.json();
    if (data.exhibitionRoomById.length > 0) {
      setRoom(data.exhibitionRoomById[0]);
    }
  }

  useEffect(() => {
    if (room_id) {
      asyncFetch();
    }
    
  }, [room_id]);
  return(
    <Template title="Booking">
      <div className="bg-white w-3/4 rounded-t-md flex flex-col place-items-center py-8 ">
        <Section />
        {
          room && (
          <div className="flex flex-col w-full px-[15%] mt-8 h-max">
            <div className="font-semibold text-xl w-full ">{room.exhibitiontype && room.exhibitiontype.type_name}</div>
            <div className="flex flex-row w-full gap-4 mt-4">
              <div className="w-[60%] flex flex-col">
                {room.exhibitiontype && (<img src={`data:image/jpeg;base64,${room.exhibitiontype?.image}`} className="w-full h-[450px] object-cover rounded-md"/>)}
                <div className="flex flex-wrap place-items-center border-b border-[#ECF1F4]">
                  <div className="py-4 px-1 flex">
                    <div className="rounded-full px-4 py-1 border border-[#6C6EF2] text-[#6C6EF2] h-8">{"Maximum " +(room.exhibitiontype && room.exhibitiontype.num_people_stay) }</div>
                  </div>
                  <div className="py-4 px-1 flex">
                    <div className="rounded-full px-4 py-1 border border-[#6C6EF2] text-[#6C6EF2] h-8">{room.exhibitiontype && "maximum " +  room.exhibitiontype.num_people_stay + " persons"}</div>
                  </div>
                  <div className="ml-auto flex flex-col py-4">
                    <p className=" text-lg text-right">{ "$" + room.exhibitiontype?.exhibition_price}</p>
                    <p>per night</p>
                  </div>
                </div>
                <div className="flex flex-col mt-4 w-full">
                  {room.exhibitiontype?.description}
                </div>
              </div>
              <BookExhibitionForm exhibition_id={room_id} guestInRoom={room.exhibitiontype?.num_people_stay} room_name={room?.name} />
            </div>
          </div>
          )
        }
        
      </div>
    </Template>
  )
}