<script setup lang="ts">
const items = reactive([
  {
    label: 'General',
    list: [
      'What is a Mind Map?',
      'What is an AI FlowMapper?',
      'Can I have a trial version of the AI FlowMapper?',
      'What does the "I have more details" checkbox indicate?',
      'How do I create a Mind Map using AI FlowMapper?',
      'What are the various ways in which you can create a Mind Map from AI FlowMapper?',
      'What if I face any issue, how to reach support team?',
    ],
  },
  {
    label: 'Account',
    list: [
      'How do I create an account for AI FlowMapper?',
      'Can I edit my account details?',
      'How can I reset my password?',
    ],
  },
  {
    label: 'Working with mindmap',
    list: [
      'What is Data Driven function way to create Mind Map?',
      'What is From JSON function way to create Mind Map?',
      'Can I download the Mind Map?',
      'Where can I see the Mind Maps that I have created?',
      'Can I edit my Mind Map?',
      'Can I delete my Mind Map?',
      'Can I download the Mind Map that I have created?',
      'Can I export the Mind Map as a JSON file?',
      'Can I check the different version available for the Mind Map?',
      'Can I change the look and feel of the Mind Map?',
      'Can I change the font style in the Mind Map?',
      'Can I change the color of my font in the Mind Map?',
      'Can I change the background color of a Node in the Mind Map?',
      'Can I drag and drop the node?',
      'Can I delete or remove a node?',
      'Can I add a Tag?',
      'Can I add an Icon?',
      'Can I add an external link or URL to a Node in the Mind Map?',
      'Can I remove the link or external link that I had added to the Node?',
      'Can I change the label of the Node?',
      'Can I add a Child to a Node?',
      'Can I add a Parent to a Node?',
      'Can I add a Sibling to a Node?',
      'What is Focus Mode?',
      'Can I cancel the Focus Mode?',
      'Can I Move Up a Node?',
      'Can I Move Down a Node?',
      'What is Link?',
    ],
  },
  {
    label: 'Subscription',
    list: [
      'What are the various plans available for the AI FlowMapper tool?',
      'Can I cancel Free subscription?',
      'Can I cancel Paid subscription?',
      'How to upgrade my subscription?',
      'What happens after my Free plan gets over?',
      'How can I renew my subscription?',
    ],

  },
])

const openedIndex = ref(-1)
const selectedQuestion = ref('')
const breadcrumbText = ref('')

async function toggle(index: number) {
  if (openedIndex.value === index) {
    openedIndex.value = -1
  }
  else {
    openedIndex.value = -1 // Close all first, ensures smoother transition
    await nextTick() // Wait for DOM update
    openedIndex.value = index // Then open the new one
  }
}

const isOpen = (index: number) => openedIndex.value === index
function selectQuestion(question: string, label: string) {
  selectedQuestion.value = question
  breadcrumbText.value = label
}

function resetComponent() {
  selectedQuestion.value = ''
}
// Transition hooks
function beforeEnter(el: any) {
  el.style.height = '0'
}

function enter(el: any) {
  requestAnimationFrame(() => {
    el.style.height = `${el.scrollHeight}px`
  })
}

function beforeLeave(el: any) {
  el.style.height = `${el.scrollHeight}px`
  return el.offsetHeight
}

function leave(el: any) {
  requestAnimationFrame(() => {
    el.style.height = '0'
  })
}
</script>

<template>
  <div v-if="selectedQuestion">
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
    <WebsiteAnswer :question="selectedQuestion" />
  </div>
  <div v-else class="flex flex-col mt-8">
    <div v-for="(item, index) in items" :key="index" class="mb-2">
      <button
        class="px-4 py-2 bg-custom1-100 rounded-md text-custom3-900 text-left w-full flex justify-between items-center"
        @click="toggle(index)"
      >
        {{ item.label }}
        <span v-if="isOpen(index)">
          <UIcon name="i-heroicons-chevron-down-20-solid" />
        </span>
        <span v-else>
          <UIcon name="i-heroicons-chevron-right-20-solid" />
        </span>
      </button>

      <Transition
        name="accordion" @before-enter="beforeEnter" @enter="enter" @before-leave="beforeLeave"
        @leave="leave"
      >
        <div v-if="isOpen(index)" class="p-4">
          <ul>
            <li
              v-for="(listItem, listIndex) in item.list" :key="listIndex"
              class="text-blue-500 hover:text-blue-600 cursor-pointer" @click="selectQuestion(listItem, item.label)"
            >
              {{ listItem }}
            </li>
          </ul>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style>
.accordion-enter-active,
.accordion-leave-active {
  transition: height 1s ease;
}

.accordion-enter-from,
.accordion-leave-to {
  height: 0;
}
</style>
