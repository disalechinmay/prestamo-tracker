import { atom } from 'recoil';
import { IUser } from '../types';

export const userAtom = atom<IUser | null>({
  key: 'user',
  default: null,
});

export const accessTokenAtom = atom<string | null>({
  key: 'accessToken',
  default: null,
});
