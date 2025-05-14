/**
 * This file contains functions to initialize sample product data
 */

// Sample product data
const sampleProducts = [
  {
    name: "Professional DSLR Camera",
    code: "CAM-001",
    short_description: "High-quality professional DSLR camera for photography enthusiasts",
    long_description: "This premium DSLR camera features a 24.1 megapixel CMOS sensor, 4K video recording capabilities, and advanced autofocus system. Perfect for professional photographers and serious enthusiasts looking to capture stunning photos and videos in any lighting condition.",
    image_url: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    price: 129900 // Price in cents (1299.00)
  },
  {
    name: "Wireless Bluetooth Headphones",
    code: "AUDIO-002",
    short_description: "Noise-cancelling wireless headphones with premium sound quality",
    long_description: "Experience immersive audio with these premium wireless headphones featuring active noise cancellation, 30-hour battery life, and comfortable over-ear design. Perfect for music lovers, travelers, and professionals working in noisy environments.",
    image_url: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    price: 24900 // Price in cents (249.00)
  },
  {
    name: "Smart Fitness Tracker",
    code: "WEAR-003",
    short_description: "Advanced fitness and health tracking wearable device",
    long_description: "Monitor your health and fitness goals with this advanced tracker featuring heart rate monitoring, sleep analysis, GPS tracking, and water resistance up to 50 meters. Syncs with your smartphone to provide comprehensive health insights and workout recommendations.",
    image_url: "https://images.unsplash.com/photo-1575311373937-040b8e3fd6ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    price: 12900 // Price in cents (129.00)
  }
];

/**
 * Initialize the database with sample products
 */
export const initializeSampleProducts = async () => {
  try {
    // Check if products already exist
    const response = await fetch('/api/products');
    const existingProducts = await response.json();
    
    if (existingProducts.length === 0) {
      // No products exist, add sample products
      for (const product of sampleProducts) {
        await fetch('/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(product)
        });
      }
      console.log('Sample products initialized successfully');
      return true;
    } else {
      console.log('Products already exist, skipping initialization');
      return false;
    }
  } catch (error) {
    console.error('Error initializing sample products:', error);
    return false;
  }
};

export default sampleProducts;