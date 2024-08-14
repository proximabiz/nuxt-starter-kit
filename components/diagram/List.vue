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

const diagramsList = computed(() => diagramStore.diagramsList)
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
  label: 'Active diagrams',
  icon: 'i-heroicons-list-bullet',
}, {
  label: 'Deleted deiagrams',
  icon: 'i-heroicons-archive-box-arrow-down', 
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
  }
  catch (error) {
    $error(error)
  }
}

async function fetchDiagrams() {
  try {
    await diagramStore.list()
    await fetchDiagramTypes()
  }
  catch (error) {
    $error(error)
  }
}

async function createDiagram() {
  try {
    // Right now we have only one type of diagram - mindmap
    const diagramType = diagramTypeStore.getMindMapTypeDiagram
    if (!diagramType)
      return

    if (diagramsList.value?.length !== undefined && diagramsList.value?.length >= sub_status.value.limitDiagrams)
      isDiagramLimitExceeded.value = true
    else
      isDiagramLimitExceeded.value = false

    isLoading.value = false
    if (isDiagramLimitExceeded.value) {
      $warning(`You have reached your ${sub_status.value.limitDiagrams} diagram limit. Upgrade now to increase your monthly limit of diagrams`)
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
    if (diagramsList.value?.length !== undefined && diagramsList.value?.length >= sub_status.value.limitDiagrams)
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
    if (response?.subscription_status === 'PLAN_EXPIRED' || response?.subscription_status === 'NO_ACTIVE_SUBSCRIPTION')
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
watch([diagramsList.value, apiResponse.value], async () => {
  if (diagramsList.value?.length !== undefined && diagramsList.value?.length >= sub_status.value.limitDiagrams)
    isDiagramLimitExceeded.value = true
  else
    isDiagramLimitExceeded.value = false

  await diagramStore.list()
  await getActivePlan()
}, { deep: true, immediate: true })

function saveDetails(_valid: boolean) {
  isSavePopupOpen.value = false
  if (_valid)
    navigateTo('/profile/billing-payments')
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
    <template v-else>
      <UTabs :items="items" :default-index="0" />
      <div class="flex justify-center sm:justify-end my-4">
        <UButton label="Create New" :disabled="isInActiveSubscription" icon="i-heroicons-plus" @click="createDiagram()" />
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
                  <tr v-for="(item, index) in diagramsList" :key="index" class="border-b dark:border-neutral-500">
                    <td class="whitespace-nowrap px-6 py-4">
                      {{ item.title }}
                    </td>
                    <td class="whitespace-nowrap px-6 py-4">
                      {{ dayjs(item.created_at).format("dddd, MMMM D YYYY hh:mm:ss") }}
                    </td>
                    <td class="whitespace-nowrap px-6 py-4">
                      <UTooltip text="View" :popper="{ arrow: true }">
                        <UButton
                          color="grey" class="inline-flex" icon="i-heroicons-eye" size="sm"
                          variant="ghost" @click="redirectToPath(item.id, 'view')"
                        />
                      </UTooltip>

                      <UTooltip text="Edit" :popper="{ arrow: true }">
                        <UButton
                          :disabled="isInActiveSubscription"
                          color="blue" class="hidden lg:inline-flex" icon="i-heroicons-pencil-square" size="sm"
                          variant="ghost" @click="redirectToPath(item.id)"
                        />
                      </UTooltip>

                      <UTooltip text="Delete" :popper="{ arrow: true }">
                        <UButton
                          :disabled="isInActiveSubscription"
                          color="red" icon="i-heroicons-trash" size="sm" variant="ghost"
                          @click="deleteDiagram(item.id)"
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
    </template>
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
      description="Are you sure you want to delete this diagram? This action cannot be undone."
      :cancel-action="{
        label: 'Keep',
        color: 'bg-green-500',
      }"
      :confirm-action="{
        label: 'Delete',
        color: 'bg-gray-500',
      }"
      @on:cancel="isDelete = false"
      @on:close="isDelete = false"
      @on:confirm="confirmedDeleteDiagram()"
    />
  </UModal>
  <UpgradeModal
    v-model="isSavePopupOpen"
    :is-open="isSavePopupOpen"
    text="Your card details are missing!\n To continue working with diagrams, please add card details."
    ok="Ok"
    @submit-confirm="saveDetails(true)"
  />
</template>
