<script setup lang="ts">
const props = defineProps<Props>()
const users = ['1user']
const user = ref(users[0])
const activeStep = ref(0)

interface Props {
  planDetails: any
}
const steps = [
  // {label: '', component: 'websitePricing'},
  { label: 'Your plan', component: 'BillingDetailsBillling' },
  { label: 'Your Address', component: 'BillingAddress' },
  { label: 'Card Details', component: 'BillingCardDetails' },
  { label: 'Review your details', component: 'BillingReview' },
]

function nextStep() {
  if (activeStep.value < steps.length - 1)
    activeStep.value++
}
function prevStep() {
  if (activeStep.value > 0)
    activeStep.value--
}

function isActive(index: number) {
  return activeStep.value >= index
}
</script>

<template>
  <div class="grid place-items-center mt-4">

    <div class="">
    <ol class="flex">
      <li v-for="(step, index) in steps" :key="index" class="flex items-center">
        <span  class="rounded-full  px-2.5 py-1 mr-2 text-sm"
         :class="isActive(index) ? 'bg-green-500 text-white' : 'bg-slate-300'"
         @click="prevStep">
          {{ index + 1 }}
        </span>
        <span  class="mr-4 text-sm" :class="isActive(index) ? 'text-orange-400 font-medium text-lg' : 'text-slate-800'">
          {{ step.label }}
        </span>
        
      </li>
    </ol> 
</div>
    
    <!-- <UBreadcrumb :links="steps" divider="" :ui="{ ol: 'gap-x-3' }" class="mb-4">
      <template #icon="{ link, index }">
        <UAvatar
          :alt="(index + 1).toString()" :ui="{
            background: isActive(index) ? 'bg-primary-500 dark:bg-primary-400' : undefined,
            placeholder: isActive(index) ? 'text-white dark:text-gray-900' : 'group-hover:text-gray-700 dark:group-hover:text-gray-200',
          }" size="xs" @click="prevStep"
        />
      </template>
    </UBreadcrumb> -->

    <UCard v-if="activeStep === 0" class="mb-6 mt-4">
      <div class="divide-y divide-solid">
        <header class="flex justify-start">
          AI Flow mapper {{ props.planDetails.plan }}
        </header>
        <section class="grid grid-cols-2 gap-32 mt-3 py-4">
          <USelect v-model="user" :options="users" color="blue" />
          <div>
            <span>{{ props.planDetails.month }} {{ props.planDetails.month > 1 ? "months" : "month" }} *
              {{ props.planDetails.price }}</span>
            <span class="font-semibold pl-1">{{ props.planDetails.calculatedPrice }}{{
              props.planDetails.currencySymbol }}</span>
          </div>
        </section>
        <section class="grid grid-cols-2 gap-32 mt-3 py-4">
          <div>Tax</div>
          <div class="">
            $11.88
          </div>
        </section>
        <section class="grid grid-cols-2 gap-32 mt-3 py-4">
          <div class="font-semibold">
            Due today
          </div>
          <div class="font-semibold">
            $77.88
          </div>
        </section>
      </div>
    </UCard>
    <BillingAddress v-if="activeStep === 1" />
    <BillingCardDetails v-if="activeStep === 2" />
    <BillingReview v-if="activeStep === 3" />
    <UButton v-if="activeStep !== 3" @click="nextStep">
      Continue
    </UButton>
  </div>
</template>

<style scoped></style>
