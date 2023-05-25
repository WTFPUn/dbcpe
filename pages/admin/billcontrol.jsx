import Template from "@/components/Template";
import { useEffect, useState } from "react";

export default function billcontrol() {

  const [bill, setBill] = useState();

  
  const [filter, setFilter] = useState({
    bill_id: "",
    paid_status: "",
  });



  const handleFilter = (e, key) => {
    setFilter({
      ...filter,
      [key]: e.target.value,
    });


  };



  return(
    <Template hscreen>
      <div className="w-[75%] bg-[#F5F5F5] rounded-t-md h-full mt-24 flex flex-col">
        <div className="w-full h-[20%] text-center text-black text-3xl font-semibold py-16 ">Guest's Bill</div>
        <div className="flex flex-col w-full h-[80%]">
          <div className="flex w-full rounded-md">

          </div>
        </div>
      </div>
    </Template>
  )
}