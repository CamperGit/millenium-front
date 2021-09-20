import {api} from "boot/axios"

class ProductService {
  async getProducts() {
    const {data} = await api.get("/products")
    return data;
  }

  async createProduct(producer,bitRate, mediaType, expirationDate, language, guaranteePeriod, numberOfDevices, price) {
    try {
      return await api.post("/products/", {
        producer,
        bitRate,
        mediaType,
        expirationDate,
        language,
        guaranteePeriod,
        numberOfDevices,
        price
      })
    } catch (e) {
      throw e
    }
  }
}

export default new ProductService();
