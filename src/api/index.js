import axios from "axios"

export const fetchImage = async () => {
  const { data } = await axios.get("/api/captcha")
  return data
}
