<script setup lang="ts">

</script>

<template>
  <div class="mt-8 p-8">
    <section class="flex flex-col gap-2 items-center mb-8">
      <p class="text-3xl font-extrabold text-blue-800">Send Us A Message</p>
      <p class="text-4xl font-extrabold text-slate-600">Quick Contact</p>
    </section>
    <section class="grid grid-cols-2 gap-12">
      <div class="flex flex-col gap-8">
        <!-- <UForm :validate="validate" :state="state" class="space-y-4" @submit="onSubmit">
    <UFormGroup label="Email" name="email">
      <UInput v-model="state.email" />
    </UFormGroup>

    <UFormGroup label="Password" name="password">
      <UInput v-model="state.password" type="password" />
    </UFormGroup>

    <UButton type="submit">
      Submit
    </UButton>
  </UForm> -->
        <UInput color="white" variant="outline" placeholder="Your Name" />
        <UInput color="white" variant="outline" placeholder="Your Email" />
        <UInput color="white" variant="outline" placeholder="Your Telephone No." /> 

        <!-- <input type="text" placeholder="Your Name" class="rounded-md">
        <input type="text" placeholder="Your Email" class="rounded-md">
        <input type="text" placeholder="Your Telephone No." class="rounded-md"> -->
      </div>
      <div class="flex flex-col gap-6">
        <UTextarea color="white" variant="outline" placeholder="Write your query/message" />
        <button type="button"
          class="btn text-white bg-blue-700 hover:bg-blue-800 focus:outline-none font-medium rounded-lg text-lg px-6 py-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          Submit
        </button>
      </div>
    </section>
  </div>
</template>
<style scoped>
.btn{
  display: inline-block;
  width: fit-content;
}
</style>
