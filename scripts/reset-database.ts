import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

async function resetDatabase() {
  console.log("\n🔄 Resetting Database...\n");

  const { neon } = await import("@neondatabase/serverless");
  const sql = neon(process.env.DATABASE_URL!);

  try {
    // Drop all tables in the correct order (respecting foreign key constraints)
    console.log("🗑️  Dropping all tables...");

    await sql`DROP TABLE IF EXISTS payments CASCADE`;
    await sql`DROP TABLE IF EXISTS order_items CASCADE`;
    await sql`DROP TABLE IF EXISTS orders CASCADE`;
    await sql`DROP TABLE IF EXISTS items CASCADE`;
    await sql`DROP TABLE IF EXISTS product_variants CASCADE`;
    await sql`DROP TABLE IF EXISTS products CASCADE`;
    await sql`DROP TABLE IF EXISTS stone_specifications CASCADE`;
    await sql`DROP TABLE IF EXISTS base_variants CASCADE`;
    await sql`DROP TABLE IF EXISTS categories CASCADE`;
    await sql`DROP TABLE IF EXISTS stores CASCADE`;
    await sql`DROP TABLE IF EXISTS verification CASCADE`;
    await sql`DROP TABLE IF EXISTS account CASCADE`;
    await sql`DROP TABLE IF EXISTS session CASCADE`;
    await sql`DROP TABLE IF EXISTS "user" CASCADE`;
    await sql`DROP TABLE IF EXISTS users CASCADE`;

    console.log("✅ All tables dropped successfully!\n");
    console.log("📝 Now run: npx drizzle-kit push --force");
    console.log("🌱 Then run: npx tsx scripts/seed-database.ts");
  } catch (error) {
    console.error("❌ Error resetting database:", error);
    process.exit(1);
  }
}

resetDatabase();
