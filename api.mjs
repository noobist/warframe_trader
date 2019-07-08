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

const getItemOrders = async item => {
  const endpoint = `items/${item}/orders`;
  const response = await axios.get(urlBuilder(endpoint));

  if (response.status === 200)
    return response.data.payload.orders;
  else
    console.log(response);
}

const api = {
  getAllItems,
  getItemOrders,
};

export default api;
