export const OPEN_LOGIN_MODAL_EVENT = "finvest:open-login-modal";

let lastModalOpenAt = 0;
let modalOpenedViaEvent = false;

export const wasModalOpenedViaEvent = () => modalOpenedViaEvent;
export const resetModalOpenedViaEvent = () => {
  modalOpenedViaEvent = false;
};

export const openLoginModal = () => {
  if (typeof window === "undefined") return;

  const now = Date.now();
  if (now - lastModalOpenAt < 250) return;

  lastModalOpenAt = now;
  modalOpenedViaEvent = true;
  window.dispatchEvent(new CustomEvent(OPEN_LOGIN_MODAL_EVENT));
};
