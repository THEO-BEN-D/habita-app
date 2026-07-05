// Historical note: this file used to hold the V1 mock data (3 demo properties,
// hardcoded gestion tasks, a `buildConformiteCategories` generator). Since the
// Supabase backend was wired up, all of that data now lives in Postgres and is
// loaded through `store/backend.ts` (`fetchAll`) instead. Kept as an empty
// module so any stray import fails loudly rather than silently reintroducing
// fake data.
export {};
