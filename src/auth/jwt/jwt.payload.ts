export interface Payload {
  id: number;
  email: string;
  name: string;
  userType: 'user' | 'stylist';
}

export interface Validated {
  id: number;
  email: string;
  name: string;
  userType: 'user' | 'stylist';
}
