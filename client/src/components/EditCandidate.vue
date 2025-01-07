<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <h2>Edit Candidate</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="name">Name</label>
          <input type="text" id="name" v-model="formData.name" required />
        </div>

        <div class="form-group">
          <label for="alias">Alias</label>
          <input type="text" id="alias" v-model="formData.alias" required />
        </div>

        <div class="form-group">
          <label for="catchPhrase">Catch Phrase</label>
          <textarea id="catchPhrase" v-model="formData.catchPhrase" required></textarea>
        </div>

        <div class="form-group">
          <label for="image">Candidate Image</label>
          <div class="image__upload">
            <div class="image__preview" v-if="imagePreview || formData.imageURL">
              <img :src="imagePreview || formData.imageURL" alt="Preview" />
            </div>
            <input
              type="file"
              id="image"
              @change="handleImageChange"
              accept="image/jpeg, image/jpg"
            />
          </div>
          <small v-if="imageError" class="error">{{ imageError }}</small>
        </div>

        <div class="form-actions">
          <button type="submit" class="submit__btn">Update</button>
          <button type="button" class="cancel__btn" @click="$emit('close')">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  candidate: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close', 'submit']);

const formData = ref({ ...props.candidate });
const imagePreview = ref(null);
const imageError = ref('');
// const isLoading = ref(false)

const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  //   if (!file.type.includes('image/')) {
  //     imageError.value = 'Please select an image file';
  //     return;
  //   }

  if (file.size > 2 * 1024 * 1024) {
    imageError.value = 'Image must be less than 2MB';
    return;
  }

  imageError.value = '';
  const reader = new FileReader();
  reader.onload = (e) => {
    imagePreview.value = e.target.result;
    formData.value.imageURL = e.target.result;
  };
  reader.readAsDataURL(file);
};

const handleSubmit = () => {
  emit('submit', formData.value);
};
</script>

<style scoped>
h2 {
  margin-bottom: 1rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.form-group {
  margin-bottom: 0.5rem;
}

label {
  display: block;
  font-weight: bold;
}

input,
textarea,
select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  background-color: rgb(256, 256, 256);
  color: rgb(58, 58, 58);
  outline: none;
  font-weight: 500;
  font-size: 1rem;
}

textarea {
  resize: none;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

button {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  border: none;
}

.submit__btn {
  background: #4caf50;
  color: white;
}

.cancel__btn {
  background: #f44336;
  color: white;
}

.image__upload {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.image__preview {
  width: 200px;
  height: 200px;
  overflow: hidden;
  border-radius: 50%;
  display: grid;
  place-items: center;
  border: 1px solid rgb(209, 209, 209);
  align-self: center;
}

.image__preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.error {
  color: red;
  font-size: 0.875rem;
}

input[type='file'] {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>
