import Template from "@/components/Template";
import MagnifyIcon from "@/components/icons/MagnifyIcon";
import Link from "next/link";
import { use, useEffect, useState } from "react";

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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch('/api/admin/getallbill',
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
        })
        .then((res) => res.json())
        .then((data) => {
          setBill(data.getbill);
        });
    }
  }, []);

  const handleFilterSubmit = () => {
    const token = localStorage.getItem("token");
    fetch(`/api/admin/getallbill?bill_id=${filter.bill_id}&paid_status=${filter.paid_status == 0 ? 1 : 0}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      })
      .then((res) => res.json())
      .then((data) => {
        setBill(data.getbill);
      }
      );
  }

  return(
    <Template hscreen>
      <div className="w-[75%] bg-[#F5F5F5] rounded-t-md h-full mt-24 flex flex-col">
        <div className="w-full h-[20%] text-center text-black text-3xl font-semibold py-16 ">Guest's Bill</div>
        <div className="flex flex-col w-full h-[80%] px-32">
          <div className="flex w-full rounded-md gap-2">
            <div className="w-4/5 flex bg-[#FAFCFE] rounded-md drop-shadow place-items-center">
              <div className="ml-4 w-1/6">
                <MagnifyIcon/>
              </div>
              <input
                  type="text"
                  className="w-4/6 h-full rounded-md bg-[#FAFCFE] ml-4 appearance-none outline-none px-4 text-[#8C8CA1] py-2 placeholder:text-[#C4C4C4]"
                  placeholder="Search for guest's bill by bill id"
                  onChange={(e) => handleFilter(e, "bill_id")}
                />
              <select
                className="w-1/6 border-l border-[#C4C4C4] h-full rounded-r-md bg-[#FAFCFE] ml-4 appearance-none outline-none px-4 text-[#8C8CA1] py-2 placeholder:text-[#C4C4C4]"
                onChange={(e) => handleFilter(e, "paid_status")}
              >
                <option value="">All</option>
                <option value={1}>Paid</option>
                <option value={0}>Unpaid</option>
              </select>
            </div>
            <div 
              className="w-1/5 rounded-md bg-[#6C6EF2] text-white uppercase font-semibold text-center py-2 cursor-pointer"
              onClick={handleFilterSubmit}
              > 
              search
            </div>
          </div>
          <div className="h-[32rem] bg-[#FAFCFE] w-full mt-8 drop-shadow rounded-md p-4 flex flex-col">
            <div className="text-2xl text-black w-full text-left">Bills</div>
            <div className="flex flex-col w-full mt-2 h-[10%]">
              <div className="flex text-black font-semibold w-full">
                <div className="w-[10%] text-center py-2">No</div>
                <div className="w-[15%] text-center py-2">Bill ID</div>
                <div className="w-[15%] text-center py-2">Name</div>
                <div className="w-[15%] text-center py-2">Billed On</div>
                <div className="w-[15%] text-center py-2">Status</div>
                <div className="w-[30%] text-center py-2">Notation</div>
              </div>
            </div>
          <div className="flex flex-col h-[90%] overflow-y-auto">
            {bill && bill.map((item, index) => (
                <div className="flex flex-col w-full mt-2" key={index}>
                  <div className="flex text-[#8C8CA1] w-full">
                    <div className="w-[10%] text-center py-2">{index + 1}</div>
                    <div className="w-[15%] text-center py-2">{item.bill_id}</div>
                    <div className="w-[15%] text-center py-2">{item.full_name}</div>
                    <div className="w-[15%] text-center py-2">{ new Date(item.create_date).getMonth() + new Date(item.create_date).getDay() + new Date(item.create_date).getFullYear()}</div>
                    <div className="w-[15%] text-center py-2">{item.paid_status == 1 ? "Paid" : "Unpaid"}</div>
                    <div className="w-[30%] text-center py-2 text-[#1890FF]"><Link href={"/booking/bill/" + item.bill_id}>View The bill</Link></div>
                  </div>
                </div>
              ))}
          </div> 
          </div>
        </div>
      </div>
    </Template>
  )
}