<script lang="ts" setup>
import dayjs from 'dayjs'

const diagramStore = useDiagramStore()
const { $success, $error, $warning } = useNuxtApp()
const diagramTypeStore = useDiagramTypeStore()
const isLoading = ref(false)
const isDelete = ref(false)
const apiResponse = ref()
const deleteDiagramId = ref('')
const isSavePopupOpen = ref(false)
const isInActiveSubscription = ref(false)
const isDiagramLimitExceeded = ref(false)
const currentMonthActivatedDiagrams = ref()
const isNoActivePlanModal = ref(false)
const fetchPlanDetails = ref()

const diagramsList = computed(() => diagramStore.diagramsList)
const activeDiagrams = computed(() => diagramStore.activeDiagrams)
const deletedDiagrams = computed(() => diagramStore.deletedDiagrams)
const diagramsCountList = computed(() => diagramStore.diagramsCountList)

const headers = computed(() => [
  {
    title: 'Title',
    value: 'title',
  },
  // {
  //   title: 'Keywords',
  //   value: 'keywords',
  // },
  {
    title: 'Last Modified On',
    value: 'modified_at',
  },
  {
    title: 'Actions',
    value: '',
  },
])
const items = [{
  label: 'Active Mindmaps',
}, {
  label: 'Archived Mindmaps',
}]

const globalStore = useGlobalStore()
globalStore.pageHeading.title = 'My Diagrams'

const subscriptionStore = useSubscriptionStore()
const cardDetails = computed(() => subscriptionStore.billingDetails)
const sub_status = computed(() => subscriptionStore.subscriptionStatus)

async function fetchDiagramTypes() {
  try {
    const diagramTypeStore = useDiagramTypeStore()
    await diagramTypeStore.list()

    currentMonthActivatedDiagrams.value = Array.isArray(diagramsList.value) && diagramsList.value.filter((item: any) => item.updated_at >= sub_status.value.plan_start_date)

    const value = diagramsCountList?.value.currentCount
    const max = diagramsCountList?.value.allowedCount
    cardDetails.value.diagramPercentage = toPercentage(value, max).toString()
    cardDetails.value.actualDiagramCount = value.toString()
  }
  catch (error) {
    $error(error)
  }
}
async function fetchDiagrams() {
  try {
    await diagramStore.list()
    await fetchDiagramTypes()
    await diagramStore.getDiagramsCount()
    currentMonthActivatedDiagrams.value = Array.isArray(diagramsList.value) && diagramsList.value.filter((item: any) => item.updated_at >= sub_status.value.plan_start_date)

    const value = diagramsCountList?.value.currentCount
    const max = diagramsCountList?.value.allowedCount
    cardDetails.value.diagramPercentage = toPercentage(value, max).toString()
    cardDetails.value.actualDiagramCount = value.toString()
  }
  catch (error) {
    $error(error)
  }
}

function toPercentage(value: number, max: number) {
  if (max === 0)
    return 0
  return (value / max) * 100
}
async function createDiagram() {
  const plan_exp = dayjs().isBefore(dayjs(fetchPlanDetails.value.plan_end_date))
  if (fetchPlanDetails.value?.subscription_status === 'PLAN_EXPIRED'
    || (fetchPlanDetails.value?.subscription_status === 'NO_ACTIVE_SUBSCRIPTION' && plan_exp)
    || fetchPlanDetails.value?.subscription_status === 'NO_SUBSCRIPTION'
  ) {
    isNoActivePlanModal.value = true
  }
  else {
    isNoActivePlanModal.value = false
    try {
    // Right now we have only one type of diagram - mindmap
      const diagramType = diagramTypeStore.getMindMapTypeDiagram
      if (!diagramType)
        return

      if (diagramsCountList?.value.currentCount === diagramsCountList?.value.allowedCount)
        isDiagramLimitExceeded.value = true
      else
        isDiagramLimitExceeded.value = false

      isLoading.value = false
      if (isDiagramLimitExceeded.value) {
        $warning(`You have reached your ${diagramsCountList?.value.allowedCount} diagram limit. Upgrade now to increase your monthly limit of diagrams`)
      }
      else {
        const response = await diagramStore.create({
          title: 'default',
          diagramTypeId: diagramType.id,
        })
        /* @ts-expect-error need to be fixed */
        redirectToPath(response?.diagram[0].id)
      }
    }
    catch (error) {
      isLoading.value = false
      $error(error)
    }
  }
}
function redirectToPath(diagramId: string, mode: string = 'edit') {
  return navigateTo({
    path: `/app/diagram/${diagramId}`,
    query: {
      mode,
    },
  })
}

