<template>
  <SectionLayout customClass="wrapper" sectionWrapper="profile__wrapper">
    <header class="profile__header">
      <h2>Voter's Details</h2>

      <button type="button" @click="handleEdit">
        {{ isEditing ? 'Cancel' : 'Edit Profile' }}
      </button>
    </header>

    <form>
      <div class="profile__details">
        <div class="detail">
          <label for="name">Name</label>
          <input type="text" id="name" v-model="formData.name" :readonly="!isEditing" />
        </div>

        <div class="detail">
          <label for="matric-no">Matric No.</label>
          <input type="text" id="matric-no" :value="voterStore.voter.studentId" readonly />
        </div>

        <div class="detail">
          <label for="level">Level</label>
          <input type="text" id="level" v-model="formData.level" :readonly="!isEditing" />
        </div>

        <div class="detail">
          <label for="set">Set</label>
          <input type="text" id="set" value="2k24" readonly />
        </div>

        <div class="detail">
          <label for="status">Has Voted</label>
          <input
            type="text"
            id="status"
            :value="voterStore.voter.hasVoted === false ? 'No' : 'Yes'"
            readonly
          />
        </div>
      </div>

      <button class="update__btn" type="button" v-if="isEditing" @click="handleUpdate">
        Update Profile
      </button>
    </form>
  </SectionLayout>
</template>

<script setup>
import SectionLayout from '@/layout/SectionLayout.vue';
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { useVotersStore } from '@/store/voters';
import { updateVoters } from '@/services/apiServices';

const voterStore = useVotersStore();
const toast = useToast();

const isEditing = ref(false);
const error = ref(null);
const loading = ref(false);

const formData = ref({
  name: '',
  level: ''
});

const handleEdit = () => {
  if (isEditing.value) {
    formData.value.name = 'John Doe';
    formData.value.level = voterStore.voter.level;
  }
  isEditing.value = !isEditing.value;
};

const handleUpdate = async () => {
  try {
    loading.value = true;
    const response = await updateVoters(voterStore.voter._id, formData.value, voterStore);

    if (response.status === 'success') {
      toast.success('Profile Updated successfully');
    } else {
      throw new Error('Failed to update profile');
    }
  } catch (err) {
    error.value = err.message;
    toast.error(error.value);
  } finally {
    isEditing.value = false;
    loading.value = false;
  }
};

onMounted(() => {
  formData.value = {
    name: 'John Doe',
    level: voterStore.voter.level
  };
});
</script>

<style scoped>
.profile__header {
  width: 100%;
  max-width: 600px;
  border-bottom: 2px solid var(--secondary);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-block: 0.25rem;
}

.profile__header > h2 {
  font-size: 1.1rem;
  font-weight: 500;
}

.profile__header > button {
  background-color: rgb(37, 37, 238);
  color: var(--neutral);
  padding: 0.25rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  border: 2px solid rgb(37, 37, 238);
  transition: all 0.5s ease;
}

.profile__header > button:hover {
  background-color: transparent;
  color: rgb(37, 37, 238);
}

.profile__details {
  width: 100%;
  max-width: 600px;
  padding: 1.5rem 0.5rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.detail {
  display: flex;
  gap: 0.5rem;
  border: 2px solid rgb(17, 17, 17);
  border-radius: 0.25rem;
  font-size: 1rem;
}

.detail > * {
  font-size: 0.95rem;
  font-weight: 500;
  letter-spacing: 1px;
}

.detail > label {
  background-color: rgb(17, 17, 17);
  color: var(--neutral);
  min-width: 7rem;
  padding-inline: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.detail > input {
  padding-block: 0.35rem;
  width: 100%;
}

.update__btn {
  background-color: rgb(37, 37, 238);
  color: var(--neutral);
  padding: 0.75rem 1.5rem;
  width: 100%;
  max-width: 600px;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.5s ease;
}

.update__btn:hover {
  border-radius: 1rem 0 1rem 0;
}

@media screen and (min-width: 700px) {
  .profile__header > h2 {
    font-size: 1.5rem;
  }

  .profile__header > button {
    font-size: 1rem;
  }

  .profile__details {
    gap: 1.5rem;
  }

  .detail > * {
    font-size: 1.1rem;
  }

  .detail > label {
    min-width: 9rem;
  }
}
</style>
