import axios from "axios";
import Cookie from "js-cookie";
import { openLoginModal } from "@/lib/loginModal";

export type FavouriteItemType = "blog" | "property" | "job";

export interface FavouriteRef {
  type: FavouriteItemType;
  id: string;
}

export interface FavouriteResponsePayload {
  favourites: FavouriteRef[];
  blogs: any[];
  properties: any[];
  jobs: any[];
}

interface PendingFavouriteAction {
  itemId: string;
  itemType: FavouriteItemType;
  createdAt: number;
}

export const FAVOURITE_COMPLETED_EVENT = "finvest:favourite-completed";
const PENDING_FAVOURITE_ACTION_KEY = "finvest:pending-favourite-action";

export const getLoggedInEmail = () => {
  const cookie = Cookie.get("finvest");
  if (!cookie) return "";
  return cookie.split("$")[0]?.trim().toLowerCase() || "";
};

const isValidItemType = (itemType: unknown): itemType is FavouriteItemType => {
  return itemType === "blog" || itemType === "property" || itemType === "job";
};

const normalizePendingFavouriteAction = (value: unknown): PendingFavouriteAction | null => {
  if (!value || typeof value !== "object") return null;

  const candidate = value as Partial<PendingFavouriteAction>;
  const itemId = String(candidate.itemId || "").trim();
  const itemType = candidate.itemType;
  const createdAt = Number(candidate.createdAt || Date.now());

  if (!itemId || !isValidItemType(itemType)) return null;

  return {
    itemId,
    itemType,
    createdAt: Number.isFinite(createdAt) ? createdAt : Date.now(),
  };
};

export const savePendingFavouriteAction = (action: {
  itemId: string;
  itemType: FavouriteItemType;
}) => {
  if (typeof window === "undefined") return;

  const normalized = normalizePendingFavouriteAction({
    ...action,
    createdAt: Date.now(),
  });

  if (!normalized) return;
  localStorage.setItem(PENDING_FAVOURITE_ACTION_KEY, JSON.stringify(normalized));
};

export const getPendingFavouriteAction = (): PendingFavouriteAction | null => {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(PENDING_FAVOURITE_ACTION_KEY);
  if (!raw) return null;

  try {
    return normalizePendingFavouriteAction(JSON.parse(raw));
  } catch (error) {
    return null;
  }
};

export const clearPendingFavouriteAction = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(PENDING_FAVOURITE_ACTION_KEY);
};

export const ensureAuthenticatedForFavourite = (action?: {
  itemId: string;
  itemType: FavouriteItemType;
}) => {
  const email = getLoggedInEmail();
  if (email) return true;

  if (action?.itemId && action?.itemType) {
    savePendingFavouriteAction(action);
  }

  openLoginModal();
  return false;
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
    jobs: [],
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

export const completePendingFavouriteAction = async () => {
  const pending = getPendingFavouriteAction();
  const email = getLoggedInEmail();

  if (!pending || !email) {
    return { completed: false as const };
  }

  try {
    const payload = await fetchFavourites();
    const alreadyFavourite = (payload.favourites || []).some(
      (fav) => fav.type === pending.itemType && String(fav.id) === String(pending.itemId)
    );

    if (!alreadyFavourite) {
      await toggleFavourite(pending.itemId, pending.itemType);
    }

    clearPendingFavouriteAction();

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent(FAVOURITE_COMPLETED_EVENT, {
          detail: {
            itemId: pending.itemId,
            itemType: pending.itemType,
          },
        })
      );
    }

    return {
      completed: true as const,
      itemId: pending.itemId,
      itemType: pending.itemType,
    };
  } catch (error) {
    clearPendingFavouriteAction();
    throw error;
  }
};
