const REGEXES = {
  EMAIL: /^[a-zA-Z0-9.]+@[a-zA-Z]+[.][a-zA-Z]+$/,
  NAME: /^[a-zA-Z ]+$/,
  PASSWORD: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/
};

export default REGEXES;
