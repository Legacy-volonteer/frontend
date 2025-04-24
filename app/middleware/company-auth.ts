export default defineNuxtRouteMiddleware(() => {
  const companyAuth = useCompanyAuthStore();
  companyAuth.restoreSession();

  /*
  if (!companyAuth.isAuthenticated) {
    return navigateTo("/auth/login");
  }
    */
});
