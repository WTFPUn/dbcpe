import Template from "@/components/Template";
import { useRouter } from "next/router";
import { useState } from "react";

export default function addcoupon() {
  const router = useRouter();

  const [coupon, setSeason] = useState({
    code_name: "",
    code_type: 1,
    discount_factor: "",
    count_limit: "",
    expired_date: "",
    description: "",
  });

  const [codeVerify, setCodeVerify] = useState(false);
  const [message, setMessage] = useState("");

  const verifyCode = () => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`/api/admin/verifycode?code_name=${coupon.code_name}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setCodeVerify(data.status);
        }
      )
    }
  }

    const createCode = () => {
      const token = localStorage.getItem("token");
      if (token) {
        fetch('/api/admin/addcode', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': token,
          },
          body: JSON.stringify(coupon),
        })
          .then((res) => res.json())
          .then((data) => {
            setMessage(data.message);
            alert(data.message);
            if (data.status) {
              router.push("/admin/coupon");
            }
          })
      }
    }



  return(
    <Template hscreen>
      <div className="bg-[#F5F5F5] w-[60%] h-full mt-16 rounded-t-md px-[6rem] pt-8">
        <div className="w-full text-4xl font-semibold text-center h-[15%] pt-4">Creating a new coupon code</div>
        <form className="w-full flex flex-col h-[85%] place-items-center">
          <div className="flex flex-col w-[75%] bg-[#FAFCFE] h-[80%] rounded-md p-8 gap-4">
            <div className="flex w-full place-items-center gap-4">
              <div className="w-[75%] flex flex-col">
                <label className="text-black font-semibold">Season Description</label>
                <div className="w-full flex place-items-center border border-[#C4C4C4] rounded-md mt-2">
                  <input 
                    className="w-[90%] text-lg outline-none px-2 py-1"
                    type="text"
                    placeholder="Enter the code name"
                    onChange={(e) => setSeason({...coupon, code_name: e.target.value})}
                    onBlur={verifyCode}
                  />
                  
                </div>
              </div>
            
            </div>
            <div className="flex w-full gap-4">
              <div className="flex flex-col w-[50%]">
                <label className="text-black font-semibold">Coupon Type</label>
                <select
                  className="w-full text-lg outline-none px-2 py-1 border border-[#C4C4C4] rounded-md mt-2 appearance-none"
                  onChange={(e) => setSeason({...coupon, code_type: e.target.value})}
                >
                  <option value={1}>Percent</option>
                  <option value={0}>Fixed</option>
                </select>
              </div>
              <div className="flex flex-col w-[50%]">
                <label className="text-black font-semibold">Discount Factor</label>
                <input 
                  className="w-full rounded-md border border-[#C4C4C4] text-base px-2 py-1 mt-2"
                  type="number"
                  placeholder="Enter the discount factor"
                  onChange={(e) => setSeason({...coupon, discount_factor: e.target.value})}
                  min={0}
                  max={coupon.code_type === 1 ? 1 : null}
                />
              </div>
            </div>
            <div className="w-[50%] pr-4">
              <label className="text-black font-semibold">Number Available</label>
              <input
                className="w-full rounded-md border border-[#C4C4C4] text-base px-2 py-1 mt-2"
                type="number"
                placeholder="Enter the number of coupon available"
                onChange={(e) => setSeason({...coupon, count_limit: e.target.value})}
                min={0}
              />
            </div>
            <div className="w-[50%] pr-4">
              <label className="text-black font-semibold">Expired Date</label>
              <input
                className="w-full rounded-md border border-[#C4C4C4] text-base  outline-none"
                type="datetime-local"
                // set the date format to yyyy-mm-dd
                placeholder="Enter the expired date"

                onChange={(e) => setSeason({...coupon, expired_date: e.target.value})}
              />
            </div>
            <div className="w-full">
              <label className="text-black font-semibold">Description</label>
              <textarea
                className="w-full rounded-md border border-[#C4C4C4] text-base px-2 py-1 mt-2"
                type="text"
                placeholder="Enter the description"
                onChange={(e) => setSeason({...coupon, description: e.target.value})}
              />
            </div>
          </div>
          <div className="flex w-[75%] px-4 font-semibold mt-4">
            <div
              className=" border border-[#6C6EF2] rounded-md w-[50%] text-[#6C6EF2] text-center py-2"
              onClick={() => router.push("/admin/coupon")}
            >
              CANCEL
            </div>
            <div
              className="bg-[#6C6EF2] rounded-md w-[50%] text-white text-center py-2 ml-4"
              onClick={createCode}
            >
              CREATE
            </div>
          </div>
        </form>

      </div>
    </Template>
  )
}