<script setup lang="ts">

const items = reactive([
  {
    label: 'General',
    // Replaced items with specific questions
    list: [
      'What are the core components of our service?',
      'How does our service stand out from competitors?',
      'What improvements can we make to enhance user experience?',
    ], 
  },
  {
    label: 'Collaboration and teams',
    // Replaced items with specific questions
    list: [
      'How can we improve communication in remote teams?',
      'What tools can enhance our teamwork and collaboration?',
      'How do we maintain team morale and productivity in a virtual environment?',
    ], 
  },
  {
    label: 'Integration and features',
    // Replaced items with specific questions
    list: [
      'What integrations would most enhance our product’s value?',
      'How can we ensure seamless integration with third-party services?',
      'Which new features are our users requesting the most?',
    ], 
  },
  {
    label: 'Subscription',
    // Replaced items with specific questions
    list: [
      'What subscription models best align with our user’s needs?',
      'How can we provide more value in our subscription packages?',
      'What feedback have users given on our current subscription options?',
    ], 
  },
]);


const openedIndex = ref(-1);

const toggle = (index: number) => {
  openedIndex.value = openedIndex.value === index ? -1 : index;
};

const isOpen = (index: number) => openedIndex.value === index;

</script>
<template>
    <div class="flex flex-col">
      <div v-for="(item, index) in items" :key="index" class="mb-2">
        <button 
          @click="toggle(index)" 
          class="px-4 py-2 bg-gray-200 text-left w-full flex justify-between items-center transition duration-300 ease-in-out">
          {{ item.label }}
          <span v-if="isOpen(index)"><UIcon name="i-heroicons-chevron-down-20-solid" /></span>
          <span v-else><UIcon name="i-heroicons-chevron-right-20-solid" /></span>
        </button>
        <div v-if="isOpen(index)" class="p-4 transition-all duration-300 ease-in-out" style="transition-property: height, opacity;">
        
          <ul>
            <li v-for="(listItem, listIndex) in item.list" :key="listIndex" class="text-blue-500 hover:text-blue-600 cursor-pointer transition-colors duration-150 ease-in-out">
              {{ listItem }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </template>
  
  