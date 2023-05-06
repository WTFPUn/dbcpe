import { useRouter } from "next/router";
import { useEffect, useState } from "react";


export default function BookExhibitionForm({exhibition_id, guestInRoom, room_name}) {
  const router = useRouter()

  // get token from local storage
  const [token, setToken] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("token");
    setToken(token);
    setFormData({
      ...formData,
      exhibition_id: exhibition_id,
      Guest: guestInRoom,
    });
  }, []);
  
  console.log("room_id: ", exhibition_id);
  console.log("guestInRoom: ", guestInRoom);
  

  const [formData, setFormData] = useState({
    exhibition_id: "0",
    checkin_date: "",
    checkout_date: "",
    participantt: 0,
  });
  
  // set room_id, guestInRoom

  const [message, setMessage] = useState("");

  const updateFormData = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
      exhibition_id: exhibition_id,
      Guest: guestInRoom,
    });

  };
  
  const handleSubmit = async (e) => {
    
    e.preventDefault();
    const res = await fetch("/api/exhibition/AddbookingExhibition", {
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
    <form className="flex flex-col w-[40%] h-max  bg-[#ECF1F4] rounded-md gap-4 px-8 py-4 ">
      <div className="flex">
        <div className=" text-xl font-semibold">Book your meeting room</div>
        <div className={`text-sm text-red-500 ${!message && "hidden"}`}>{message}</div>
      </div>
      <div className={`bg-transparent  text-black ${!formData.checkin_date && "text-opacity-40 "} w-full rounded-md border border-[#8C8CA1] border-opacity-10 flex relative h-[4.5rem] `}>
        <div className="absolute top-0 left-0 px-4 py-1 text-sm">Starting date of event</div>
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
        <div className="absolute top-0 left-0 px-4 py-2 text-sm">Ending date of event</div>
        <input
          type="date"
          name="checkout_date"
          className="bg-transparent w-full h-full px-4 py-2 rounded-md text-center"
          onChange={updateFormData}
          required
        />
      </div>
      <div className="bg-transparent  text-black text-opacity-40   w-full rounded-md border border-[#8C8CA1] border-opacity-30 flex relative h-[4.5rem]">
        <div className="absolute top-0 left-0 px-4 py-2 text-sm">Room name</div>
        <input
          type="text"
          name="room_number"
          className="bg-transparent w-full h-full px-4 py-2 rounded-md text-center"
          onChange={updateFormData}
          readOnly
          value={room_name && room_name}
          />
      </div>
      <div className="bg-transparent  text-black text-opacity-40   w-full rounded-md border border-[#8C8CA1] border-opacity-30 flex relative h-[4.5rem]">
        <div className="absolute top-0 left-0 px-4 py-2 text-sm">Max Guest</div>
        <select
          type="number"
          name="Guest"
          className="bg-transparent w-full h-full px-4 py-2 rounded-md text-center"
          onChange={updateFormData}
          >
            {
              // loop from 1 to guestInRoom
              [...Array(guestInRoom)].map((e, i) => {
                if(i%10 ==  9 && i!=0){
                return <option key={i} value={i+1}>{i+1}</option>
                }
              })
            }
        </select> 
      </div>
      <div className="flex flex-col mt-auto">
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