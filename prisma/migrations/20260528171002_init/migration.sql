-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" TEXT NOT NULL DEFAULT 'student'
);

-- CreateTable
CREATE TABLE "College" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'India',
    "locationLat" REAL,
    "locationLng" REAL,
    "establishedYear" INTEGER,
    "website" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "ratingAverage" REAL NOT NULL DEFAULT 0,
    "ratingCount" INTEGER NOT NULL DEFAULT 0,
    "feesCurrency" TEXT NOT NULL DEFAULT 'INR',
    "feesMin" INTEGER,
    "feesMax" INTEGER
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "collegeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "durationMonths" INTEGER NOT NULL,
    "eligibility" TEXT,
    "feesAnnual" INTEGER,
    "seats" INTEGER,
    CONSTRAINT "Course_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PlacementStat" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "year" INTEGER NOT NULL,
    "collegeId" TEXT NOT NULL,
    "avgPackage" REAL NOT NULL,
    "medianPackage" REAL,
    "highestPackage" REAL,
    "placedCount" INTEGER NOT NULL,
    "totalStudents" INTEGER NOT NULL,
    CONSTRAINT "PlacementStat_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "collegeId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "title" TEXT,
    "content" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Review_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CutOffRequirement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "collegeId" TEXT NOT NULL,
    "exam" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "round" INTEGER,
    "openingRank" INTEGER,
    "closingRank" INTEGER,
    "openingPercentile" REAL,
    "closingPercentile" REAL,
    "seats" INTEGER,
    "quota" TEXT,
    CONSTRAINT "CutOffRequirement_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SavedCollege" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "collegeId" TEXT NOT NULL,
    CONSTRAINT "SavedCollege_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SavedCollege_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "College_slug_key" ON "College"("slug");

-- CreateIndex
CREATE INDEX "College_name_idx" ON "College"("name");

-- CreateIndex
CREATE INDEX "College_city_state_idx" ON "College"("city", "state");

-- CreateIndex
CREATE INDEX "Course_name_idx" ON "Course"("name");

-- CreateIndex
CREATE INDEX "Course_degree_idx" ON "Course"("degree");

-- CreateIndex
CREATE INDEX "PlacementStat_year_idx" ON "PlacementStat"("year");

-- CreateIndex
CREATE INDEX "PlacementStat_collegeId_year_idx" ON "PlacementStat"("collegeId", "year");

-- CreateIndex
CREATE INDEX "Review_collegeId_idx" ON "Review"("collegeId");

-- CreateIndex
CREATE INDEX "Review_userId_idx" ON "Review"("userId");

-- CreateIndex
CREATE INDEX "CutOffRequirement_exam_category_year_idx" ON "CutOffRequirement"("exam", "category", "year");

-- CreateIndex
CREATE INDEX "CutOffRequirement_collegeId_exam_year_idx" ON "CutOffRequirement"("collegeId", "exam", "year");

-- CreateIndex
CREATE UNIQUE INDEX "SavedCollege_userId_collegeId_key" ON "SavedCollege"("userId", "collegeId");
