<template>
  <div class="flex">
    <div class="flex-none">
      <LayoutAppDrawer />
    </div>
    <div class="flex-1">
      <LayoutAppTopBar />
      <UContainer class="my-16 ps-16 pt-5">
        <slot />
      </UContainer>
    </div>
  </div>
</template>
