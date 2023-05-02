import Template from "@/components/Template";
import Section from "@/components/booking/Section";
import { useEffect, useState } from "react";

export default function confirmbook() {
  const [room, setRoom] = useState([]);

  useEffect(() => {
    const getRoom = async () => {
    }
  }, []
  );
  return(
    <Template title="Confirmbook">
      <div className="bg-white w-3/4 rounded-t-md flex flex-col place-items-center py-8 ">
      <Section/>
      
      </div>
    </Template>
  )
}