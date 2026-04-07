export const OPEN_LOGIN_MODAL_EVENT = "finvest:open-login-modal";

let lastModalOpenAt = 0;

export const openLoginModal = () => {
  if (typeof window === "undefined") return;

  const now = Date.now();
  if (now - lastModalOpenAt < 250) return;

  lastModalOpenAt = now;
  window.dispatchEvent(new CustomEvent(OPEN_LOGIN_MODAL_EVENT));
};
