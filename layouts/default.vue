<template>
  <UCard class="app-view">
    <LayoutAppBar />
    <UContainer>
      <UCard>
        <slot />
      </UCard>
    </UContainer>
    <LayoutAppFooter />
  </UCard>
</template>
