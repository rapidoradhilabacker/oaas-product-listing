<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h2>{{ isEditing ? 'Edit Product' : 'Add New Product' }}</h2>
        <button class="close-button" @click="$emit('close')">&times;</button>
      </div>
      
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="name">Product Name *</label>
          <input 
            id="name" 
            v-model="form.name" 
            type="text" 
            required
            placeholder="Enter product name"
          />
          <div v-if="errors.name" class="error-message">{{ errors.name }}</div>
        </div>
        
        <div class="form-group">
          <label for="code">Product Code *</label>
          <input 
            id="code" 
            v-model="form.code" 
            type="text" 
            required
            placeholder="Enter product code"
          />
          <div v-if="errors.code" class="error-message">{{ errors.code }}</div>
        </div>
        
        <div class="form-group">
          <label for="image_url">Image URL *</label>
          <input 
            id="image_url" 
            v-model="form.image_url" 
            type="url" 
            required
            placeholder="https://example.com/image.jpg"
          />
          <div v-if="errors.image_url" class="error-message">{{ errors.image_url }}</div>
        </div>
        
        <div class="form-group">
          <label for="short_description">Short Description *</label>
          <textarea 
            id="short_description" 
            v-model="form.short_description" 
            required
            placeholder="Enter a brief description"
            rows="2"
          ></textarea>
          <div v-if="errors.short_description" class="error-message">{{ errors.short_description }}</div>
        </div>
        
        <div class="form-group">
          <label for="long_description">Long Description *</label>
          <textarea 
            id="long_description" 
            v-model="form.long_description" 
            required
            placeholder="Enter detailed product description"
            rows="4"
          ></textarea>
          <div v-if="errors.long_description" class="error-message">{{ errors.long_description }}</div>
        </div>
        
        <div class="form-group">
          <label for="price">Price (in dollars)</label>
          <input 
            id="price" 
            v-model.number="displayPrice" 
            type="number" 
            min="0" 
            step="0.01"
            placeholder="Enter price in dollars (optional)"
          />
          <div class="helper-text">Price will be stored in cents</div>
        </div>
        
        <div class="form-actions">
          <button type="button" class="btn btn-secondary" @click="$emit('close')">Cancel</button>
          <button type="submit" class="btn btn-primary">{{ isEditing ? 'Update' : 'Save' }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed, reactive, watch } from 'vue';

export default {
  name: 'ProductForm',
  props: {
    product: {
      type: Object,
      default: null
    }
  },
  emits: ['close', 'save'],
  setup(props, { emit }) {
    // Determine if we're editing or creating
    const isEditing = computed(() => !!props.product);
    
    // Initialize form data
    const form = reactive({
      name: '',
      code: '',
      short_description: '',
      long_description: '',
      image_url: '',
      price: null
    });
    
    // Display price in dollars and cents for UI
    const displayPrice = ref(null);
    
    // Set up watchers for price conversion
    watch(displayPrice, (newVal) => {
      // Convert from dollars to cents for storage
      form.price = newVal !== null ? Math.round(newVal * 100) : null;
    });
    
    // Populate form if editing
    if (props.product) {
      Object.keys(form).forEach(key => {
        if (props.product[key] !== undefined) {
          if (key === 'price') {
            // Convert stored cents to display dollars
            displayPrice.value = props.product.price !== null ? 
              parseFloat((props.product.price / 100).toFixed(2)) : null;
            form.price = props.product.price;
          } else {
            form[key] = props.product[key];
          }
        }
      });
      
      // If product has an ID, store it for update operations
      if (props.product.id) {
        form.id = props.product.id;
      }
    }
    
    // Form validation
    const errors = reactive({});
    
    const validateForm = () => {
      errors.name = !form.name ? 'Product name is required' : '';
      errors.code = !form.code ? 'Product code is required' : '';
      errors.short_description = !form.short_description ? 'Short description is required' : '';
      errors.long_description = !form.long_description ? 'Long description is required' : '';
      errors.image_url = !form.image_url ? 'Image URL is required' : '';
      
      // Check if there are any errors
      return !Object.values(errors).some(error => error);
    };
    
    // Submit form
    const submitForm = () => {
      if (validateForm()) {
        emit('save', { ...form });
      }
    };
    
    return {
      form,
      errors,
      isEditing,
      submitForm,
      displayPrice
    };
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.modal-content {
  width: 90%;
  max-width: 600px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.modal-header {
  padding: 15px 20px;
  background-color: #f5f5f5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #333;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
}

form {
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
}

input, textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

input:focus, textarea:focus {
  outline: none;
  border-color: #2196F3;
}

.error-message {
  color: #f44336;
  font-size: 0.85rem;
  margin-top: 5px;
}

.helper-text {
  color: #757575;
  font-size: 0.85rem;
  margin-top: 5px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.btn {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s;
}

.btn-primary {
  background-color: #4CAF50;
  color: white;
}

.btn-secondary {
  background-color: #9E9E9E;
  color: white;
}
</style>