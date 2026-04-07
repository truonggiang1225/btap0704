import {
  getBestSellingProducts,
  getBeverages,
  getFeaturedProducts,
  getGroceryProducts,
  getProductById,
} from './data';

const IMAGES = {
  apple: require('../../assets/nectar/apple.png'),
  appleHero: require('../../assets/nectar/apple-hero.png'),
  appleGrapeJuice: require('../../assets/nectar/apple-grape-juice.png'),
  banana: require('../../assets/nectar/banana.png'),
  bannerDecor: require('../../assets/nectar/banner-decor.png'),
  beef: require('../../assets/nectar/beef.png'),
  categoryBakery: require('../../assets/nectar/category-bakery.png'),
  categoryBeverages: require('../../assets/nectar/category-beverages.png'),
  categoryDairy: require('../../assets/nectar/category-dairy.png'),
  categoryFruits: require('../../assets/nectar/category-fruits.png'),
  categoryMeat: require('../../assets/nectar/category-meat.png'),
  categoryOil: require('../../assets/nectar/category-oil.png'),
  chicken: require('../../assets/nectar/chicken.png'),
  cocaCola: require('../../assets/nectar/coca-cola.png'),
  dietCoke: require('../../assets/nectar/diet-coke.png'),
  ginger: require('../../assets/nectar/ginger.png'),
  orangeJuice: require('../../assets/nectar/orange-juice.png'),
  pepsi: require('../../assets/nectar/pepsi.png'),
  pulses: require('../../assets/nectar/pulses.png'),
  redPepper: require('../../assets/nectar/red-pepper.png'),
  rice: require('../../assets/nectar/rice.png'),
  sprite: require('../../assets/nectar/sprite.png'),
  vegetablesHero: require('../../assets/nectar/vegetables-hero.png'),
};

export const productImageSources = IMAGES;

export const nectarTheme = {
  background: '#FFFFFF',
  surface: '#FFFFFF',
  text: '#181725',
  mutedText: '#7C7C7C',
  border: '#E2E2E2',
  tabBorder: '#F2F3F2',
  input: '#F2F3F2',
  green: '#53B175',
  greenSoft: '#EAF6EE',
  banner: '#EEF8F2',
};

export const bannerContent = {
  title: 'Fresh Vegetables',
  subtitle: 'Get Up To 40% OFF',
  heroImageKey: 'vegetablesHero',
  decorImageKey: 'bannerDecor',
};

export const featuredProducts = getFeaturedProducts();
export const bestSellingProducts = getBestSellingProducts();

export const groceryHighlights = [
  {
    id: 'pulses',
    name: 'Pulses',
    imageKey: 'pulses',
    backgroundColor: '#F8E7D2',
  },
  {
    id: 'rice',
    name: 'Rice',
    imageKey: 'rice',
    backgroundColor: '#E5F2E9',
  },
];

export const groceryProducts = getGroceryProducts();

export const categories = [
  {
    id: 'fresh-fruits',
    name: 'Fresh Fruits\n& Vegetables',
    imageKey: 'categoryFruits',
    backgroundColor: '#EEF8F2',
    borderColor: '#A4D8B6',
  },
  {
    id: 'cooking-oil',
    name: 'Cooking Oil\n& Ghee',
    imageKey: 'categoryOil',
    backgroundColor: '#FFF8F1',
    borderColor: '#F5C18F',
  },
  {
    id: 'meat-fish',
    name: 'Meat & Fish',
    imageKey: 'categoryMeat',
    backgroundColor: '#FFF2F0',
    borderColor: '#F6B0A7',
  },
  {
    id: 'bakery-snacks',
    name: 'Bakery & Snacks',
    imageKey: 'categoryBakery',
    backgroundColor: '#F7EEF9',
    borderColor: '#D3B0E0',
  },
  {
    id: 'dairy-eggs',
    name: 'Dairy & Eggs',
    imageKey: 'categoryDairy',
    backgroundColor: '#FFF9E6',
    borderColor: '#F8DF8B',
  },
  {
    id: 'beverages',
    name: 'Beverages',
    imageKey: 'categoryBeverages',
    backgroundColor: '#EDF7FD',
    borderColor: '#B7DFF5',
    routeName: 'Beverages',
  },
];

export const beverages = getBeverages();

export function getImageSource(imageKey) {
  return productImageSources[imageKey] ?? productImageSources.apple;
}

export function getProductDetail(productId = 'apple') {
  const product = getProductById(productId);

  return {
    id: product.id,
    name: product.cartName ?? product.name,
    cartName: product.cartName ?? product.name,
    subtitle: product.subtitle,
    price: product.price,
    imageKey: product.heroImageKey ?? product.imageKey,
    thumbnailKey: product.thumbnailKey ?? product.imageKey,
    description: product.description,
    nutrition: product.nutrition,
    reviewRating: product.reviewRating,
  };
}

export function buildCartItem(productId) {
  const product = getProductById(productId);

  return {
    id: product.id,
    name: product.cartName ?? product.name,
    subtitle: product.subtitle,
    price: product.price,
    imageKey: product.thumbnailKey ?? product.imageKey,
  };
}
