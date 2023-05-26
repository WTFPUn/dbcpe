import Template from "@/components/Template"
import Section from "@/components/booking/Section";
import InfoIcon from "@/components/icons/InfoIcon";
import { jwtdecode } from "@/utils/verify";
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


  const sectionShow = () => {
    const token = localStorage.getItem("token");
    const decoded = jwtdecode(token);
    return decoded.role == 1 ? false : true;
  }

  const [discountExVisible, setDiscountExVisible] = useState(false);
  const [paymentmethod, setPaymentmethod] = useState("")

  const paymentMethod = ["Credit/Debit Card", "Paypal", "Bitcoin", "Transfer", "Cash"]


  const handleConfirm = (caller) => {
    const token = localStorage.getItem("token");
    if (caller == "confirm") {
      const payload = {
        bill_id: bill_id,
        payment_method: paymentmethod,
    }
    fetch(`/api/admin/billconfirm`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        'auth-token': token
        },
        body: JSON.stringify(payload)
        });
  }
  else if (caller == "cancel") {
    const payload = {
      bill_id: bill_id,
  }
  fetch(`/api/admin/billcancel`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      'auth-token': token
      },
      body: JSON.stringify(payload)
      });
  }
  }

  if (bill) {
  return(
    <Template title="Bill">
      <div className="bg-white w-5/6 rounded-t-md flex flex-col place-items-center py-2 h-full ">
        {sectionShow() ? 
        <Section /> :
        <div className="w-full text-4xl font-semibold text-center h-[15%] pt-4">Guest's bill</div>
        }
        <div className="w-[85%] flex flex-col place-items-center mt-8">
          {sectionShow() &&
          <div className="font-semibold text-xl my-10">Your Bill</div>
          }
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
                <div className="bg-[#ECF1F4] px-16 min-h-[24rem]">
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
                  <div className="text-[#8C8CA1] text-base h-16 w-full flex">
                      <div className=" w-10/12 text-left font-semibold pl-8">{"Total: "}</div>
                      <div className=" w-2/12 text-center font-semibold">{bill.price.toFixed(2)}</div>
                  </div>
                  <div className="text-[#8C8CA1] text-base h-16 w-full flex">
                      <div className=" w-10/12 text-left font-semibold flex gap-2">
                        <div 
                          className="relative" 
                          onMouseLeave={() => setDiscountExVisible(false)} 
                          onMouseEnter={() => setDiscountExVisible(true)}
                          >
                          {discountExVisible &&
                          <div className="absolute bottom-[-2rem] bg-gray-400 text-white text-[.7rem] rounded-md p-2 h-12 w-max ">
                            <p>Discount price calculated by Tier that calculated by the number of paid book! </p>
                          </div>
                          }
                          <InfoIcon/>
                          </div>
                          {"Discounted: "}
                        </div>
                      <div className=" w-2/12 text-center font-semibold">{bill.discounted_price.toFixed(2)}</div>
                  </div>
                </div>
                <div className="flex px-8 py-8 justify-between">
                      <div className="flex flex-col w-1/2 text-left gap-4 font-semibold">
                        <div className="text-2xl text-[#4A4A68]">{"Date: " + Date(bill.create_date).slice(0, 15)}</div>
                        <div className="text-2xl text-[#0E0E2C]">{"Due Date: " + bill.pay_due_date}</div>
                      </div>
                      <div className="flex flex-col w-1/2 text-right gap-4 font-semibold">
                        <div className="text-[#4A4A68] text-base font-[550]">Total</div>
                        <div className="text-[#FAFCFE] text-base font-[550]">{bill.discounted_price.toFixed(2)}</div>
                      </div>
                </div>
            </div>
        </div>
        <div className="w-[50%] py-4 flex flex-col place-items-center mt-8 gap-4">
          <select
            className="w-full bg-[#6C6EF2] text-white text-left px-8 py-4 rounded-md appearance-none"
            onChange={(e) => setPaymentmethod(e.target.value)}
          >
            {paymentMethod.map((type, i) => (
              <option 
                className="bg-[#C4C4C4]"
                key={i} 
                value={type}>
                {type}
              </option>
            ))}
          </select>
          <div className="w-full flex  gap-4">
            <div 
              className="border-[#6C6EF2] border text-[#6C6EF2] w-1/2 py-4 uppercase text-center rounded-md font-semibold cursor-pointer"
              onClick={() => {handleConfirm("cancel")}}
              >
              Cancel bill
            </div>
            <div
              className="bg-[#6C6EF2] text-white w-1/2 py-4 uppercase text-center rounded-md font-semibold cursor-pointer"
              onClick={() => {handleConfirm("confirm")}}
              >
              Confirm
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