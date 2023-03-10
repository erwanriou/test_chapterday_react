import React, { useState, useEffect } from "react"

// IMPORT API
import { fetchImage } from "./api"

const App = () => {
  // HOOKS
  const [data, setData] = useState({})

  // LIFECYLE
  useEffect(async () => {
    const loadedData = await fetchImage()
    setData(loadedData)
  }, [])

  // MAIN RENDER
  return (
    <div>
      <h2>SOLUTION</h2>
      <p>{data?.solution}</p>
      <h2>IMAGE</h2>
      <img src={`data:image/png;base64,${data.image}`} alt="no alt i am stupid" />
    </div>
  )
}

export default App
