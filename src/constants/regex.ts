const REGEXES = {
  EMAIL: /^[a-zA-Z0-9.]+@[a-zA-Z]+[.][a-zA-Z]+$/,
  NAME: /^[a-zA-Z ]+$/,
  PASSWORD: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/,
  COMMA_SEPARATED: /^[a-z-A-Z]+(,[a-z-A-Z]+)*$/
};

export default REGEXES;
