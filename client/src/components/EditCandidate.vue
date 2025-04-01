<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <h2>Edit Candidate</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form__group">
          <label for="name">Name</label>
          <input type="text" id="name" v-model="formData.name" required />
        </div>

        <div class="form__group">
          <label for="alias">Alias</label>
          <input type="text" id="alias" v-model="formData.alias" required />
        </div>

        <div class="form__group">
          <label for="catchPhrase">Catch Phrase</label>
          <textarea id="catchPhrase" v-model="formData.catchPhrase" required></textarea>
        </div>

        <div class="form__group">
          <label for="image">Image</label>
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

const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

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
  font-size: 1rem;
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
  padding: 1rem;
  width: 90%;
  max-width: 500px;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.form__group {
  margin-bottom: 0.5rem;
}

select {
  padding-inline: 0;
}

input,
textarea,
select {
  background-color: rgb(256, 256, 256);
  outline: none;
  border: none;
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

.form__container {
  width: 100%;
  max-width: 600px;
  padding: 1.5rem 0.5rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.form__group {
  display: flex;
  border: 2px solid rgb(17, 17, 17);
  border-radius: 0.25rem;
  font-size: 1rem;
}

.form__group > * {
  font-size: 0.75rem;
  font-weight: 500;
}

.form__group > label {
  background-color: rgb(17, 17, 17);
  color: var(--neutral);
  min-width: 6rem;
  padding-inline: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.form__group > input,
.form__group > select,
.form__group > textarea {
  padding-block: 0.35rem;
  padding-left: 0.5rem;
  width: 100%;
}

.submit__btn {
  background-color: rgb(37, 37, 238);
  color: var(--neutral);
  padding-block: 0.5rem;
  width: 100%;
  max-width: 600px;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.5s ease;
}

.submit__btn:hover {
  border-radius: 1rem 0 1rem 0;
}

.submit__btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  background-color: rgb(128, 128, 128);
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
  width: 100%;
  font: 'Poppins', sans-serif;
}

@media screen and (min-width: 700px) {
  h2 {
    font-size: 1.5rem;
  }

  .modal-content {
    padding: 2rem;
  }

  .form__group > * {
    font-size: 0.9rem;
  }

  .form__group > label {
    min-width: 7rem;
  }
}
</style>
