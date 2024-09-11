const BASE_URL = "http://localhost:3333";

export const getSales = async () => {
  const response = await fetch(BASE_URL + "/vendas");
  const data = await response.json();

  return data;
};
