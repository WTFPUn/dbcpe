import Template from "@/components/Template";
import FilterBar from "@/components/accommodation/FilterBar";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function accommodation() {
  
  let paramsRoomType = [];
  
  // get room type from slug for first time of page load
  useEffect(() => {
    const router = useRouter();
    const { slug } = router.query;
    if (slug) {
      paramsRoomType = slug;
    }
  }, []);
  
  const [accommodationList, setAccommodationList] = useState({
    "checkIn": "",
    "checkOut": "",
    "minPerson": "",
    "roomType": paramsRoomType,
  });

  return (
    <Template title="Accommodation">
      <FilterBar setAccommodationList={setAccommodationList} />
    </Template>
  )
}