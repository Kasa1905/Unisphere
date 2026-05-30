import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database (extended dataset)...");

  // Larger, diverse set of colleges for MVP testing
  const colleges = [
    {
      name: "Bharati Institute of Technology",
      slug: "bharati-institute-of-technology",
      description:
        "A premier engineering institute with strong industry ties and high placement rates.",
      city: "Pune",
      state: "Maharashtra",
      establishedYear: 1998,
      website: "https://bharati.edu",
      feesMin: 80000,
      feesMax: 200000,
      ratingAverage: 4.4,
    },
    {
      name: "Northern College of Science",
      slug: "northern-college-of-science",
      description:
        "A research-focused university with strong postgraduate programs and excellent labs.",
      city: "Delhi",
      state: "Delhi",
      establishedYear: 1965,
      website: "https://northern.ac.in",
      feesMin: 60000,
      feesMax: 180000,
      ratingAverage: 4.1,
    },
    {
      name: "Southern Arts & Technology University",
      slug: "southern-arts-technology-university",
      description:
        "Combines arts, humanities and technology with an emphasis on interdisciplinary learning.",
      city: "Chennai",
      state: "Tamil Nadu",
      establishedYear: 1974,
      website: "https://southernuniv.edu",
      feesMin: 50000,
      feesMax: 150000,
      ratingAverage: 4.0,
    },
    {
      name: "Eastern School of Management",
      slug: "eastern-school-of-management",
      description:
        "Top-tier management programs with strong corporate partnerships and internships.",
      city: "Kolkata",
      state: "West Bengal",
      establishedYear: 1988,
      website: "https://easternmng.ac.in",
      feesMin: 120000,
      feesMax: 350000,
      ratingAverage: 4.2,
    },
    {
      name: "Capital Medical College",
      slug: "capital-medical-college",
      description:
        "Established medical college with research hospitals and strong clinical exposure.",
      city: "Lucknow",
      state: "Uttar Pradesh",
      establishedYear: 1970,
      website: "https://capitalmed.edu",
      feesMin: 200000,
      feesMax: 600000,
      ratingAverage: 4.3,
    },
    {
      name: "Coastal Polytechnic Institute",
      slug: "coastal-polytechnic-institute",
      description:
        "Applied sciences and maritime engineering focus with strong placement in ports and logistics.",
      city: "Kochi",
      state: "Kerala",
      establishedYear: 1995,
      website: "https://coastalpi.ac.in",
      feesMin: 70000,
      feesMax: 160000,
      ratingAverage: 3.9,
    },
    {
      name: "Himalayan Institute of Technology",
      slug: "himalayan-institute-of-technology",
      description:
        "Engineering and environmental sciences with a focus on sustainable development.",
      city: "Dehradun",
      state: "Uttarakhand",
      establishedYear: 2005,
      website: "https://himalayan-it.edu",
      feesMin: 90000,
      feesMax: 210000,
      ratingAverage: 4.0,
    },
  ];

  for (const c of colleges) {
    const college = await prisma.college.create({
      data: {
        name: c.name,
        slug: c.slug,
        description: c.description,
        city: c.city,
        state: c.state,
        establishedYear: c.establishedYear,
        website: c.website,
        feesMin: c.feesMin,
        feesMax: c.feesMax,
        ratingAverage: c.ratingAverage,
      },
    });

    // Add representative courses
    await prisma.course.createMany({
      data: [
        {
          collegeId: college.id,
          name: "Computer Science and Engineering",
          degree: "B.Tech",
          durationMonths: 48,
          feesAnnual: Math.round((c.feesMin + c.feesMax) / 2),
          seats: 120,
        },
        {
          collegeId: college.id,
          name: "Mechanical Engineering",
          degree: "B.Tech",
          durationMonths: 48,
          feesAnnual: Math.round((c.feesMin + c.feesMax) / 2),
          seats: 60,
        },
        {
          collegeId: college.id,
          name: "Data Science (M.Sc)",
          degree: "M.Sc",
          durationMonths: 24,
          feesAnnual: Math.round((c.feesMin + c.feesMax) / 3),
          seats: 30,
        },
      ],
    });

    // Add placement stats for last 3 years (realistic ranges)
    await prisma.placementStat.createMany({
      data: [
        {
          collegeId: college.id,
          year: 2023,
          avgPackage: parseFloat((Math.random() * 4 + 4).toFixed(2)),
          medianPackage: parseFloat((Math.random() * 3 + 3.5).toFixed(2)),
          highestPackage: parseFloat((Math.random() * 40 + 12).toFixed(2)),
          placedCount: Math.floor(Math.random() * 700 + 100),
          totalStudents: Math.floor(Math.random() * 900 + 200),
        },
        {
          collegeId: college.id,
          year: 2022,
          avgPackage: parseFloat((Math.random() * 3.5 + 3.8).toFixed(2)),
          medianPackage: parseFloat((Math.random() * 2.5 + 3.0).toFixed(2)),
          highestPackage: parseFloat((Math.random() * 35 + 10).toFixed(2)),
          placedCount: Math.floor(Math.random() * 700 + 80),
          totalStudents: Math.floor(Math.random() * 900 + 180),
        },
        {
          collegeId: college.id,
          year: 2021,
          avgPackage: parseFloat((Math.random() * 3 + 3.2).toFixed(2)),
          medianPackage: parseFloat((Math.random() * 2 + 2.8).toFixed(2)),
          highestPackage: parseFloat((Math.random() * 30 + 9).toFixed(2)),
          placedCount: Math.floor(Math.random() * 700 + 60),
          totalStudents: Math.floor(Math.random() * 900 + 160),
        },
      ],
    });

    // Add multiple cutoffs (JEE_MAINS, NEET, GATE, CUET) with category variants
    const cutoffs = [
      // JEE_MAINS general
      {
        exam: "JEE_MAINS" as any,
        category: "GENERAL" as any,
        year: 2023,
        round: 1,
        openingRank: Math.floor(Math.random() * 800 + 200),
        closingRank: Math.floor(Math.random() * 2000 + 800),
        openingPercentile: parseFloat((Math.random() * 4 + 90).toFixed(2)),
        closingPercentile: parseFloat((Math.random() * 10 + 75).toFixed(2)),
        seats: 60,
      },
      // JEE_MAINS OBC
      {
        exam: "JEE_MAINS" as any,
        category: "OBC" as any,
        year: 2023,
        round: 1,
        openingRank: Math.floor(Math.random() * 900 + 300),
        closingRank: Math.floor(Math.random() * 2200 + 900),
        openingPercentile: parseFloat((Math.random() * 4 + 88).toFixed(2)),
        closingPercentile: parseFloat((Math.random() * 12 + 70).toFixed(2)),
        seats: 20,
      },
      // NEET - for medical colleges
      {
        exam: "NEET" as any,
        category: "GENERAL" as any,
        year: 2023,
        round: 1,
        openingRank: Math.floor(Math.random() * 200 + 1),
        closingRank: Math.floor(Math.random() * 2000 + 200),
        openingPercentile: parseFloat((Math.random() * 2 + 97).toFixed(2)),
        closingPercentile: parseFloat((Math.random() * 8 + 85).toFixed(2)),
        seats: 30,
      },
      // GATE - postgrad engineering
      {
        exam: "GATE" as any,
        category: "GENERAL" as any,
        year: 2023,
        round: 1,
        openingRank: Math.floor(Math.random() * 1000 + 50),
        closingRank: Math.floor(Math.random() * 5000 + 1000),
        openingPercentile: parseFloat((Math.random() * 6 + 80).toFixed(2)),
        closingPercentile: parseFloat((Math.random() * 20 + 60).toFixed(2)),
        seats: 15,
      },
    ];

    const cutoffData = cutoffs.map((co) => ({
      collegeId: college.id,
      exam: co.exam,
      category: co.category,
      year: co.year,
      round: co.round,
      openingRank: co.openingRank,
      closingRank: co.closingRank,
      openingPercentile: co.openingPercentile,
      closingPercentile: co.closingPercentile,
      seats: co.seats,
    }));

    await prisma.cutOffRequirement.createMany({ data: cutoffData });

    // Create a verified review and a user for it
    const user = await prisma.user.create({
      data: {
        email: `${college.slug}.student1@example.com`,
        name: `${college.name} Alumni`,
        role: "student",
      },
    });

    await prisma.review.create({
      data: {
        userId: user.id,
        collegeId: college.id,
        rating: Math.floor(Math.random() * 2) + 4,
        title: "Good academics and placements",
        content:
          "Overall strong program, internships are plentiful and faculty are supportive. Campus life is active.",
        verified: true,
      },
    });
  }

  // Create a sample user who saves a few colleges
  const sampleUser = await prisma.user.create({
    data: {
      email: "student.user@example.com",
      name: "Sample Student",
      role: "student",
      savedColleges: {
        create: [
          { college: { connect: { slug: "bharati-institute-of-technology" } } },
          { college: { connect: { slug: "northern-college-of-science" } } },
        ],
      },
    },
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
