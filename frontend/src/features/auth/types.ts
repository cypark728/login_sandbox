export interface User {
  id: number;
  username: string;
}

export interface Credentials {
  username: string;
  password: string;
}

export interface Problem {
  id: number;
  title: string;
}

export interface Attempt {
  id: number;
  problemId: number;
  solvedAt: string;
}
