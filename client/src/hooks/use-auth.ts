import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authService, type LoginCredentials, type AuthUser } from "@/lib/auth";
import { useLocation } from "wouter";

export function useAuth() {
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const { data: authData, isLoading } = useQuery({
    queryKey: ["auth"],
    queryFn: authService.verify,
    enabled: authService.isAuthenticated(),
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      queryClient.setQueryData(["auth"], { valid: true, user: data.user });
      setLocation("/admin/dashboard");
    },
  });

  const logout = () => {
    authService.logout();
    queryClient.setQueryData(["auth"], { valid: false });
    setLocation("/admin");
  };

  return {
    user: authData?.user,
    isAuthenticated: authData?.valid || false,
    isLoading,
    login: loginMutation.mutate,
    logout,
    loginError: loginMutation.error,
    isLoggingIn: loginMutation.isPending,
  };
}
