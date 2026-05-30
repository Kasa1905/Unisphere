import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const querySchema = z.object({
  q: z.string().trim().optional(),
  city: z.string().trim().optional(),
  state: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  minRating: z.coerce.number().min(0).max(5).optional(),
  sort: z.enum(["rating-desc", "name-asc", "fees-asc"]).default("rating-desc"),
});

export async function GET(request: NextRequest) {
  const parsed = querySchema.safeParse(Object.fromEntries(request.nextUrl.searchParams));

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid query", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { q, city, state, page, limit, minRating, sort } = parsed.data;
  const skip = (page - 1) * limit;

  const orderBy =
    sort === "name-asc"
      ? { name: "asc" as const }
      : sort === "fees-asc"
        ? { feesMin: "asc" as const }
        : { ratingAverage: "desc" as const };

  const where = {
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" as const } },
            { description: { contains: q, mode: "insensitive" as const } },
            { city: { contains: q, mode: "insensitive" as const } },
            { state: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...(city ? { city: { equals: city, mode: "insensitive" as const } } : {}),
    ...(state ? { state: { equals: state, mode: "insensitive" as const } } : {}),
    ...(minRating !== undefined ? { ratingAverage: { gte: minRating } } : {}),
  };

  const [total, colleges] = await Promise.all([
    prisma.college.count({ where }),
    prisma.college.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        courses: true,
        placementStats: true,
        reviews: {
          take: 3,
          orderBy: { createdAt: "desc" },
          select: { id: true, rating: true, title: true, content: true, createdAt: true },
        },
      },
    }),
  ]);

  return NextResponse.json({
    data: colleges,
    pagination: {
      page,
      limit,
      total,
      pages: Math.max(1, Math.ceil(total / limit)),
    },
  });
}
