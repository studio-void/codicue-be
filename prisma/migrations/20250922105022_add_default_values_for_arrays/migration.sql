-- AlterTable
ALTER TABLE "public"."Item" ALTER COLUMN "recommendedBodyType" SET DEFAULT ARRAY[]::"public"."BodyType"[],
ALTER COLUMN "tags" SET DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "public"."Stylist" ALTER COLUMN "specialtyStyles" SET DEFAULT ARRAY[]::"public"."Style"[],
ALTER COLUMN "career" SET DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "preferredStyle" SET DEFAULT ARRAY[]::"public"."Style"[];
