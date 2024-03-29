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

const getItem = async item => {
  const endpoint = `items/${item}`;
  const response = await axios.get(urlBuilder(endpoint));

  if (response.status === 200)
    return response.data.payload.item.items_in_set[0];
  else
    return NULL;
}

const getItemOrders = async item => {
  const endpoint = `items/${item}/orders`;
  const response = await axios.get(urlBuilder(endpoint));

  if (response.status === 200)
    return response.data.payload.orders;
  else
    return NULL;
}

const api = {
  getAllItems,
  getItem,
  getItemOrders,
};

export default api;
