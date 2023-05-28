import { useRouter } from "next/router";
import { useEffect, useState } from "react";


export default function BookForm({room_id, guestInRoom, room_number}) {
  const router = useRouter()

  // get token from local storage
  const [token, setToken] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("token");
    setToken(token);
    setFormData({
      ...formData,
      room_id: room_id,
      Guest: guestInRoom,
    });
  }, []);
  
  console.log("room_id: ", room_id);
  console.log("guestInRoom: ", guestInRoom);
  

  const [formData, setFormData] = useState({
    room_id: "0",
    checkin_date: "",
    checkout_date: "",
    Guest: "0",
    halal: false,
    extra_bed: false,
    cleaning: false,
    laundry: false,
    laundry_date: "",
  });
  
  // set room_id, guestInRoom

  const [message, setMessage] = useState("");

  const updateFormData = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
      room_id: room_id,
      Guest: guestInRoom,
    });

  };
  
  const handleSubmit = async (e) => {
    
    e.preventDefault();
    const res = await fetch("/api/room/AddbookingRoom", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": token,
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.message);
    }
    else{
      router.push("/booking/confirmbook");
    }


  };
  return(
    <form className="flex flex-col w-[40%]  bg-[#ECF1F4] rounded-md gap-4 px-8 py-4 ">
      <div className="flex">
        <div className=" text-xl font-semibold">Book your room</div>
        <div className={`text-sm text-red-500 ${!message && "hidden"}`}>{message}</div>
      </div>
      <div className={`bg-transparent  text-black ${!formData.checkin_date && "text-opacity-40 "} w-full rounded-md border border-[#8C8CA1] border-opacity-10 flex relative h-[4.5rem] `}>
        <div className="absolute top-0 left-0 px-4 py-1 text-sm">Check in</div>
        <input
          type="date"
          name="checkin_date"
          className="bg-transparent w-full h-full px-4 py-2 rounded-md text-center"
          onChange={updateFormData}
          required
          placeholder=""
        />
      </div>
      <div className={`bg-transparent  text-black ${!formData.checkout_date && "text-opacity-40 "} w-full rounded-md border border-[#8C8CA1] border-opacity-10 flex relative h-[4.5rem] `}>
        <div className="absolute top-0 left-0 px-4 py-2 text-sm">Check out</div>
        <input
          type="date"
          name="checkout_date"
          className="bg-transparent w-full h-full px-4 py-2 rounded-md text-center"
          onChange={updateFormData}
          required
        />
      </div>
      <div className="bg-transparent  text-black text-opacity-40   w-full rounded-md border border-[#8C8CA1] border-opacity-30 flex relative h-[4.5rem]">
        <div className="absolute top-0 left-0 px-4 py-2 text-sm">Number of room</div>
        <input
          type="number"
          name="room_number"
          className="bg-transparent w-full h-full px-4 py-2 rounded-md text-center"
          onChange={updateFormData}
          readOnly
          value={room_number && room_number}
          />
      </div>
      <div className="bg-transparent  text-black text-opacity-40   w-full rounded-md border border-[#8C8CA1] border-opacity-30 flex relative h-[4.5rem]">
        <div className="absolute top-0 left-0 px-4 py-2 text-sm">Guest</div>
        <select
          type="number"
          name="Guest"
          className="bg-transparent w-full h-full px-4 py-2 rounded-md text-center"
          onChange={updateFormData}
          >
            {
              // loop from 1 to guestInRoom
              [...Array(guestInRoom)].map((e, i) => {
                return <option key={i} value={i+1}>{i+1}</option>
              })
            }
        </select> 
      </div>
      <div className="flex flex-col">
        <div className="w-full flex gap-2">
          <input
            type="checkbox"
            name="halal"
            className="bg-transparent w-4 px-4 py-2 rounded-md text-center"
            onClick={() => setFormData({...formData, halal: !formData.halal})}
            />
            <p className="text-black text-opacity-40">I would like to have halal food</p>
        </div>
        <div className="w-full flex gap-2">
          <input
            type="checkbox"
            name="extra_bed"
            className="bg-transparent w-4 px-4 py-2 rounded-md text-center"
            onClick={() => setFormData({...formData, extra_bed: !formData.extra_bed})}
            />
            <p className="text-black text-opacity-40">I would like to have extra bed</p>
        </div>
        <div className="w-full flex gap-2 mb-4">
          <input
            type="checkbox"
            name="laundry"
            className="bg-transparent w-4 px-4 py-2 rounded-md text-center"
            onClick={() => setFormData({...formData, laundry: !formData.laundry})}
            />
          <p className="text-black text-opacity-40">I would like to have laundry service</p>
        </div>
        <div className={`bg-transparent  text-black ${!formData.laundry_date && "text-opacity-40 "} w-full rounded-md border border-[#8C8CA1] border-opacity-10 flex relative h-[4.5rem] `}>
          <div className="absolute top-0 left-0 px-4 py-2 text-sm">Laundry date</div>
          <input
            type="date"
            name="laundry_date"
            className="bg-transparent w-full h-full px-4 py-2 rounded-md text-center"
            onChange={updateFormData}
            readOnly={!formData.laundry}
            />
        </div>
        <div
          onClick={handleSubmit}
          className="w-full  rounded-md text-white bg-[#6C6EF2] text-center py-2 cursor-pointer my-4"
        >
          Book now
        </div>
      </div>
    </form>
  )
}