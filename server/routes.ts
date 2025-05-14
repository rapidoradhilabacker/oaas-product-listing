import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import path from "path";
import { insertBookmarkSchema, insertWorkshopSchema, insertProductSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all categories
  app.get("/api/categories", async (_req: Request, res: Response) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Get all workshops
  app.get("/api/workshops", async (_req: Request, res: Response) => {
    try {
      const workshops = await storage.getWorkshops();
      res.json(workshops);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch workshops" });
    }
  });

  // Get workshop by ID
  app.get("/api/workshops/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const workshop = await storage.getWorkshopById(Number(id));
      
      if (!workshop) {
        return res.status(404).json({ message: "Workshop not found" });
      }
      
      res.json(workshop);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch workshop" });
    }
  });

  // Get workshops by category
  app.get("/api/workshops/category/:categoryId", async (req: Request, res: Response) => {
    try {
      const { categoryId } = req.params;
      const workshops = await storage.getWorkshopsByCategory(Number(categoryId));
      res.json(workshops);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch workshops by category" });
    }
  });

  // Get workshops by availability
  app.get("/api/workshops/available/:available", async (req: Request, res: Response) => {
    try {
      const { available } = req.params;
      const hasAvailability = available === "true";
      const workshops = await storage.getWorkshopsByAvailability(hasAvailability);
      res.json(workshops);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch workshops by availability" });
    }
  });

  // Create a workshop (for demo purposes)
  app.post("/api/workshops", async (req: Request, res: Response) => {
    try {
      const workshopData = insertWorkshopSchema.parse(req.body);
      const workshop = await storage.createWorkshop(workshopData);
      res.status(201).json(workshop);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid workshop data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create workshop" });
    }
  });

  // Update workshop availability
  app.patch("/api/workshops/:id/availability", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { available_spots } = req.body;
      
      const updatedWorkshop = await storage.updateWorkshopAvailability(
        Number(id), 
        Number(available_spots)
      );
      
      if (!updatedWorkshop) {
        return res.status(404).json({ message: "Workshop not found" });
      }
      
      res.json(updatedWorkshop);
    } catch (error) {
      res.status(500).json({ message: "Failed to update workshop availability" });
    }
  });

  // Bookmark a workshop
  app.post("/api/bookmarks", async (req: Request, res: Response) => {
    try {
      const bookmarkData = insertBookmarkSchema.parse(req.body);
      const bookmark = await storage.createBookmark(bookmarkData);
      res.status(201).json(bookmark);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid bookmark data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to bookmark workshop" });
    }
  });

  // Remove a bookmark
  app.delete("/api/bookmarks/:userId/:workshopId", async (req: Request, res: Response) => {
    try {
      const { userId, workshopId } = req.params;
      const success = await storage.deleteBookmark(Number(userId), Number(workshopId));
      
      if (!success) {
        return res.status(404).json({ message: "Bookmark not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to remove bookmark" });
    }
  });

  // Check if a workshop is bookmarked by a user
  app.get("/api/bookmarks/:userId/:workshopId", async (req: Request, res: Response) => {
    try {
      const { userId, workshopId } = req.params;
      const isBookmarked = await storage.isWorkshopBookmarked(Number(userId), Number(workshopId));
      res.json({ isBookmarked });
    } catch (error) {
      res.status(500).json({ message: "Failed to check bookmark status" });
    }
  });

  // Get bookmarked workshops for a user
  app.get("/api/bookmarks/user/:userId", async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const workshops = await storage.getBookmarkedWorkshopsByUser(Number(userId));
      res.json(workshops);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bookmarked workshops" });
    }
  });

  // Product routes
  
  // Get all products
  app.get("/api/products", async (_req: Request, res: Response) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  // Get product by ID
  app.get("/api/products/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const product = await storage.getProductById(Number(id));
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Get product by code
  app.get("/api/products/code/:code", async (req: Request, res: Response) => {
    try {
      const { code } = req.params;
      const product = await storage.getProductByCode(code);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product by code" });
    }
  });

  // Create a product
  app.post("/api/products", async (req: Request, res: Response) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  // Update a product
  app.patch("/api/products/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const productData = req.body;
      
      const updatedProduct = await storage.updateProduct(Number(id), productData);
      
      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(updatedProduct);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  // Delete a product
  app.delete("/api/products/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteProduct(Number(id));
      
      if (!success) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });
  
  // Serve products page
  app.get("/products", (req: Request, res: Response) => {
    res.sendFile(path.resolve(process.cwd(), "client", "products.html"));
  });

  // Serve product data at root
  app.get("/", async (_req: Request, res: Response) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
