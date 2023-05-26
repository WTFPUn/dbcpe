import Template from "@/components/Template";
import Link from "next/link";
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
        <div className="flex flex-col h-[24rem] bg-[#FAFCFE] w-full drop-shadow rounded-md py-4">
          <div className="text-black w-full h-[10%] flex font-semibold overflow-y-scroll">
            <div className="w-[20%] text-center">Code</div>
            <div className="w-[15%] text-center">Description</div>
            <div className="w-[5%]  text-center">Quantity</div>
            <div className="w-[15%] text-center">Remainder</div>
            <div className="w-[10%] text-center">Code-Type</div>
            <div className="w-[15%] text-center">Discounted Factor</div>
            <div className="w-[20%] text-center">Expired</div>
          </div>
          <div className="w-full h-[90%] overflow-y-scroll flex flex-col place-items-center">
            {coupon && coupon.map((item, index) => (
              <div key={index} className="text-[#8C8CA1] w-full h-[10%] flex">
                <div className="w-[20%]  text-center">{item.code_name}</div>
                <div className="w-[15%]  text-center">{item.description}</div>
                <div className="w-[5%]   text-center">{item.count_limit}</div>
                <div className="w-[15%]  text-center">{item.remainder}</div>
                <div className="w-[10%]  text-center">{item.code_type}</div>
                <div className="w-[15%]  text-center">{item.discount_factor}</div>
                <div className="w-[20%]  text-center">{item.expired_date}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full flex place-content-center">
          <Link className="mt-4 w-full text-center underline font-semibold text-[#1890FF]" href="/admin/coupon/addcoupon">{"We get a new code >"}</Link>
        </div>
      </div>
    </Template>
  )
}