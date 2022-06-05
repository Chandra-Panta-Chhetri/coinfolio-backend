export interface IUserDTO {
  name: string;
  email: string;
  id: number;
  token: string;
}

export interface IUserSchema {
  name: string;
  email: string;
  id: number;
  password: string;
}

export interface IRequestUser {
  id: number;
  email: string;
}

export interface ILoginReqBody {
  email?: string;
  password?: string;
}

export interface IRegisterReqBody {
  email?: string;
  password?: string;
  name?: string;
}
