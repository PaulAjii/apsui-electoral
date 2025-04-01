<template>
  <SectionLayout customClass="login__section" sectionWrapper="form__wrapper">
    <header>
      <h2>Reset Password</h2>
      <p class="subtitle">This is a required procedure for verification</p>
    </header>

    <form @submit.prevent="handleSubmit">
      <div class="form__container">
        <div class="form__group">
          <label for="password">New Password</label>
          <input type="password" id="password" v-model="newPassword" required />
        </div>
      </div>

      <button type="submit" :disabled="isLoading" class="submit__btn">
        {{ isLoading ? 'Resetting Password...' : 'Reset Password' }}
      </button>
    </form>
  </SectionLayout>
</template>

<script setup>
import SectionLayout from '../layout/SectionLayout.vue';
import { ref } from 'vue';
import { resetPassword } from '../services/apiServices.js';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';
import { useVotersStore } from '../store/voters.js';

const newPassword = ref('');

const toast = useToast();
const router = useRouter();
const voterStore = useVotersStore();

const isLoading = ref(false);
const error = ref(null);

const handleSubmit = async () => {
  try {
    isLoading.value = true;
    const voter = voterStore.getVoter;

    const response = await resetPassword({
      studentId: voter.studentId,
      newPassword: newPassword.value
    });

    if (response.status === 'success') {
      toast.success(response.message);
      router.push('/voters/profile');
    }
  } catch (err) {
    error.value = err.message;
    toast.error(err.response.data.message || err.message);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style lang="css" scoped>
header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.05rem;
  margin-bottom: 1.25rem;
}

header > h2 {
  font-size: 1.125rem;
  font-weight: 700;
  letter-spacing: 2px;
}

header > .subtitle {
  font-size: 0.875rem;
  font-weight: 500;
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
  gap: 0.5rem;
  border: 2px solid rgb(17, 17, 17);
  border-radius: 0.25rem;
  font-size: 1rem;
}

.form__group > * {
  font-size: 0.95rem;
  font-weight: 500;
  letter-spacing: 1px;
}

.form__group > label {
  background-color: rgb(17, 17, 17);
  color: var(--neutral);
  min-width: 9rem;
  padding-inline: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.form__group > input {
  padding-block: 0.35rem;
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

@media screen and (min-width: 700px) {
  header {
    width: 100%;
    justify-content: center;
    align-items: center;
    margin-bottom: 3rem;
  }

  header > h2 {
    font-size: 1.5rem;
  }

  header > .subtitle {
    font-size: 1rem;
  }

  form {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }

  .form__container {
    gap: 1.3rem;
  }

  .form__group > * {
    font-size: 1.05rem;
  }

  .form__group > label {
    min-width: 10rem;
  }

  .submit__btn {
    padding-block: 0.75rem;
    font-size: 1.1rem;
  }
}
</style>
