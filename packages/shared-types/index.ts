export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface Room {
  id: string;
  name: string;
  ownerId: string;
  isPublic: boolean;
  createdAt: Date;
}
