import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const bodySchema = z.object({
  exam: z.enum(["JEE_MAINS", "JEE_ADV", "NEET", "GATE", "UGC_NET", "CUET", "OTHER"]),
  category: z.enum(["GENERAL", "OBC", "SC", "ST", "EWS", "OTHER"]).default("GENERAL"),
  year: z.coerce.number().int().min(2000).max(2100).optional(),
  percentile: z.coerce.number().min(0).max(100).optional(),
  rank: z.coerce.number().int().min(1).optional(),
});

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request body", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { exam, category, year, percentile, rank } = parsed.data;

  if (percentile === undefined && rank === undefined) {
    return NextResponse.json(
      { error: "Provide either percentile or rank" },
      { status: 400 },
    );
  }

  const cutoffYear = year ?? new Date().getFullYear();
  const cutoffs = await prisma.cutOffRequirement.findMany({
    where: { exam, category, year: cutoffYear },
    include: { college: true },
    orderBy: [{ closingRank: "asc" }, { closingPercentile: "desc" }],
  });

  const matches = cutoffs.map((cutoff) => {
    const rankOk = rank !== undefined && cutoff.closingRank !== null && rank <= cutoff.closingRank;
    const percentileOk =
      percentile !== undefined &&
      cutoff.closingPercentile !== null &&
      percentile >= cutoff.closingPercentile;

    const safe = rankOk || percentileOk;
    const target = !safe &&
      ((rank !== undefined && cutoff.openingRank !== null && rank <= cutoff.openingRank) ||
        (percentile !== undefined && cutoff.openingPercentile !== null && percentile >= cutoff.openingPercentile));

    return {
      collegeId: cutoff.collegeId,
      collegeName: cutoff.college.name,
      city: cutoff.college.city,
      state: cutoff.college.state,
      round: cutoff.round,
      openingRank: cutoff.openingRank,
      closingRank: cutoff.closingRank,
      openingPercentile: cutoff.openingPercentile,
      closingPercentile: cutoff.closingPercentile,
      band: safe ? "safe" : target ? "target" : "reach",
      quota: cutoff.quota,
    };
  });

  return NextResponse.json({
    input: { exam, category, year: cutoffYear, percentile, rank },
    count: matches.length,
    matches,
  });
}
