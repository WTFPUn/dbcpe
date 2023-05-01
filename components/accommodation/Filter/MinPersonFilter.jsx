import React, { useCallback } from 'react'

export default function MinPersonFilter({setAccommodationList, accommodationList}) {
  const sendAccommodationList = useCallback((key, value) => {
    setAccommodationList({
      ...accommodationList,
      [key]: value,
    })
  }, [accommodationList])

  return(
    <div>
      <input type="number" onChange={(e) => sendAccommodationList("minPerson", e.target.value)}/>
    </div>
  )
}