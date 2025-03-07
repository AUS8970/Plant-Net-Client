import axios from "axios"

// upload image and return imag eurl
export const imageUpload = async imageData => {
  const formData = new FormData()
  formData.append('image', imageData)

  // send image to imgbb
  const { data } = await axios.post(
    `https://api.imgbb.com/1/upload?key=${
    import.meta.env.VITE_IMGBB_API_KEY
    }`, 
    formData
  )

  return data.data.display_url;
}