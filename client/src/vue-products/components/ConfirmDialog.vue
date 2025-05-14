<template>
  <div class="confirm-overlay" @click.self="$emit('cancel')">
    <div class="confirm-modal">
      <div class="confirm-content">
        <p>{{ message }}</p>
      </div>
      <div class="confirm-actions">
        <button @click="$emit('cancel')" class="btn btn-secondary">Cancel</button>
        <button @click="$emit('confirm')" class="btn btn-danger">Confirm</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConfirmDialog',
  props: {
    message: {
      type: String,
      required: true
    }
  },
  emits: ['confirm', 'cancel']
};
</script>

<style scoped>
.confirm-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 110;
}

.confirm-modal {
  width: 90%;
  max-width: 400px;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.confirm-content {
  padding: 20px;
  text-align: center;
}

.confirm-content p {
  margin: 0;
  color: #333;
  font-size: 1.1rem;
}

.confirm-actions {
  display: flex;
  justify-content: space-between;
  padding: 15px 20px;
  background-color: #f5f5f5;
  border-top: 1px solid #e0e0e0;
}

.btn {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  min-width: 100px;
  transition: background-color 0.2s;
}

.btn-secondary {
  background-color: #9E9E9E;
  color: white;
}

.btn-danger {
  background-color: #F44336;
  color: white;
}
</style>