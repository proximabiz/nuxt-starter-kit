<script setup lang="ts">
import { ref } from 'vue'
import type { FormSubmitEvent } from '#ui/types'

interface State {
  gst: string 
}
interface ApiResponse {
  success: boolean;
}

const state = ref<State>({
  gst: "7627GHW7889",
})
const isModalVisible = ref(false);

const showModal=()=> {
  isModalVisible.value = true;
}

const onSubmit=async (event: FormSubmitEvent<any>) =>{
  console.log(event.data)
}

const handleDeleteConfirm = async (): Promise<void> => {
  try {
    // Simulating a dummy API request with a TypeScript type
    const response = await new Promise<ApiResponse>((resolve) => {
      setTimeout(() => resolve({ success: true }), 1000)
    });

    if (response.success) {
      // Clear the GST number from state
      state.value.gst = "";
      isModalVisible.value = false;
      console.log("GST number deleted successfully");
    }
  } catch (error) {
    console.error("Error deleting GST number", error);
  }
};


</script>

<template>
  <div class="flex justify-center items-center flex-col py-8">
    <h1 class="font-semibold">Tax ID and GST Details</h1>
    <div class="flex mt-4">
      <span class="px-4">Tax ID / GST Number : </span>
      <UForm :state="state" class="" @submit="onSubmit">
        <UFormGroup name="gst">
          <UInput v-model="state.gst" placeholder="Enter your Tax ID/GST No." :disabled="!!state.gst" class="custom-input"
            color="blue" />
        </UFormGroup>
        <div class="flex gap-6 mt-8">
          <UButton type="submit" v-if="!state.gst" class="w-fit" color="blue">
            Cancel
          </UButton>
          <UButton type="submit" v-if="!state.gst" class="w-fit" color="blue">
            Save
          </UButton>
        </div>
      </UForm>
      <Icon v-if="state.gst" name="material-symbols-light:delete-rounded" color="black" class="text-2xl mt-1 cursor-pointer" @click="showModal"/>
      <Confirmation :isOpen="isModalVisible" @DeleteConfirm="handleDeleteConfirm"/>
    </div>
  </div>
</template>
