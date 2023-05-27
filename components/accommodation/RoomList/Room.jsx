import Link from "next/link";
import { useRouter } from "next/router";

export default function Room({room, roomtype}) { 
  if (roomtype == "room"){
    return (
      <JustRoom room={room}/>
    )
  }
  else if (roomtype == "exhibition"){
    return (
      <JustExhibition room={room}/>
    )
  }
}

function JustRoom({room}) {
  const title = room.roomtype[0].roomtype_name;
  const room_num = room.room_no;
  const room_bed_num = room.roomtype[0].count_bed;
  const bed_type = room.roomtype[0].bed_type;
  const room_num_person = room.roomtype[0].num_people_stay;
  const description = room.roomtype[0].description;
  const price = room.roomtype[0].room_price;
  const room_id = room.room_id;

  const image = room.roomtype[0]?.image ? `data:image/jpeg;base64,${room.roomtype[0]?.image}` : '/images/room/tempRoom.jpg';
  
  const rounter = useRouter()

  return (
    <div className="w-full flex py-4 px-8">
      <div className="w-[40%] rounded-md object-cover flex place-content-center ">
        <img className="object-cover rounded-md h-72 w-96 " src={image}/>
      </div>
      <div className="flex flex-col py-4 px-2 w-[60%] gap-2">
        <div className="text-3xl font-bold">{title}</div>
        <div className="text-lg font-bold">No. {room_num}</div>
        <div className="flex flex-wrap w-full mb-4 gap-4">
          <div className="rounded-full border-2 border-[#6C6EF2] text-[#6C6EF2] py-1 px-2">{room_bed_num + ' ' + bed_type + (room_bed_num > 1 ? 's' : '')}</div>
          <div className="rounded-full border-2 border-[#6C6EF2] text-[#6C6EF2] py-1 px-2">{"Maximum " + room_num_person + "person" + (room_num_person > 1 ? 's' : '')}</div>
        </div>
        <div className="text-lg font-bold">Description</div>
        <div className="text-lg">{description}</div>
        <div className="w-full text-right flex flex-row gap-2 place-content-between">
          <Link href={`/booking/room/${room_id}`} className=" underline text-[#6C6EF2]">Book now</Link>
          <div className="flex flex-row">
            <p className=" text-xl font-[#550]">{"$" + price + " per night"} </p>

          </div>

        </div>
      </div>
    </div>
  )
}

function JustExhibition({room}) {
  const title = room.exhibition_type[0].type_name;
  const room_name = room.name;
  const room_id = room.exhibition_id;

  const max_chair = room.max_chair;
  const max_people  = room.exhibition_type[0].num_people_stay;
  const max_table = room.max_table;

  const description = room.exhibition_type[0].description;

  const cartService = room.exhibition_type[0].cartering_service;
  const seatArrangement = room.exhibition_type[0].Seating_arrangements;
  const price = room.exhibition_type[0].exhibition_price;
  const haveMic = room.exhibition_type[0].have_mic;
  const haveProjector = room.exhibition_type[0].have_projector;
  const haveWhiteboard = room.exhibition_type[0].have_whiteboard;
  const haveWifi = room.exhibition_type[0].have_wifi;

  const image = room.exhibition_type[0]?.image ? `data:image/jpeg;base64,${room.exhibition_type[0]?.image}` : '/images/room/tempRoom.jpg';
  
  const rounter = useRouter()

  return (
    <div className="w-full flex py-4 px-8">
      <div className="w-[40%] rounded-md object-cover flex place-content-center ">
        <img className="object-cover rounded-md h-72 w-96 " src={image}/>
      </div>
      <div className="flex flex-col py-4 px-2 w-[60%] gap-2">
        <div className="text-3xl font-bold">{title}</div>
        <div className="text-lg font-bold">{room_name}</div>
        <div className="flex flex-wrap w-full mb-4 gap-4">
          <div className="rounded-full border-2 border-[#6C6EF2] text-[#6C6EF2] py-1 px-2">{max_chair + "chair" + (max_chair > 1 ? 's' : '')}</div>
          <div className="rounded-full border-2 border-[#6C6EF2] text-[#6C6EF2] py-1 px-2">{max_table + "table" + (max_table > 1 ? 's' : '')}</div>
          <div className="rounded-full border-2 border-[#6C6EF2] text-[#6C6EF2] py-1 px-2">{max_table + "table" + (max_table > 1 ? 's' : '')}</div>
          <div className="rounded-full border-2 border-[#6C6EF2] text-[#6C6EF2] py-1 px-2">{seatArrangement + "format"}</div>
          <div className="rounded-full border-2 border-[#6C6EF2] text-[#6C6EF2] py-1 px-2">{(cartService ? "✔️": "❌") + "cart service"}</div>
          <div className="rounded-full border-2 border-[#6C6EF2] text-[#6C6EF2] py-1 px-2">{(haveMic ? "✔️": "❌") + "Microphone"}</div>
          <div className="rounded-full border-2 border-[#6C6EF2] text-[#6C6EF2] py-1 px-2">{(haveProjector ? "✔️": "❌") + "Projector"}</div>
          <div className="rounded-full border-2 border-[#6C6EF2] text-[#6C6EF2] py-1 px-2">{(haveWhiteboard ? "✔️": "❌") + "White board"}</div>
          <div className="rounded-full border-2 border-[#6C6EF2] text-[#6C6EF2] py-1 px-2">{(haveWifi ? "✔️": "❌") + "Wifi"}</div>
        </div>
        <div className="text-lg font-bold">Description</div>
        <div className="text-lg">{description}</div>
        <div className="w-full text-right flex flex-row gap-2 place-content-between">
          <Link href={`/booking/meet/${room_id}`} className=" underline text-[#6C6EF2]">Book now</Link>
          <div className="flex flex-row">
            <p className=" text-xl font-[#550]">$ {price}</p>
            per night

          </div>

        </div>
      </div>
    </div>
  )
}