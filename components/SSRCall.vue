<script setup lang="ts">
interface Rating {
  rate: number
  count: number
}

interface Product {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  rating: Rating
}

const { data: products, pending } = useFetch<Array<Product>>('https://fakestoreapi.com/products', {
  params: {
    limit: 12,
  },
  lazy: true,
})
</script>

<template>
  <!-- <pre>{{ data?.products }}</pre> -->

  <div v-if="pending">
    please wait...
  </div>
  <div v-else class="bg-white">
    <div class="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-12 lg:max-w-7xl lg:px-8">
      <div class="flex justify-between">
        <h2 class="text-2xl font-bold tracking-tight text-gray-900">
          Products
        </h2>
        <UButton color="primary" variant="outline" label="Shuffle" icon="lucide:shuffle" size="sm" />
      </div>

      <div class="mt-6 grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 lg:grid-cols-6">
        <div v-for="product in products" :key="product.id" class="group block overflow-hidden rounded border border-gray-200 p-6">
          <div class="relative h-[175px]">
            <img
              :src="product.image" :alt="product.description"
              class="absolute inset-0 w-full object-cover opacity-100 group-hover:opacity-80"
            >
          </div>

          <div class="relative bg-white pt-3">
            <h3 class="text-sm text-gray-700 group-hover:underline group-hover:underline-offset-4">
              Limited Edition Sports Trainer
            </h3>

            <p class="mt-1.5 tracking-wide text-gray-900">
              $189.99
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
