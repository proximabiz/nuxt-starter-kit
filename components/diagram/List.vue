<script lang="ts" setup>
import dayjs from 'dayjs'
import { useDiagramCountLimit } from '~/stores/global'

const diagramStore = useDiagramStore()
const { $success, $error, $warning } = useNuxtApp()
const diagramTypeStore = useDiagramTypeStore()
const diagramCount = useDiagramCountLimit()
const isLoading = ref(false)
const isDelete = ref(false)
const apiResponse = ref()
const deleteDiagramId = ref('')
const isSavePopupOpen = ref(false)
const isInActiveSubscription = ref(false)
const planName = ref(false)
const planCount = ref({
  name: '',
  count: 0,
})

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

const globalStore = useGlobalStore()
globalStore.pageHeading.title = 'My Diagrams'

const subscriptionStore = useSubscriptionStore()
const cardDetails = computed(() => subscriptionStore.billingDetails)

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

    const response = await diagramStore.create({
      title: 'default',
      diagramTypeId: diagramType.id,
    })

    isLoading.value = false
    if (planName.value)
      $warning(`You have reached your ${planCount.value.count} diagram limit. Upgrade now to increase your monthly limit of diagrams`)
    else
    /* @ts-expect-error need to be fixed */
      redirectToPath(response?.diagram[0].id)
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
  }
  catch (error) {
    $error(error)
  }
}
async function getActivePlan() {
  try {
    const response = await subscriptionStore.fetchActivePlan()
    planCount.value.name = response.name
    planCount.value.count = response.name === 'Basic' ? 4 : response.name === 'Free' ? 8 : response.name === 'Premium' ? 8 : 0
    if (response.name === 'Basic' && diagramsList.value?.length !== undefined && diagramsList.value?.length >= 4)
      planName.value = true
    else if (response.name === 'Free' && diagramsList.value?.length !== undefined && diagramsList.value?.length >= 8)
      planName.value = true
    else if (response.name === 'Premium' && diagramsList.value?.length !== undefined && diagramsList.value?.length >= 8)
      planName.value = true
    else
      planName.value = false
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
  diagramCount.setDiagramDetails(planCount.value)

  await getActivePlan()
})

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
