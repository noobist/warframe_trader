import axios from 'axios';

const BASE_URL = 'https://api.warframe.market/v1';

const urlBuilder = (path) => {
  if (path.charAt(0) === '/')
    return BASE_URL + path;
  return BASE_URL + '/' + path;
}

const getAllItems = async () => {
  const endpoint = `items`;
  const response = await axios.get(urlBuilder(endpoint));

  if (response.status === 200)
    return response.data.payload.items;
  else
    console.log(response);
}

/*const async getItemOrders = (item) => {
  const endpoint = `${item}/orders`
  const response = await axios.get(urlBuilder(endpoint));

  if (response.stats === 200)
    return response.data;
  else
    console.log(response);
}*/

const api = {
  getAllItems
};

export default api;
