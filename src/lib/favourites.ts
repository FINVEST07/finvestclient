import axios from "axios";
import Cookie from "js-cookie";

export type FavouriteItemType = "blog" | "property";

export interface FavouriteRef {
  type: FavouriteItemType;
  id: string;
}

export interface FavouriteResponsePayload {
  favourites: FavouriteRef[];
  blogs: any[];
  properties: any[];
}

export const getLoggedInEmail = () => {
  const cookie = Cookie.get("finvest");
  if (!cookie) return "";
  return cookie.split("$")[0]?.trim().toLowerCase() || "";
};

const getAuthConfig = () => {
  const email = getLoggedInEmail();
  if (!email) return { headers: {} };
  return {
    headers: {
      "x-user-email": email,
    },
    withCredentials: true,
  };
};

export const fetchFavourites = async () => {
  const res = await axios.get(`${import.meta.env.VITE_API_URI}favourites`, getAuthConfig());
  return (res.data?.payload || {
    favourites: [],
    blogs: [],
    properties: [],
  }) as FavouriteResponsePayload;
};

export const toggleFavourite = async (itemId: string, itemType: FavouriteItemType) => {
  const res = await axios.post(
    `${import.meta.env.VITE_API_URI}favourites/toggle`,
    {
      itemId,
      itemType,
    },
    getAuthConfig()
  );
  return res.data;
};
