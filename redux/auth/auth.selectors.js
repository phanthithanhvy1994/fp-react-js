import {createSelector} from 'reselect';

const inputUserStoreSelector = rootStore => rootStore.authStore;
export const selectUser = createSelector(
  [inputUserStoreSelector],
  userStore => (userStore.user ? userStore.user : null),
);
export const selectTempUser = createSelector(
  [inputUserStoreSelector],
  userStore => (userStore.tempUser ? userStore.tempUser : null),
);
