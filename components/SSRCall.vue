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
    <div class="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
      <h2 class="text-2xl font-bold tracking-tight text-gray-900">
        Products
      </h2>

      <div class="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        <!-- <div v-for="product in products" :key="product.id" class="group relative border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <div class="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
            <img :src="product.image" :alt="product.description" class="h-full w-full object-cover object-center lg:h-full lg:w-full">
          </div>
          <div class="mt-4 flex justify-between px-2">
            <div>
              <h3 class="text-sm text-gray-700">
                <a href="#">
                  <span aria-hidden="true" class="absolute inset-0" />
                  {{ product.title }}
                </a>
              </h3>
              <p class="mt-1 text-sm text-gray-500">
                {{ product.category }}
              </p>
            </div>
            <p class="text-sm font-medium text-gray-900">
              ${{ product.price }}
            </p>
          </div>
        </div> -->

        <div v-for="product in products" :key="product.id" class="group block overflow-hidden rounded border border-gray-200 p-6">
          <div class="relative h-[350px]">
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
