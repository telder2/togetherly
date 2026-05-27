'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type IdentityEntry = {
  groupId: string;
  groupCode: string;
  groupName: string;
  memberId: string;
  memberName: string;
  avatarSeed: string;
  role: 'owner' | 'member';
};

type IdentityStore = {
  identities: Record<string, IdentityEntry>; // keyed by groupId
  setIdentity: (groupId: string, entry: IdentityEntry) => void;
  getIdentity: (groupId: string) => IdentityEntry | null;
  removeIdentity: (groupId: string) => void;
  listIdentities: () => IdentityEntry[];
};

export const useIdentityStore = create<IdentityStore>()(
  persist(
    (set, get) => ({
      identities: {},
      setIdentity: (groupId, entry) =>
        set((state) => ({ identities: { ...state.identities, [groupId]: entry } })),
      getIdentity: (groupId) => get().identities[groupId] ?? null,
      removeIdentity: (groupId) =>
        set((state) => {
          const next = { ...state.identities };
          delete next[groupId];
          return { identities: next };
        }),
      listIdentities: () => Object.values(get().identities),
    }),
    { name: 'togetherly-identity' }
  )
);
