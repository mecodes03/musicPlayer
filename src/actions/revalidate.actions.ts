"use server";

import { revalidatePath, revalidateTag } from "next/cache";

export const serverRevalidateTag = async (tag: string) => {
  if (!tag) {
    return;
  }
  try {
    revalidateTag(tag);
    return { success: true };
  } catch (error) {
    return { success: false };
  }
};


export const serverRevalidatePath = async (path: string) => {
  if (!path) {
    return;
  }
  try {
    revalidatePath(path);
    return { success: true };
  } catch (error) {
    return { success: false };
  }
};
