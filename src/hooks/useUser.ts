"use client";

import { User } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

type ResponseType =
  | {
      success: false;
      error: string;
    }
  | {
      success: true;
      user: User;
    };

const getUser = async () =>
  await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/current-user`)
    .then((res) => res.json())
    .then((res: ResponseType) => (res.success ? res.user : null))
    .catch((err) => {
      toast.error(err);
      return null;
    });

const useUser: () =>
  | {
      status: "success";
      user: User | null;
    }
  | {
      status: "error";
      error: string;
    }
  | {
      status: "pending";
    } = () => {
  const pathname = usePathname();

  const { data, isError, isSuccess, error, refetch } = useQuery({
    queryKey: ["user-accounts"],
    queryFn: async () => {
      console.log("started query...");
      const user = await getUser();
      return user;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry: 2,
  });

  // React.useEffect(() => {
  //   refetch();
  // }, [pathname, refetch]);

  if (isError) {
    return { status: "error", error: error.message };
  }

  if (isSuccess) {
    return { status: "success", user: data };
  }

  return { status: "pending" };
};

export default useUser;
