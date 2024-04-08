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
const selectedQuestion = ref('');
const breadcrumbText = ref('');

const toggle = async (index: number) => {
  if(openedIndex.value === index) {
    openedIndex.value = -1;
  } else {
    openedIndex.value = -1; // Close all first, ensures smoother transition
    await nextTick(); // Wait for DOM update
    openedIndex.value = index; // Then open the new one
  }
};

const isOpen = (index: number) => openedIndex.value === index;
const selectQuestion = (question: string,label: string) => {
  selectedQuestion.value = question;
  breadcrumbText.value = label
};

function resetComponent() {
  selectedQuestion.value = ''
}
// Transition hooks
function beforeEnter(el:any) {
  el.style.height = '0';
}

function enter(el:any) {
  requestAnimationFrame(() => {
    el.style.height = el.scrollHeight + 'px';
  });
}

function beforeLeave(el:any) {
  el.style.height = el.scrollHeight + 'px';
  el.offsetHeight; // force repaint to ensure the height is taken into account
}

function leave(el:any) {
  requestAnimationFrame(() => {
    el.style.height = '0';
  });
}

</script>
<template>
  <div v-if="selectedQuestion" >
    <nav aria-label="Breadcrumb" class="ml-4">
    <ol class="flex font-semibold">
      <li class="cursor-pointer" @click="resetComponent()">
        FAQ
      </li>
      <li class="mx-1">
        >
      </li>
      <li class="text-custom4-600">
        {{ breadcrumbText }}
      </li>
    </ol>
  </nav>
  <WebsiteAnswer  :question="selectedQuestion"/>
</div>
    <div v-else class="flex flex-col mt-8">
      <div v-for="(item, index) in items" :key="index" class="mb-2">
        <button 
          @click="toggle(index)" 
          class="px-4 py-2 bg-custom1-100 rounded-md text-custom3-900 text-left w-full flex justify-between items-center">
          {{ item.label }}
          <span v-if="isOpen(index)"><UIcon name="i-heroicons-chevron-down-20-solid" /></span>
          <span v-else><UIcon name="i-heroicons-chevron-right-20-solid" /></span>
        </button>

        <Transition
        name="accordion"
        @before-enter="beforeEnter"
        @enter="enter"
        @before-leave="beforeLeave"
        @leave="leave">
        <div v-if="isOpen(index)" class="p-4">
        
          <ul>
            <li v-for="(listItem, listIndex) in item.list" :key="listIndex" class="text-blue-500 hover:text-blue-600 cursor-pointer"  @click="selectQuestion(listItem,item.label)">
              {{ listItem }}
            </li>
          </ul>
        </div>
      </Transition>
      </div>
    </div>
    
  </template>


  <style>
  .accordion-enter-active, .accordion-leave-active {
    transition: height 1s ease;
  }
  .accordion-enter-from, .accordion-leave-to {
    height: 0;
  }
  </style>