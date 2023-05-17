import Template from "@/components/Template"
import Section from "@/components/booking/Section";
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export default function bill() {
  // get bill_id from url
  const router = useRouter();
  const [bill_id, setBill_id] = useState();

  const [bill, setBill] = useState();

  useEffect(() => {
    setBill_id(router.query.bill_id);
  });

  const asyncFetch = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`/api/bill/getbillbybillid?bill_id=${bill_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'auth-token': token
          },
          });
    const data = await res.json();
    setBill(data.getbill);
  }

  useEffect(() => {
    if (bill_id) {
      asyncFetch();
      console.log("fetched")
    }
    console.log(bill)
  }, [bill_id]);



  if (bill) {
  return(
    <Template title="Bill">
      <div className="bg-white w-5/6 rounded-t-md flex flex-col place-items-center py-2 h-full ">
        <Section/>
        <div className="w-[85%]">
          <div className="font-semibold text-xl my-10">Your Bill</div>
            <div className="flex flex-col rounded-md w-[90%] bg-[#06CBC3] place-content-center">
                <div className="flex flex-col w-full justify-between px-16 py-8">
                  <div className="flex justify-between">
                    <div className="flex flex-col justify-between">
                      <div className=" font-dmserif text-4xl font-bold text-white">
                        MISH HOTEL
                      </div>
                      <div className=" text-2xl text-[#4A4A68] flex place-items-center gap-2">
                        <p>Bill ID:</p>
                        <p className="text-sm">{bill_id}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 text-white font-medium place-items-end">
                      <div className=" text-2xl font-semibold">
                        {bill.first_name + " " + bill.last_name}
                      </div>
                      <div>
                        {bill.address}
                      </div>
                      <div>
                        {bill.district + ", " + bill.sub_district}
                      </div>
                      <div>
                        {bill.province + ", " + bill.postcode}
                      </div>
                      <div>
                        {bill.phone_no}
                      </div>
                    </div>
                  </div>

                </div>
                <div className="bg-[#ECF1F4] px-16 min-h-[16rem]">
                  <table className=" table-fixed my-8 w-full">
                    <thead>
                      <tr className="text-[#4A4A68] text-lg font-semibold w-full">
                        <th className=" w-2/12">Booking ID</th>
                        <th className=" w-8/12">Description</th>
                        <th className=" w-2/12">Amount</th>
                      </tr>
                      {bill.array_book.map((book, i) => (
                        <tr className="text-[#8C8CA1] text-base h-16 w-full">
                            <td className=" w-2/12 text-center">{book.book_id}</td>
                            <td className=" w-8/12 text-center">{book.booktype === "room" ? book.description : book.description + "Exhibition"}</td>
                            <td className=" w-2/12 text-center">{book.amount.toFixed(2)}</td>
                        </tr>
                      ))
                      }
                    </thead>
                  </table>
                </div>
                <div className="flex">
                    <div className="flex flex-col">
                      <div>
                        
                      </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </Template> 
  )
  }
  else {
    return (
      <Template title="Bill" hscreen>
        <div className="bg-white w-5/6 rounded-t-md flex flex-col place-items-center py-2 h-full ">
          <Section/>
          <div className="w-[85%]">
            <div>Loading or No bill</div>
          </div>
        </div>
      </Template>

    )
  }
} 