export interface Beer {
  id: string;
  name: string;
  style: string;
  abv: string;
  color: string;
  description: string;
  tastingNotes: string;
  foodPairing: string;
  image: string;
}

export const beers: Beer[] = [
  {
    id: "bourbon-canvas",
    name: "Bourbon Canvas",
    style: "Bourbon Barrel-Aged Strong Ale",
    abv: "9.2%",
    color: "#b5651d",
    description:
      "Aged in hand-selected bourbon barrels for six months, this strong ale develops layers of vanilla, oak, and caramel complexity. Rich and contemplative — a beer to be savoured slowly.",
    tastingNotes:
      "Vanilla, toasted oak, dark caramel, dried fruit, gentle warmth of bourbon",
    foodPairing:
      "Aged cheddar, dark chocolate, smoked meats, pecan pie",
    image: "/images/bourbon-canvas.jpg",
  },
  {
    id: "moonlight-canvas",
    name: "Moonlight Canvas",
    style: "Belgian-Style Witbier",
    abv: "4.5%",
    color: "#c0c0c0",
    description:
      "Light, crisp, and endlessly sessionable. Brewed with coriander and orange peel in the Belgian tradition, this witbier is our most approachable canvas — perfect for long evenings and good conversation.",
    tastingNotes:
      "Citrus zest, coriander, soft wheat, light floral notes, clean finish",
    foodPairing:
      "Fresh seafood, garden salads, goat cheese, light pasta dishes",
    image: "/images/moonlight-canvas.jpg",
  },
  {
    id: "crimson-canvas",
    name: "Crimson Canvas",
    style: "Irish Red Ale",
    abv: "5.4%",
    color: "#722f37",
    description:
      "A deep ruby-red ale rooted in Irish brewing tradition. Malty, balanced, and beautifully smooth, with just enough hop character to keep things interesting. Our tribute to the land we brew on.",
    tastingNotes:
      "Toffee, biscuit malt, subtle roast, earthy hops, smooth caramel finish",
    foodPairing:
      "Irish stew, roast lamb, brown bread, mature Gouda",
    image: "/images/crimson-canvas.jpg",
  },
];
