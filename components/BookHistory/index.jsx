import BookHistoryBox from "./BookHistoryBox";

export default function BookHistory({dataList}) {
  return(
    <div className="flex flex-col w-full gap-4 overflow-y-auto h-[85%] pt-8">
      {dataList.map((data, idx) => (
        <BookHistoryBox data={data} idx={idx+1} key={idx}/>
      ))}
    </div>
  )
}