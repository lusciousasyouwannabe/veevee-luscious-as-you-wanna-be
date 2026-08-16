import citronellaEdited from "@/assets/product-citronella-edited.png";
import cremeBruleeBathbar from "@/assets/product-creme-brulee-bathbar.png";
import gentlemanBathbar from "@/assets/product-gentleman-bathbar.png";
import classicManBathbar from "@/assets/product-classic-man-bathbar.png";
import lovelyLotusBathsoak from "@/assets/product-lovely-lotus-bathsoak.png";
import frenchVanillaBathsoak from "@/assets/product-french-vanilla-bathsoak.png";
import cremeBruleeBathsoak from "@/assets/product-creme-brulee-bathsoak.jpg";
import beachBoysBathbar from "@/assets/product-beach-boys-bathbar.png";
import classicManBathsoak from "@/assets/product-classic-man-bathsoak.jpg";
import luxMyrtilleButter from "@/assets/product-lux-myrtille-butter.png";
import ohHoneyButter from "@/assets/product-oh-honey-butter.jpg";
import amberBathsoak from "@/assets/product-amber-bathsoak.jpg";
import luxMyrtilleBathsoak from "@/assets/product-luxury-myrtille-bathsoak.jpg";
import coolCitronellaButter from "@/assets/product-cool-citronella-butter.jpg";
import goodGirlBathbar from "@/assets/product-good-girl-bathbar.jpg";
import strawberryCreamBathbar from "@/assets/product-strawberry-cream-bathbar.jpg";
import mardiGrasBathbar from "@/assets/product-mardi-gras-bathbar.jpg";
import gentlemanButter from "@/assets/product-gentleman-butter.jpg";
import gentlemanBathsoak from "@/assets/product-gentleman-bathsoak.jpg";
import cremeBruleeScrub from "@/assets/product-creme-brulee-scrub.png";
import cremeBruleeScrub8oz from "@/assets/product-creme-brulee-scrub-8oz.jpg";
import cremeBruleeScrub4oz from "@/assets/product-creme-brulee-scrub-4oz.jpg";
import luxMyrtilleScrub from "@/assets/product-lux-myrtille-scrub.png";
import veryBerryScrub4oz from "@/assets/product-very-berry-scrub-4oz.jpg";
import veryBerryScrub8oz from "@/assets/product-very-berry-scrub-8oz.jpg";
import veryBerryBathsoak from "@/assets/product-very-berry-bathsoak.jpg";
import frenchVanillaScrub from "@/assets/product-french-vanilla-bodyscrub.jpg";
import goodGirlScrub from "@/assets/product-good-girl-scrub.jpg";
import beachBoysScrub from "@/assets/product-beach-boys-scrub.jpg";
import ohHoneyBathbar from "@/assets/product-oh-honey-bathbar.jpg";
import cremeBruleeButter from "@/assets/product-creme-brulee-butter.png";

/** Maps the `image_key` stored in the products table to the bundled asset. */
export const productImages: Record<string, string> = {
  "oh-honey-bathbar": ohHoneyBathbar,
  "citronella-edited": citronellaEdited,
  "creme-brulee-bathbar": cremeBruleeBathbar,
  "gentleman-bathbar": gentlemanBathbar,
  "classic-man-bathbar": classicManBathbar,
  "beach-boys-bathbar": beachBoysBathbar,
  "good-girl-bathbar": goodGirlBathbar,
  "strawberry-cream-bathbar": strawberryCreamBathbar,
  "mardi-gras-bathbar": mardiGrasBathbar,
  "lovely-lotus-bathsoak": lovelyLotusBathsoak,
  "french-vanilla-bathsoak": frenchVanillaBathsoak,
  "classic-man-bathsoak": classicManBathsoak,
  "creme-brulee-bathsoak": cremeBruleeBathsoak,
  "gentleman-bathsoak": gentlemanBathsoak,
  "very-berry-bathsoak": veryBerryBathsoak,
  "amber-bathsoak": amberBathsoak,
  "luxury-myrtille-bathsoak": luxMyrtilleBathsoak,
  "lux-myrtille-butter": luxMyrtilleButter,
  "cool-citronella-butter": coolCitronellaButter,
  "gentleman-butter": gentlemanButter,
  "oh-honey-butter": ohHoneyButter,
  "creme-brulee-butter": cremeBruleeButter,
  "creme-brulee-scrub": cremeBruleeScrub,
  "creme-brulee-scrub-4oz": cremeBruleeScrub4oz,
  "creme-brulee-scrub-8oz": cremeBruleeScrub8oz,
  "lux-myrtille-scrub": luxMyrtilleScrub,
  "very-berry-scrub-4oz": veryBerryScrub4oz,
  "very-berry-scrub-8oz": veryBerryScrub8oz,
  "french-vanilla-scrub": frenchVanillaScrub,
  "good-girl-scrub": goodGirlScrub,
  "beach-boys-scrub": beachBoysScrub,
};

export const resolveProductImage = (key: string | null | undefined) => {
  if (!key) return "/placeholder.svg";
  if (/^(https?:)?\/\//.test(key) || key.startsWith("/")) return key;
  return productImages[key] || "/placeholder.svg";
};

export const productImageKeys = Object.keys(productImages).sort();
