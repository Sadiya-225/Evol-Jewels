import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

async function updateCategoryImages() {
  console.log("\n🖼️  Updating Category Images...\n");

  const { db } = await import("../lib/db");
  const { categories } = await import("@/db/schema");
  const { eq } = await import("drizzle-orm");

  const categoryImages: Record<string, string> = {
    rings: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80",
    necklaces: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
    earrings: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
    bracelets: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&q=80",
    pendants: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&q=80",
  };

  try {
    for (const [slug, imageUrl] of Object.entries(categoryImages)) {
      await db
        .update(categories)
        .set({ image: imageUrl, updatedAt: new Date() })
        .where(eq(categories.slug, slug));
      console.log(`✅ Updated ${slug} image`);
    }

    console.log("\n✨ Category images updated successfully!");
  } catch (error) {
    console.error("❌ Error updating category images:", error);
    process.exit(1);
  }
}

updateCategoryImages();
