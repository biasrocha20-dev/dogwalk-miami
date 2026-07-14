export const MIAMI_NEIGHBORHOODS = [
  "Brickell",
  "Wynwood",
  "South Beach",
  "Coral Gables",
  "Downtown Miami",
  "Coconut Grove",
  "Little Havana",
  "Doral",
] as const;

export type MiamiNeighborhood = (typeof MIAMI_NEIGHBORHOODS)[number];
