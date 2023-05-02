export default function CheckCircle({ isIn}) {
  return(
    <div className={`p-4 bg-[#6C6EF2] w-max rounded-2xl ${!isIn ? ' opacity-30' : ''}`}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 stroke-white">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>

  )
}