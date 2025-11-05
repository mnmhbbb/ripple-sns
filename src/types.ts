import { type Database } from "@/lib/database.types";

export type PostEntity = Database["public"]["Tables"]["post"]["Row"];

export type UseMutationCallbacks = {
  onError?: (error: Error) => void;
  onSuccess?: () => void;
  onSettled?: () => void;
  onMutate?: () => void;
};
