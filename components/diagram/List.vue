<script lang="ts" setup>
import dayjs from 'dayjs'
import crown from '../../assets/media/crown.png'

const diagramStore = useDiagramStore()
const { $success, $error, $warning } = useNuxtApp()
const diagramTypeStore = useDiagramTypeStore()
const isLoading = ref<boolean>(false)
const isDelete = ref<boolean>(false)
const apiResponse = ref()
const deleteDiagramId = ref<string>('')
const saveModal = ref<boolean>(false)
const isInactiveSubscription = ref<boolean>(false)
const isDiagramLimitExceeded = ref<boolean>(false)
const currentMonthActivatedDiagrams = ref()
const inActivePlanModal = ref<boolean>(false)
const isActiveTitleSort = ref<boolean>(false)
const isActiveUpdateDateSort = ref<boolean>(false)
const isFetchingMindmpas = ref<boolean>(false)
const isCardExpired = ref<boolean>(false)
const selectedHeader = ref<string>('')

const diagramsList = computed(() => diagramStore.diagramsList)
const activeDiagrams = computed(() => diagramStore.activeDiagrams)
const deletedDiagrams = computed(() => diagramStore.deletedDiagrams)
const diagramsCountList = computed(() => diagramStore.diagramsCountList)
const headers = computed(() => [
  {
    title: 'Membership Type',
    value: 'MembershipType',
  },
  {
    title: 'Title',
    value: 'title',
  },
  {
    title: 'Last Modified On',
    value: 'updated_at',
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

const page = ref(1)
const pageCount = 5
const activeDiagramRows = Array.isArray(activeDiagrams.value) ? activeDiagrams.value : []
const inActiveDiagramRows = Array.isArray(deletedDiagrams.value) ? deletedDiagrams.value : []

const activeRows = computed(() => {
  return activeDiagramRows.slice((page.value - 1) * pageCount, (page.value) * pageCount)
})

const inActiveRows = computed(() => {
  return inActiveDiagramRows.slice((page.value - 1) * pageCount, (page.value) * pageCount)
})

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
    diagramsCountList.value.diagramPercentage = toPercentage(value, max).toString()
    diagramsCountList.value.actualDiagramCount = value.toString()
  }
  catch (error) {
    $error(error.statusMessage)
  }
}
async function fetchDiagrams() {
  try {
    await diagramStore.list()
    await fetchDiagramTypes()
    currentMonthActivatedDiagrams.value = Array.isArray(diagramsList.value) && diagramsList.value.filter((item: any) => item.updated_at >= sub_status.value.plan_start_date)

    const value = diagramsCountList?.value.currentCount
    const max = diagramsCountList?.value.allowedCount
    diagramsCountList.value.diagramPercentage = toPercentage(value, max).toString()
    diagramsCountList.value.actualDiagramCount = value.toString()
  }
  catch (error) {
    $error(error.statusMessage)
  }
}

function toPercentage(value: number, max: number) {
  return max === 0 ? 0 : (value / max) * 100
}
async function createDiagram() {
  const plan_exp = dayjs().isBefore(dayjs(sub_status.value.plan_end_date))
  if (['NO_SUBSCRIPTION', 'PLAN_EXPIRED'].includes(sub_status.value?.planName) || (sub_status.value?.planName === 'NO_ACTIVE_SUBSCRIPTION' && !plan_exp)) {
    inActivePlanModal.value = true
  }
  else {
    inActivePlanModal.value = false
    try {
    // Right now we have only one type of diagram - mindmap
      const diagramType = diagramTypeStore.getMindMapTypeDiagram
      if (!diagramType)
        return

      isDiagramLimitExceeded.value = diagramsCountList.value.currentCount === diagramsCountList?.value.allowedCount

      isLoading.value = false
      if (isDiagramLimitExceeded.value) {
        $warning(`You have reached your ${diagramsCountList?.value.allowedCount} diagram limit. Upgrade now to increase your monthly limit of diagrams`)
      }
      else {
        const response = await diagramStore.create({
          title: 'default',
          diagramTypeId: diagramType.id,
          subTypeId: sub_status.value.sub_type_id,
        })
        /* @ts-expect-error need to be fixed */
        redirectToPath(response?.diagram[0].id)
      }
    }
    catch (error) {
      isLoading.value = false
      $error(error.statusMessage)
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
    $error(error.statusMessage)
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
    isDiagramLimitExceeded.value = diagramsCountList.value.currentCount === diagramsCountList?.value.allowedCount
  }
  catch (error) {
    $error(error.statusMessage)
  }
}

async function getCardDetails() {
  isFetchingMindmpas.value = true
  try {
    await subscriptionStore.getCardDetailsAPI()
    isCardExpired.value = false
    isFetchingMindmpas.value = false
  }
  catch (error) {
    isFetchingMindmpas.value = false
    // isCardExpired.value = error.data.message.includes('Expired Card')
    isCardExpired.value = error.data.message.includes('not found')
  }
}

onMounted(async () => {
  fetchDiagrams()
  await getCardDetails()
  const { cardHolderName, cardNo, expDate, cvv } = cardDetails.value
  if ((!cardHolderName
    && !cardNo
    && !expDate
    && !cvv)
    || isCardExpired.value
  ) {
    return (
      saveModal.value = true
    )
  }
})
watch([diagramsList.value, apiResponse.value, diagramsCountList.value, cardDetails.value], async () => {
  if (diagramsCountList?.value.currentCount === diagramsCountList?.value.allowedCount)
    isDiagramLimitExceeded.value = true
  else
    isDiagramLimitExceeded.value = false

  await diagramStore.list()
  fetchDiagrams()
  const plan_exp = dayjs().isBefore(dayjs(sub_status.value?.plan_end_date))
  const planExpStatus = (['NO_SUBSCRIPTION', 'PLAN_EXPIRED', 'NO_ACTIVE_SUBSCRIPTION'].includes(sub_status.value?.planStatus) && !plan_exp)
  isInactiveSubscription.value = planExpStatus && isCardExpired.value
  const subscriptionState = ['NO_SUBSCRIPTION', 'NO_ACTIVE_SUBSCRIPTION'].includes(sub_status.value?.planStatus)
  if (!subscriptionState)
    await diagramStore.getDiagramsCount()
}, { deep: true, immediate: true })

function saveDetails(_valid: boolean) {
  saveModal.value = false
  if (_valid)
    navigateTo('/profile/billing-payments')
}
function rediectToPricePage(_valid: boolean) {
  inActivePlanModal.value = false
  if (_valid)
    navigateTo('/website/pricing')
}

function sortDiagramList(header: string, _diagramType: string, _isActiveTitleSort: boolean, _isActiveUpdateDateSort: boolean) {
  selectedHeader.value = header
  const diagrams = _diagramType === 'activeDiagrams' ? Array.isArray(activeRows.value) && activeRows.value : Array.isArray(inActiveRows.value) && inActiveRows.value
  header === 'title'
  && diagrams && diagrams.sort((a: any, b: any) => _isActiveTitleSort ? (a[header].toLowerCase() > b[header].toLowerCase()) ? 1 : -1 : -1)
  header === 'updated_at'
  && diagrams && diagrams.sort((a: any, b: any) => _isActiveUpdateDateSort ? (dayjs(a[header]) > (dayjs(b[header]))) ? 1 : -1 : -1)
}
</script>

<template>
  <UModal v-model="isFetchingMindmpas">
    <UProgress animation="carousel" />
    <UCard>
      Fetching your <span class="font-bold">Mindmaps.</span>
    </UCard>
  </UModal>
  <div class="pl-6">
    <template v-if="!diagramsList?.length">
      <div class="flex justify-center my-4">
        <UButton label="Create your first mindmap" icon="i-heroicons-plus" :disabled="isInactiveSubscription" @click="createDiagram()" />
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
              :disabled="isInactiveSubscription"
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
                        <th
                          v-for="(header, index) in headers" :key="index" :class="header.value === 'MembershipType' ? 'w-3 pt-0 pb-0 pl-0' : ''" scope="col"
                          class="px-6 py-4 cursor-pointer"
                          @click="sortDiagramList(header.value, 'activeDiagrams', isActiveTitleSort = header.value === 'title' ? !isActiveTitleSort : isActiveTitleSort, isActiveUpdateDateSort = header.value === 'updated_at' ? !isActiveUpdateDateSort : isActiveUpdateDateSort)"
                        >
                          <span>
                            <span v-if="selectedHeader === 'title' && header.value === 'title' && isActiveTitleSort"><UIcon name="i-heroicons-bars-arrow-down" class="w-5 h-5" /></span>
                            <span v-else-if="selectedHeader === 'title' && header.value === 'title' && !isActiveTitleSort"><UIcon name="i-heroicons-bars-arrow-up" class="w-5 h-5" /></span>
                            <span v-else-if="selectedHeader === 'updated_at' && header.value === 'updated_at' && isActiveUpdateDateSort"><UIcon name="i-heroicons-bars-arrow-down" class="w-5 h-5" /></span>
                            <span v-else-if="selectedHeader === 'updated_at' && header.value === 'updated_at' && !isActiveUpdateDateSort"><UIcon name="i-heroicons-bars-arrow-up" class="w-5 h-5" /></span>
                            {{ header.title }}</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(activeDiagram, index) in activeRows" :key="index" class="border-b dark:border-neutral-500">
                        <td>
                          <span v-if="activeDiagram.plan_name !== 'Free' ">
                            <UTooltip :text="activeDiagram.plan_name" :popper="{ arrow: true }">
                              <img :src="crown" class="w-8 h-8 flex justify-center items-center">
                            </UTooltip>
                          </span>
                        </td>
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
                              :disabled="isInactiveSubscription" color="blue" class="hidden lg:inline-flex"
                              icon="i-heroicons-pencil-square" size="sm" variant="ghost"
                              @click="redirectToPath(activeDiagram.id)"
                            />
                          </UTooltip>

                          <UTooltip text="Delete" :popper="{ arrow: true }">
                            <UButton
                              :disabled="isInactiveSubscription" color="red" icon="i-heroicons-trash" size="sm"
                              variant="ghost" @click="deleteDiagram(activeDiagram.id)"
                            />
                          </UTooltip>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700 mt-4 w-full">
                  <UPagination v-model="page" :page-count="pageCount" :total="activeDiagramRows.length" />
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
                        <th
                          v-for="(header, index) in headers" :key="index" scope="col" class="px-6 py-4 cursor-pointer"
                          @click="sortDiagramList(header.value, 'deletedDiagrams', isActiveTitleSort = header.value === 'title' ? !isActiveTitleSort : isActiveTitleSort, isActiveUpdateDateSort = header.value === 'updated_at' ? !isActiveUpdateDateSort : isActiveUpdateDateSort)"
                        >
                          <span>
                            <span v-if="selectedHeader === 'title' && header.value === 'title' && isActiveTitleSort"><UIcon name="i-heroicons-bars-arrow-down" class="w-5 h-5" /></span>
                            <span v-else-if="selectedHeader === 'title' && header.value === 'title' && !isActiveTitleSort"><UIcon name="i-heroicons-bars-arrow-up" class="w-5 h-5" /></span>
                            <span v-else-if="selectedHeader === 'updated_at' && header.value === 'updated_at' && isActiveUpdateDateSort"><UIcon name="i-heroicons-bars-arrow-down" class="w-5 h-5" /></span>
                            <span v-else-if="selectedHeader === 'updated_at' && header.value === 'updated_at' && !isActiveUpdateDateSort"><UIcon name="i-heroicons-bars-arrow-up" class="w-5 h-5" /></span>
                            {{ header.title }}</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(deletedDiagram, index) in inActiveRows" :key="index" class="border-b dark:border-neutral-500">
                        <td>
                          <UTooltip :text="deletedDiagram.plan_name" :popper="{ arrow: true }">
                            <img :src="crown" class="w-8 h-8 flex justify-center items-center">
                          </UTooltip>
                        </td>
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
                <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700 mt-4 w-full">
                  <UPagination v-model="page" :page-count="pageCount" :total="inActiveDiagramRows.length" />
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
      description="Are you sure you want to delete this mindmap? This action cannot be undone." :cancel-action="{
        label: 'Keep',
        color: 'bg-green-500',
      }" :confirm-action="{
        label: 'Delete',
        color: 'bg-gray-500',
      }" @on:cancel="isDelete = false" @on:close="isDelete = false" @on:confirm="confirmedDeleteDiagram()"
    />
  </UModal>

  <UModal :model-value="saveModal" :transition="false">
    <div class="p-8">
      <p class="mb-3">
        {{ isCardExpired ? 'Your card is expired!' : 'Your card details are missing!' }}
      </p>
      <p>
        {{ isCardExpired ? 'Please add a new valid card details.' : 'To continue working with mindmaps, please add card details.' }}
      </p>
      <div class="mt-4 flex justify-end gap-4">
        <UButton v-if="isCardExpired" color="gray" class="" @click="saveDetails(false)">
          Cancel
        </UButton>
        <UButton class="" @click="saveDetails(true)">
          Ok
        </UButton>
      </div>
    </div>
  </UModal>
  <UModal :model-value="inActivePlanModal" :transition="false">
    <div class="p-8">
      <p class="mb-3">
        You do not have an active plan,
      </p>
      <p>upgrade plan now to continue creating mindmaps.</p>
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
