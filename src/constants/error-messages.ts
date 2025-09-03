const ERROR_MESSAGES = {
  LOGIN: "Email or password is wrong.",
  DUPLICATE_EMAIL: "Email is already being used.",
  PASSWORD_FORMAT: "Password should have at least 8 characters, 1 uppercase letter, 1 lowercase letter and 1 number.",
  PORTFOLIO_CREATE: "Failed to create a portfolio. Please try again.",
  PORTFOLIO_UPDATE: "Failed to update portfolio. Please try again.",
  PORTFOLIO_DELETE: "Failed to delete portfolio. Please try again.",
  AUTHENTICATION: "Please login and try again.",
  REQUIRES_NO_AUTHENTICATION: "Please logout and try again.",
  PORTFOLIO_UNAUTHORIZED_ACTION: "Insufficent permission.",
  GENERIC: "Failed request.",
  SERVER: "Internal server error."
};

export default ERROR_MESSAGES;
