import Header from "./Header";

export default function Template({children, hscreen, title, hminscreen}) {
  return (
    <div className={ ` font-sans scroll-smooth w-screen bg-[#0E0E2C] ${hscreen && "h-screen"} flex flex-col place-items-center ${hminscreen && "min-h-screen"}`}>
      <Header/>
      { title && <h1 className="text-xl text-white font-bold font-dmserif text-center my-5">{title}</h1>}
      {children}
    </div>
  )
}