export default defineNuxtRouteMiddleware(() => {
  const auth = useAuthStore();
  auth.restoreSession();

  if (!auth.isAuthenticated) {
    return navigateTo("/auth/login");
  }
});
