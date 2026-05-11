const nearbyAreas = {
  newark: ["Newark, NJ", "Harrison, NJ", "East Orange, NJ", "Bloomfield, NJ", "Kearny, NJ", "Jersey City, NJ"],
  "jersey city": ["Jersey City, NJ", "Hoboken, NJ", "Union City, NJ", "Bayonne, NJ", "Newark, NJ", "Weehawken, NJ"],
  hoboken: ["Hoboken, NJ", "Jersey City, NJ", "Weehawken, NJ", "Union City, NJ", "Secaucus, NJ", "Newark, NJ"],
  montclair: ["Montclair, NJ", "Bloomfield, NJ", "Glen Ridge, NJ", "Verona, NJ", "West Orange, NJ", "Nutley, NJ"],
  bloomfield: ["Bloomfield, NJ", "Montclair, NJ", "Nutley, NJ", "Belleville, NJ", "Glen Ridge, NJ", "Newark, NJ"],
  elizabeth: ["Elizabeth, NJ", "Union, NJ", "Linden, NJ", "Roselle, NJ", "Newark, NJ", "Rahway, NJ"],
  paterson: ["Paterson, NJ", "Clifton, NJ", "Passaic, NJ", "Totowa, NJ", "Wayne, NJ", "Hawthorne, NJ"],
  edison: ["Edison, NJ", "Metuchen, NJ", "Piscataway, NJ", "Woodbridge, NJ", "New Brunswick, NJ", "Highland Park, NJ"],
  "new brunswick": ["New Brunswick, NJ", "Highland Park, NJ", "Edison, NJ", "Piscataway, NJ", "North Brunswick, NJ", "Somerset, NJ"],
  trenton: ["Trenton, NJ", "Hamilton, NJ", "Ewing, NJ", "Lawrence Township, NJ", "Bordentown, NJ", "Morrisville, PA"],
  morristown: ["Morristown, NJ", "Morris Plains, NJ", "Parsippany, NJ", "Madison, NJ", "Denville, NJ", "Chatham, NJ"],
  hackensack: ["Hackensack, NJ", "Teaneck, NJ", "Bogota, NJ", "Maywood, NJ", "Lodi, NJ", "Paramus, NJ"],
  philadelphia: ["Philadelphia, PA", "Camden, NJ", "Collingswood, NJ", "Cherry Hill, NJ", "Upper Darby, PA", "Bala Cynwyd, PA"],
  "new york": ["New York, NY", "Jersey City, NJ", "Hoboken, NJ", "Union City, NJ", "Brooklyn, NY", "Queens, NY"],
  "staten island": ["Staten Island, NY", "Bayonne, NJ", "Elizabeth, NJ", "Jersey City, NJ", "Linden, NJ", "Brooklyn, NY"],
};

const listingTemplates = [
  { name: "Starter Condo Near Transit", type: "Condo", beds: 1, baths: 1, priceFactor: 0.72, overview: "Lower-maintenance option near commuter routes with a more approachable monthly payment." },
  { name: "Updated Townhome With Parking", type: "Townhome", beds: 2, baths: 1.5, priceFactor: 0.88, overview: "Balanced starter home with practical space and moderate estimated carrying costs." },
  { name: "Move-In Ready Duplex Alternative", type: "Townhome", beds: 3, baths: 2, priceFactor: 1.02, overview: "More room for growth while staying close to the user's preferred area." },
  { name: "Single Family Starter Home", type: "Single Family", beds: 3, baths: 2, priceFactor: 1.16, overview: "A detached-home option that may work for stronger income or larger down-payment profiles." },
  { name: "Renovated Neighborhood Home", type: "Single Family", beds: 4, baths: 2.5, priceFactor: 1.34, overview: "Higher-price option with more space, best suited for users with extra payment room." },
  { name: "Budget-Friendly Condo", type: "Condo", beds: 1, baths: 1, priceFactor: 0.62, overview: "A conservative purchase option designed to test whether a safer monthly payment is possible." },
];

export function createListingsForLocation(location = "Newark, NJ", targetHomePrice = 335000) {
  const normalized = location.toLowerCase();
  const key = Object.keys(nearbyAreas).find((area) => normalized.includes(area));
  const areas = key ? nearbyAreas[key] : buildFallbackAreas(location);
  const basePrice = Math.max(Number(targetHomePrice) || 335000, 150000);

  return listingTemplates.map((template, index) => ({
    id: `${slug(areas[index % areas.length])}-${index + 1}`,
    name: template.name,
    location: areas[index % areas.length],
    price: Math.round((basePrice * template.priceFactor) / 5000) * 5000,
    type: template.type,
    beds: template.beds,
    baths: template.baths,
    overview: template.overview,
    image: getListingImage(location, template.type),
  }));
}

function getListingImage(location, type) {
  const normalized = String(location || "").toLowerCase();
  const typeKey = type === "Single Family" ? "single" : type.toLowerCase();
  const region = normalized.includes("philadelphia") || normalized.includes(", pa")
    ? "philly"
    : normalized.includes("miami") || normalized.includes("fl")
      ? "miami"
      : normalized.includes("newark") || normalized.includes("jersey") || normalized.includes("montclair") || normalized.includes("nj")
        ? "nj"
        : "fallback";
  return `/houses/${region}-${typeKey}.png`;
}

function buildFallbackAreas(location) {
  const clean = location?.trim() || "Selected Area";
  const state = clean.includes(",") ? clean.split(",").at(-1).trim() : "Nearby";
  const city = clean.split(",")[0].trim() || "Selected Area";
  return [clean, `North ${city}, ${state}`, `South ${city}, ${state}`, `${city} Heights, ${state}`, `${city} Center, ${state}`, `Near ${city}, ${state}`];
}

function slug(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
