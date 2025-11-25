import { db } from "@/utils/db";

export async function getRoles() {
  return await db.role.findMany({
    select: { id: true, name: true },
  });
}

export async function createRole(name: string) {
  return await db.role.create({
    data: { name },
  });
}
