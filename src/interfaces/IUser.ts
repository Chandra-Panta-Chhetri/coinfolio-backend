export interface IUser {
  userId: number;
  fullName: string;
  email: string;
  password: string;
}

export interface IRequestUser {
  userId: number;
  email: string;
}
