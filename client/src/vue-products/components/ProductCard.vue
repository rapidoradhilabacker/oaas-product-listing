<template>
  <div class="product-card">
    <div class="product-image">
      <img :src="product.image_url || 'https://via.placeholder.com/300x200'" :alt="product.name" />
    </div>
    <div class="product-content">
      <div class="product-header">
        <h3 class="product-title">{{ product.name }}</h3>
        <div class="product-code">Code: {{ product.code }}</div>
      </div>
      <div class="product-description">
        <p>{{ product.short_description }}</p>
      </div>
      <div class="product-actions">
        <button @click="$emit('edit', product)" class="btn btn-edit">Edit</button>
        <button @click="$emit('delete', product)" class="btn btn-delete">Delete</button>
        <button @click="showDetails = !showDetails" class="btn btn-details">
          {{ showDetails ? 'Hide Details' : 'Show Details' }}
        </button>
      </div>
      <div v-if="showDetails" class="product-details">
        <h4>Full Description</h4>
        <p>{{ product.long_description }}</p>
        <div v-if="product.price !== null" class="product-price">
          <strong>Price:</strong> ${{ (product.price / 100).toFixed(2) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'ProductCard',
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  setup() {
    const showDetails = ref(false);
    
    return {
      showDetails
    };
  }
};
</script>

<style scoped>
.product-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  background-color: white;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.product-image {
  height: 200px;
  overflow: hidden;
  background-color: #f5f5f5;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-content {
  padding: 15px;
}

.product-header {
  margin-bottom: 10px;
}

.product-title {
  margin: 0;
  font-size: 1.2rem;
  color: #333;
}

.product-code {
  font-size: 0.8rem;
  color: #666;
  margin-top: 5px;
}

.product-description {
  color: #555;
  font-size: 0.9rem;
  margin-bottom: 15px;
}

.product-actions {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

.btn {
  padding: 6px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: background-color 0.2s;
}

.btn-edit {
  background-color: #2196F3;
  color: white;
}

.btn-delete {
  background-color: #F44336;
  color: white;
}

.btn-details {
  background-color: #9E9E9E;
  color: white;
  margin-left: auto;
}

.product-details {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #e0e0e0;
}

.product-details h4 {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 1rem;
  color: #333;
}

.product-price {
  margin-top: 10px;
  color: #4CAF50;
}
</style>