async function deleteDiagram(diagramId: string) {
  try {
    isDelete.value = true
    deleteDiagramId.value = diagramId
  }
  catch (error) {
    isDelete.value = true
    $error(error)
  }
}

async function confirmedDeleteDiagram() {
  try {
    apiResponse.value = await diagramStore.delete({
      diagramId: deleteDiagramId.value,
    })
    isDelete.value = false
    $success('Diagram deleted successfully!')
    fetchDiagrams()
    getActivePlan()
    if (diagramsCountList?.value.currentCount === diagramsCountList?.value.allowedCount)
      isDiagramLimitExceeded.value = true
    else
      isDiagramLimitExceeded.value = false
  }
  catch (error) {
    $error(error)
  }
}

async function getActivePlan() {
  try {
    const response = await subscriptionStore.fetchActivePlan()
    fetchPlanDetails.value = response
    const plan_exp = dayjs().isBefore(dayjs(response.plan_end_date))
    if (response?.subscription_status === 'PLAN_EXPIRED'
      || (response?.subscription_status === 'NO_ACTIVE_SUBSCRIPTION' && !plan_exp)
      || response?.subscription_status === 'NO_SUBSCRIPTION'
    )
      isInActiveSubscription.value = true
    else
      isInActiveSubscription.value = false
  }
  catch (error) {
    $error(error.statusMessage)
  }
}

onMounted(async () => {
  fetchDiagrams()
  isSavePopupOpen.value = false
  if (cardDetails.value.cardNo === '') {
    return (
      isSavePopupOpen.value = true
    )
  }
  await getActivePlan()
})
watch([diagramsList.value, apiResponse.value, diagramsCountList.value], async () => {
  if (diagramsCountList?.value.currentCount === diagramsCountList?.value.allowedCount)
    isDiagramLimitExceeded.value = true
  else
    isDiagramLimitExceeded.value = false

  await diagramStore.list()
  await getActivePlan()
  fetchDiagrams()
}, { deep: true, immediate: true })

function saveDetails(_valid: boolean) {
  isSavePopupOpen.value = false
  if (_valid)
    navigateTo('/profile/billing-payments')
}
function rediectToPricePage(_valid: boolean) {
  isNoActivePlanModal.value = false
  if (_valid)
    navigateTo('/website/pricing')
}
</script>

