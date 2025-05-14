import { 
  users, 
  type User, 
  type InsertUser, 
  workshops, 
  type Workshop, 
  type InsertWorkshop,
  categories,
  type Category,
  type InsertCategory,
  bookmarks,
  type Bookmark,
  type InsertBookmark,
  products,
  type Product,
  type InsertProduct
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Workshop operations
  getWorkshops(): Promise<Workshop[]>;
  getWorkshopById(id: number): Promise<Workshop | undefined>;
  createWorkshop(workshop: InsertWorkshop): Promise<Workshop>;
  updateWorkshopAvailability(id: number, availableSpots: number): Promise<Workshop | undefined>;
  getWorkshopsByCategory(categoryId: number): Promise<Workshop[]>;
  getWorkshopsByAvailability(hasAvailability: boolean): Promise<Workshop[]>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Bookmark operations
  getBookmarksByUser(userId: number): Promise<Bookmark[]>;
  getBookmarkedWorkshopsByUser(userId: number): Promise<Workshop[]>;
  createBookmark(bookmark: InsertBookmark): Promise<Bookmark>;
  deleteBookmark(userId: number, workshopId: number): Promise<boolean>;
  isWorkshopBookmarked(userId: number, workshopId: number): Promise<boolean>;
  
  // Product operations
  getProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  getProductByCode(code: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private workshops: Map<number, Workshop>;
  private categories: Map<number, Category>;
  private bookmarks: Map<number, Bookmark>;
  private products: Map<number, Product>;
  
  private currentUserId: number;
  private currentWorkshopId: number;
  private currentCategoryId: number;
  private currentBookmarkId: number;
  private currentProductId: number;

  constructor() {
    this.users = new Map();
    this.workshops = new Map();
    this.categories = new Map();
    this.bookmarks = new Map();
    this.products = new Map();
    
    this.currentUserId = 1;
    this.currentWorkshopId = 1;
    this.currentCategoryId = 1;
    this.currentBookmarkId = 1;
    this.currentProductId = 1;
    
    // Pre-populate categories
    this.initializeCategories();
  }

  private initializeCategories() {
    const defaultCategories = ["Professional Development", "Creative Arts", "Technology", "Wellness & Fitness", "Culinary"];
    
    defaultCategories.forEach(categoryName => {
      this.createCategory({ name: categoryName });
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Workshop operations
  async getWorkshops(): Promise<Workshop[]> {
    return Array.from(this.workshops.values());
  }
  
  async getWorkshopById(id: number): Promise<Workshop | undefined> {
    return this.workshops.get(id);
  }
  
  async createWorkshop(insertWorkshop: InsertWorkshop): Promise<Workshop> {
    const id = this.currentWorkshopId++;
    // Handle nulls properly for Workshop type
    const workshop: Workshop = { 
      ...insertWorkshop, 
      id,
      price: insertWorkshop.price ?? null,
      instructor: insertWorkshop.instructor ?? null,
      requirements: insertWorkshop.requirements ?? null,
      what_you_learn: (insertWorkshop.what_you_learn && Array.isArray(insertWorkshop.what_you_learn)) 
        ? insertWorkshop.what_you_learn as string[] 
        : null
    };
    this.workshops.set(id, workshop);
    return workshop;
  }
  
  async updateWorkshopAvailability(id: number, availableSpots: number): Promise<Workshop | undefined> {
    const workshop = this.workshops.get(id);
    if (!workshop) return undefined;
    
    const updatedWorkshop = { ...workshop, available_spots: availableSpots };
    this.workshops.set(id, updatedWorkshop);
    return updatedWorkshop;
  }
  
  async getWorkshopsByCategory(categoryId: number): Promise<Workshop[]> {
    return Array.from(this.workshops.values()).filter(
      workshop => workshop.category_id === categoryId
    );
  }
  
  async getWorkshopsByAvailability(hasAvailability: boolean): Promise<Workshop[]> {
    return Array.from(this.workshops.values()).filter(
      workshop => hasAvailability ? workshop.available_spots > 0 : workshop.available_spots === 0
    );
  }
  
  // Category operations
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }
  
  async getCategoryById(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }
  
  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.currentCategoryId++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }
  
  // Bookmark operations
  async getBookmarksByUser(userId: number): Promise<Bookmark[]> {
    return Array.from(this.bookmarks.values()).filter(
      bookmark => bookmark.user_id === userId
    );
  }
  
  async getBookmarkedWorkshopsByUser(userId: number): Promise<Workshop[]> {
    const userBookmarks = await this.getBookmarksByUser(userId);
    const bookmarkedWorkshopIds = userBookmarks.map(bookmark => bookmark.workshop_id);
    
    return Array.from(this.workshops.values()).filter(
      workshop => bookmarkedWorkshopIds.includes(workshop.id)
    );
  }
  
  async createBookmark(insertBookmark: InsertBookmark): Promise<Bookmark> {
    const id = this.currentBookmarkId++;
    const bookmark: Bookmark = { ...insertBookmark, id, created_at: new Date() };
    this.bookmarks.set(id, bookmark);
    return bookmark;
  }
  
  async deleteBookmark(userId: number, workshopId: number): Promise<boolean> {
    const bookmarkToDelete = Array.from(this.bookmarks.values()).find(
      bookmark => bookmark.user_id === userId && bookmark.workshop_id === workshopId
    );
    
    if (!bookmarkToDelete) return false;
    
    return this.bookmarks.delete(bookmarkToDelete.id);
  }
  
  async isWorkshopBookmarked(userId: number, workshopId: number): Promise<boolean> {
    return Array.from(this.bookmarks.values()).some(
      bookmark => bookmark.user_id === userId && bookmark.workshop_id === workshopId
    );
  }
  
  // Product operations
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }
  
  async getProductById(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }
  
  async getProductByCode(code: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(
      product => product.code === code
    );
  }
  
  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    // Ensure proper type handling
    const product: Product = { 
      id,
      name: insertProduct.name,
      code: insertProduct.code,
      short_description: insertProduct.short_description,
      long_description: insertProduct.long_description,
      image_url: insertProduct.image_url,
      price: insertProduct.price ?? null,
      created_at: new Date()
    };
    this.products.set(id, product);
    return product;
  }
  
  async updateProduct(id: number, productUpdate: Partial<InsertProduct>): Promise<Product | undefined> {
    const existingProduct = this.products.get(id);
    if (!existingProduct) return undefined;
    
    const updatedProduct: Product = { 
      ...existingProduct, 
      ...productUpdate 
    };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }
  
  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }
}

export const storage = new MemStorage();
