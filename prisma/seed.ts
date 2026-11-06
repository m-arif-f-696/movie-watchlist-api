import { db } from "../src/config/db";

async function run(sql: string) {
    try{
        await db.$executeRawUnsafe(sql);
        console.log('Seeder Successfully');
    }catch(error){
        console.error('Seeder Failed:', error);
    }
}
import { movieSeed } from "./seed/movieSeed";
import { reviewSeed } from "./seed/reviewSeed";
import { userSeed } from "./seed/userSeed";
import { watchlistSeed } from "./seed/watchlistSeed";

async function main() {
  await run(movieSeed)
  await run(userSeed)
  await run(reviewSeed)
  await run(watchlistSeed)
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await db.$disconnect());