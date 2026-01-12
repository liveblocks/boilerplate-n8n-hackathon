export const STORAGE_KEY = "liveblocks-current-user-id";

export function getCurrentUser() {
  let userId = localStorage.getItem(STORAGE_KEY);

  if (!userId) {
    userId = "charlie.layne@example.com";
    localStorage.setItem(STORAGE_KEY, userId);
  }

  return userId;
}

export function switchCurrentUser(userId: string) {
  localStorage.setItem(STORAGE_KEY, userId);
}
