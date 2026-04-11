"use server"

import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function requestIcAction(formData: FormData) {
  const user = await requireRole("INTERN");
  const rawName = formData.get("icName")?.toString();

  if (!rawName || rawName.trim().length === 0) {
    return { error: "Please provide a valid IC name." };
  }

  // Step 1: Normalize input
  const normalizedName = rawName.toUpperCase().replace(/\s+/g, "");

  // Step 2: Check if canonicalName already exists
  const existingIc = await prisma.iC.findFirst({
    where: { canonicalName: { equals: normalizedName, mode: "insensitive" } }
  });

  if (existingIc) {
    return { error: `Already exists. Search for ${existingIc.canonicalName} and claim it.` };
  }

  // Step 3: Check if name matches any ICAlias
  const existingAlias = await prisma.iCAlias.findFirst({
    where: { name: { equals: normalizedName, mode: "insensitive" } },
    include: { ic: true }
  });

  if (existingAlias) {
    return { error: `This is an alias of ${existingAlias.ic.canonicalName}. Search and claim that instead.` };
  }

  // Step 4: Check if AddRequest already exists for this intern
  const existingRequest = await prisma.addRequest.findFirst({
    where: { 
      normalizedName, 
      requesterId: user.id,
      status: "PENDING"
    }
  });

  if (existingRequest) {
    return { error: "You already have a pending request for this IC." };
  }

  // Per Architectural Core Rule 'SPICE Fidelity', do NOT auto-create a canonical IC without admin categories.
  // Instead, create an AddRequest indicating they want a new IC.
  await prisma.addRequest.create({
    data: {
      rawName: rawName.trim(),
      normalizedName,
      requesterId: user.id,
      status: "PENDING"
    }
  });

  revalidatePath("/intern/browse");
  return { success: `Request for ${normalizedName} has been sent to an admin for review.` };
}
