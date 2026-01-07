import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertCommuteRoute } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

// ============================================
// COMMUTE ROUTES
// ============================================

export function useRoutes() {
  return useQuery({
    queryKey: [api.routes.list.path],
    queryFn: async () => {
      const res = await fetch(api.routes.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch routes");
      return api.routes.list.responses[200].parse(await res.json());
    },
  });
}

export function useRoute(id: number | null) {
  return useQuery({
    queryKey: [api.routes.get.path, id],
    enabled: !!id,
    queryFn: async () => {
      if (!id) throw new Error("ID required");
      const url = buildUrl(api.routes.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch route");
      return api.routes.get.responses[200].parse(await res.json());
    },
  });
}

export function useCreateRoute() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertCommuteRoute) => {
      const res = await fetch(api.routes.create.path, {
        method: api.routes.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.routes.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to create route");
      }
      return api.routes.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.routes.list.path] });
      toast({ title: "Route created", description: "Your commute has been saved." });
    },
    onError: (error) => {
      toast({ 
        title: "Error", 
        description: error.message, 
        variant: "destructive" 
      });
    },
  });
}

export function useUpdateRoute() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & Partial<InsertCommuteRoute>) => {
      const url = buildUrl(api.routes.update.path, { id });
      const res = await fetch(url, {
        method: api.routes.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to update route");
      return api.routes.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.routes.list.path] });
      toast({ title: "Route updated", description: "Changes saved successfully." });
    },
  });
}

// ============================================
// TRAFFIC PREDICTIONS
// ============================================

export function usePrediction(routeId: number | null) {
  return useQuery({
    queryKey: [api.predictions.get.path, routeId],
    enabled: !!routeId,
    // Refetch every minute to keep traffic status fresh
    refetchInterval: 60000, 
    queryFn: async () => {
      if (!routeId) throw new Error("Route ID required");
      const url = buildUrl(api.predictions.get.path, { id: routeId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch prediction");
      return api.predictions.get.responses[200].parse(await res.json());
    },
  });
}

// ============================================
// DEVICE SYNC
// ============================================

export function useSyncDevice() {
  return useMutation({
    mutationFn: async (status: 'green' | 'yellow' | 'red') => {
      const res = await fetch(api.device.sync.path, {
        method: api.device.sync.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to sync device");
      return api.device.sync.responses[200].parse(await res.json());
    },
  });
}
