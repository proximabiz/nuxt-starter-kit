<template>
  <div class="flex overflow-y-auto md:overflow-hidden">
    <div class="flex-none">
      <LayoutAppDrawer />
    </div>
    <div class="flex-1">
      <LayoutAppTopBar />
      <UContainer class="ms-16 my-16 pt-5">
        <slot />
      </UContainer>
    </div>
  </div>
</template>
