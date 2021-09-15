export const getFavoriteList = key => {
  const list = localStorage.getItem(key);
  return list ? JSON.parse(list) : [];
};

export const setFavoriteList = (key: string, list) => {
  return localStorage.setItem(key, JSON.stringify(list));
};
