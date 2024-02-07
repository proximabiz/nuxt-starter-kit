<script setup lang="ts">
const props = defineProps<Props>()
const users = ['1user',]
const user = ref(users[0])
const activeStep = ref(0)

interface Props {
  planDetails: any
}
const steps = [
  { label: 'Your plan', component: 'BillingDetailsBillling' },
  { label: 'Your Address', component: 'BillingAddress' },
  { label: 'Card Details', component: 'BillingCardDetails' },
  { label: 'Review your details', component: 'BillingReview' }
]

const nextStep=()=> {
  if (activeStep.value < steps.length - 1) {
    activeStep.value++;
  }
}
const prevStep = () => {
  if (activeStep.value > 0) {
    activeStep.value--;
  }
};

function isActive(index: number) {
  return activeStep.value >= index;
}

</script>

<template>
  <div class="grid place-items-center mt-5">
    <UBreadcrumb :links="steps" divider="" :ui="{ ol: 'gap-x-3' }" class="mb-4">
      <template #icon="{link, index }">
        <UAvatar :alt="(index + 1).toString()" @click="prevStep" :ui="{
          background: isActive(index) ? 'bg-primary-500 dark:bg-primary-400' : undefined,
          placeholder: isActive(index) ? 'text-white dark:text-gray-900' : 'group-hover:text-gray-700 dark:group-hover:text-gray-200',
        }" size="xs" 
        />
      </template>
    </UBreadcrumb>

      <UCard class="mb-6 mt-4" v-if="activeStep === 0">
        <div class="divide-y divide-solid">
          <header class="flex justify-start">
            AI Flow mapper {{ props.planDetails.plan }}
          </header>
          <section class="grid grid-cols-2 gap-32 mt-3 py-4">
            <USelect v-model="user" :options="users" color="blue"/>
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
      <BillingAddress v-if="activeStep === 1"/>
      <BillingCardDetails v-if="activeStep === 2"/>
      <BillingReview v-if="activeStep === 3"/>  
    <UButton v-if="activeStep !== 3" @click="nextStep">
      Continue
    </UButton>
  </div>
</template>

<style scoped></style>
