export interface IUserDTO {
  name: string;
  email: string;
  id: number;
  token: string;
}

export interface IUser {
  name: string;
  email: string;
  id: string | number;
  password: string;
}

export interface IRequestUser {
  id: number;
  email: string;
}
