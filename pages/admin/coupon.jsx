import Template from "@/components/Template";
import { useEffect, useState } from "react";

export default function coupon() {

  const [coupon, setCoupon] = useState();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch('/api/admin/getallcode', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => res.json())
        .then((data) => setCoupon(data.getcode))
      }
  }, []);

  return(
    <Template hscreen>
      <div className="bg-[#F5F5F5] w-[60%] h-full mt-16 rounded-t-md px-[6rem] pt-8">
        <div className="w-full text-4xl font-semibold text-center h-[15%] pt-4">The coupons</div>
        <div className="flex flex-col h-[24rem] bg-[#FAFCFE] w-full drop-shadow rounded-md">
          <div className="text-black w-full h-[10%] flex ">
            <div className="w-[20%]  justify-center text-center">Code</div>
            <div className="w-[20%]  justify-center text-center">Description</div>
            <div className="w-[5%]   justify-center text-center">Quantity</div>
            <div className="w-[15%]  justify-center text-center">Reminder</div>
            <div className="w-[10%]  justify-center text-center">Code-Type</div>
            <div className="w-[10%]  justify-center text-center">Discounted Factor</div>
            <div className="w-[20%]  justify-center text-center">Expired</div>
          </div>
          <div className="w-full h-[90%] overflow-y-scroll">
            {coupon && coupon.map((item, index) => (
              <div key={index} className="text-black w-full h-[10%] flex border-b border-[#E4E4E7]">
                <div className="w-[20%]  justify-center text-center">{item.code_name}</div>
                <div className="w-[20%]  justify-center text-center">{item.description}</div>
                <div className="w-[5%]   justify-center text-center">{item.count_limit}</div>
                <div className="w-[15%]  justify-center text-center">{item.reminder}</div>
                <div className="w-[10%]  justify-center text-center">{item.code_type}</div>
                <div className="w-[10%]  justify-center text-center">{item.discount_factor}</div>
                <div className="w-[20%]  justify-center text-center">{item.expired_date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Template>
  )
}