<template>
  <div class="pl-6">
    <template v-if="!diagramsList?.length">
      <div class="flex justify-center my-4">
        <UButton label="Create your first mindmap" icon="i-heroicons-plus" @click="createDiagram()" />
      </div>
      <DiagramEmptyListInstructions />
    </template>

    <!-- <template v-else> -->
    <UTabs v-else :items="items" :default-index="0">
      <template #item="{ item }">
        <div v-if="item.label === 'Active Mindmaps'" class="space-y-3">
          <div class="flex justify-center sm:justify-end my-4">
            <UButton
              label="Create New" icon="i-heroicons-plus"
              @click="createDiagram()"
            />
          </div>

          <div class="sm:overflow-x-hidden overflow-x-auto">
            <div class="sm:-mx-6 lg:-mx-8">
              <div class="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                <div class="overflow-x-scroll">
                  <table class="min-w-full text-left text-sm font-light">
                    <thead class="border-b font-medium dark:border-neutral-500">
                      <tr>
                        <th v-for="(header, index) in headers" :key="index" scope="col" class="px-6 py-4">
                          {{ header.title }}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(activeDiagram, index) in activeDiagrams" :key="index" class="border-b dark:border-neutral-500">
                        <td class="whitespace-nowrap px-6 py-4">
                          {{ activeDiagram.title }}
                        </td>
                        <td class="whitespace-nowrap px-6 py-4">
                          {{ dayjs(activeDiagram.updated_at).format("dddd, MMMM D YYYY hh:mm:ss") }}
                        </td>
                        <td class="whitespace-nowrap px-6 py-4">
                          <UTooltip text="View" :popper="{ arrow: true }">
                            <UButton
                              color="grey" class="inline-flex" icon="i-heroicons-eye" size="sm" variant="ghost"
                              @click="redirectToPath(activeDiagram.id, 'view')"
                            />
                          </UTooltip>

                          <UTooltip text="Edit" :popper="{ arrow: true }">
                            <UButton
                              :disabled="isInActiveSubscription" color="blue" class="hidden lg:inline-flex"
                              icon="i-heroicons-pencil-square" size="sm" variant="ghost"
                              @click="redirectToPath(activeDiagram.id)"
                            />
                          </UTooltip>

                          <UTooltip text="Delete" :popper="{ arrow: true }">
                            <UButton
                              :disabled="isInActiveSubscription" color="red" icon="i-heroicons-trash" size="sm"
                              variant="ghost" @click="deleteDiagram(activeDiagram.id)"
                            />
                          </UTooltip>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="item.label === 'Archived Mindmaps'" class="space-y-3">
          <div class="sm:overflow-x-hidden overflow-x-auto">
            <div class="sm:-mx-6 lg:-mx-8">
              <div class="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                <div class="overflow-x-scroll">
                  <table class="min-w-full text-left text-sm font-light">
                    <thead class="border-b font-medium dark:border-neutral-500">
                      <tr>
                        <th v-for="(header, index) in headers" :key="index" scope="col" class="px-6 py-4">
                          {{ header.title }}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(deletedDiagram, index) in deletedDiagrams" :key="index" class="border-b dark:border-neutral-500">
                        <td class="whitespace-nowrap px-6 py-4">
                          {{ deletedDiagram.title }}
                        </td>
                        <td class="whitespace-nowrap px-6 py-4">
                          {{ dayjs(deletedDiagram.updated_at).format("dddd, MMMM D YYYY hh:mm:ss") }}
                        </td>
                        <td class="whitespace-nowrap px-6 py-4">
                          <UTooltip text="View" :popper="{ arrow: true }">
                            <UButton
                              color="grey" class="inline-flex" icon="i-heroicons-eye" size="sm" variant="ghost"
                              @click="redirectToPath(deletedDiagram.id, 'view')"
                            />
                          </UTooltip>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </UTabs>
    <!-- </template> -->
  </div>
  <UModal v-model="isLoading">
    <UProgress animation="carousel" />
    <UCard>
      Creating your <span class="font-bold">Default</span> Diagram...
    </UCard>
  </UModal>

  <!-- Delete diagram modal -->
  <UModal v-model="isDelete">
    <ModalsConfirmation
      title="Confirm Diagram Deletion"
      description="Are you sure you want to delete this mind map? This action cannot be undone." :cancel-action="{
        label: 'Keep',
        color: 'bg-green-500',
      }" :confirm-action="{
        label: 'Delete',
        color: 'bg-gray-500',
      }" @on:cancel="isDelete = false" @on:close="isDelete = false" @on:confirm="confirmedDeleteDiagram()"
    />
  </UModal>

  <UModal :model-value="isSavePopupOpen" :transition="false">
    <div class="p-8">
      <p class="mb-3">
        Your card details are missing!
      </p>
      <p>To continue working with mind maps, please add card details.</p>
      <div class="mt-4 flex justify-end gap-4">
        <UButton class="" color="gray" @click="rediectToPricePage(false)">
          Cancel
        </UButton>
        <UButton class="" @click="saveDetails(true)">
          Ok
        </UButton>
      </div>
    </div>
  </UModal>
  <UModal :model-value="isNoActivePlanModal" :transition="false">
    <div class="p-8">
      <p class="mb-3">
        You do not have an active plan,
      </p>
      <p>upgrade plan now to continue creating mind maps.</p>
      <div class="mt-4 flex justify-end gap-4">
        <UButton class="" color="gray" @click="rediectToPricePage(false)">
          Cancel
        </UButton>
        <UButton class="" @click="rediectToPricePage(true)">
          Upgrade
        </UButton>
      </div>
    </div>
  </UModal>
</template>
