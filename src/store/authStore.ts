import { defineStore } from 'pinia';

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    user: null as any,
    token: null as string | null,
  }),
  actions: {
    setSession(user: any, token: string) {
      this.user = user;
      this.token = token;
      localStorage.setItem('user_token', token);
    },
    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('user_token');
    }
  }
});