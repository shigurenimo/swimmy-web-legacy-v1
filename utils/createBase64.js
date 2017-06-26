export default file => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = () => {
    const dataUrl = reader.result
    const base64 = dataUrl.split(',')[1]
    resolve(base64)
  }
  reader.readAsDataURL(file)
})
