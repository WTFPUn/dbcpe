import Template from "@/components/Template";
import { useRouter } from "next/router";
import { useState } from "react";

export default function addseason() {
  const router = useRouter();

  const [season, setSeason] = useState({
    service_factor: "",
    room_price_factor: "",
    end_date: "",
    start_date: "",
    season_description: "",
  });

  const [message, setMessage] = useState("");


  const createSeason = () => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch('/api/admin/addseasons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token,
        },
        body: JSON.stringify(season),
      })
        .then((res) => res.json())
        .then((data) => {
          setMessage(data.message);
          alert(data.message);
          if (data.success) {
            router.push("/admin/season");
          }
        })
    }
  }



  return(
    <Template hscreen>
      <div className="bg-[#F5F5F5] w-[60%] h-full mt-16 rounded-t-md px-[6rem] pt-8">
        <div className="w-full text-4xl font-semibold text-center h-[15%] pt-4">Creating a new season code</div>
        <form className="w-full flex flex-col h-[70%] place-items-center">
          <div className="flex flex-col w-[75%] bg-[#FAFCFE] h-[80%] rounded-md p-8 gap-4">
            <div className="flex w-full place-items-center gap-4">
              <div className="w-[60%] flex flex-col">
                <label className="text-black font-semibold">Season Description</label>
                <div className="w-full flex place-items-center border border-[#C4C4C4] rounded-md mt-2">
                  <textarea 
                    className="w-full text-lg outline-none px-2 py-1"
                    placeholder="Enter season description"
                    onChange={(e) => setSeason({...season, season_description: e.target.value})}
                  />
                  
                </div>
              </div>
            
            </div>
            <div className="flex w-full gap-4">
              <div className="flex flex-col w-[50%]">
              <label className="text-black font-semibold">Start Date</label>
                <input 
                  className="w-full rounded-md border border-[#C4C4C4] text-base px-2 py-1 mt-2"
                  type="datetime-local"
                  onChange={(e) => setSeason({...season, start_date: e.target.value})}
                />
              </div>
              <div className="flex flex-col w-[50%]">
                <label className="text-black font-semibold">End Date</label>
                <input 
                  className="w-full rounded-md border border-[#C4C4C4] text-base px-2 py-1 mt-2"
                  type="datetime-local"
                  onChange={(e) => setSeason({...season, end_date: e.target.value})}
                />
              </div>
            </div>
            <div className="w-[50%] pr-4">
              <label className="text-black font-semibold">Room Price Factor</label>
              <input
                className="w-full rounded-md border border-[#C4C4C4] text-base px-2 py-1 mt-2"
                type="number"
                placeholder="Enter the room price factor(%)"
                onChange={(e) => setSeason({...season, room_price_factor:  parseFloat(e.target.value)})}
              />
            </div>
            <div className="w-[50%] pr-4">
              <label className="text-black font-semibold">Service Factor</label>
              <input
                className="w-full rounded-md border border-[#C4C4C4] text-base px-2 py-1 mt-2  outline-none"
                type="number"
                // set the date format to yyyy-mm-dd
                placeholder="Enter the service factor(%)"
                onChange={(e) => setSeason({...season, service_factor: parseFloat(e.target.value)})}
              />
            </div>
          </div>
          <div className="flex w-[75%] px-4 font-semibold mt-4">
            <div
              className=" border border-[#6C6EF2] rounded-md w-[50%] text-[#6C6EF2] text-center py-2"
              onClick={() => router.push("/admin/season")}
            >
              CANCEL
            </div>
            <div
              className="bg-[#6C6EF2] rounded-md w-[50%] text-white text-center py-2 ml-4"
              onClick={createSeason}
            >
              CREATE
            </div>
          </div>
        </form>

      </div>
    </Template>
  )
}