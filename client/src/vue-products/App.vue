<template>
  <div class="vue-products-app">
    <header class="app-header">
      <h1>Product Management</h1>
    </header>
    
    <div class="container">
      <div class="actions">
        <button @click="showAddProductModal = true" class="btn btn-primary">Add New Product</button>
      </div>
      
      <div v-if="loading" class="loading">
        <p>Loading products...</p>
      </div>
      
      <div v-else-if="error" class="error">
        <p>{{ error }}</p>
      </div>
      
      <div v-else-if="products.length === 0" class="no-products">
        <p>No products found. Add your first product!</p>
      </div>
      
      <div v-else class="products-grid">
        <ProductCard 
          v-for="product in products" 
          :key="product.id" 
          :product="product"
          @edit="editProduct"
          @delete="confirmDelete"
        />
      </div>
    </div>
    
    <ProductForm 
      v-if="showAddProductModal" 
      :product="currentProduct"
      @close="showAddProductModal = false"
      @save="saveProduct"
    />
    
    <ConfirmDialog
      v-if="showDeleteConfirm"
      :message="`Are you sure you want to delete '${productToDelete?.name}'?`"
      @confirm="deleteProduct"
      @cancel="showDeleteConfirm = false"
    />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import ProductCard from './components/ProductCard.vue';
import ProductForm from './components/ProductForm.vue';
import ConfirmDialog from './components/ConfirmDialog.vue';
import { initializeSampleProducts } from './initSampleProducts';

export default {
  name: 'ProductsApp',
  components: {
    ProductCard,
    ProductForm,
    ConfirmDialog
  },
  setup() {
    const products = ref([]);
    const loading = ref(true);
    const error = ref(null);
    const showAddProductModal = ref(false);
    const showDeleteConfirm = ref(false);
    const currentProduct = ref(null);
    const productToDelete = ref(null);
    
    // Fetch all products
    const fetchProducts = async () => {
      loading.value = true;
      error.value = null;
      
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        products.value = await response.json();
      } catch (err) {
        error.value = err.message;
        console.error('Error fetching products:', err);
      } finally {
        loading.value = false;
      }
    };
    
    // Edit product
    const editProduct = (product) => {
      currentProduct.value = { ...product };
      showAddProductModal.value = true;
    };
    
    // Confirm delete
    const confirmDelete = (product) => {
      productToDelete.value = product;
      showDeleteConfirm.value = true;
    };
    
    // Delete product
    const deleteProduct = async () => {
      if (!productToDelete.value) return;
      
      try {
        const response = await fetch(`/api/products/${productToDelete.value.id}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete product');
        }
        
        // Remove the product from the list
        products.value = products.value.filter(p => p.id !== productToDelete.value.id);
        showDeleteConfirm.value = false;
        productToDelete.value = null;
      } catch (err) {
        error.value = err.message;
        console.error('Error deleting product:', err);
      }
    };
    
    // Save product (create or update)
    const saveProduct = async (product) => {
      try {
        const isNewProduct = !product.id;
        const url = isNewProduct ? '/api/products' : `/api/products/${product.id}`;
        const method = isNewProduct ? 'POST' : 'PATCH';
        
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(product)
        });
        
        if (!response.ok) {
          throw new Error(isNewProduct ? 'Failed to create product' : 'Failed to update product');
        }
        
        const savedProduct = await response.json();
        
        if (isNewProduct) {
          products.value.push(savedProduct);
        } else {
          const index = products.value.findIndex(p => p.id === savedProduct.id);
          if (index !== -1) {
            products.value[index] = savedProduct;
          }
        }
        
        showAddProductModal.value = false;
        currentProduct.value = null;
      } catch (err) {
        error.value = err.message;
        console.error('Error saving product:', err);
      }
    };
    
    // Load products on component mount
    onMounted(async () => {
      // Initialize sample data first
      await initializeSampleProducts();
      // Then fetch all products
      fetchProducts();
    });
    
    return {
      products,
      loading,
      error,
      showAddProductModal,
      showDeleteConfirm,
      currentProduct,
      productToDelete,
      editProduct,
      confirmDelete,
      deleteProduct,
      saveProduct
    };
  }
};
</script>

<style scoped>
.vue-products-app {
  font-family: Arial, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.app-header {
  margin-bottom: 30px;
  text-align: center;
}

.container {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.actions {
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-end;
}

.btn {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.btn-primary {
  background-color: #4CAF50;
  color: white;
}

.loading, .error, .no-products {
  text-align: center;
  padding: 30px;
  color: #666;
}

.error {
  color: #e53935;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>