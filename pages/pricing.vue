<script lang="ts" setup>
import { ref } from "vue";

// const isChecked = ref(false);
</script>

<template>
  <div class="flex flex-col items-center">
    <span class="text-3xl font-medium">Choose Your AI Flow Mapper Plan</span>
    <div class="rounded-full border mt-2">
      <label for="Toggle4" class="inline-flex items-center p-1 cursor-pointer dark:bg-gray-300 dark:text-gray-800">
        <input id="Toggle4" type="checkbox" class="hidden peer" />
        <span class="px-3 py-1 rounded-full text-white font-medium bg-indigo-600">Monthly</span>
        <span class="px-3 py-1">Annually</span>
      </label>
    </div>
  </div>

  <div class="max-w-screen-xl mx-12 px-4 py-8 sm:px-6 sm:py-4 lg:px-8 lg:py-4 mb-4 text-sm">
    <div class="grid place-items-center grid-cols-1 gap-4 sm:grid-cols-2 sm:items-stretch md:grid-cols-3 md:gap-24">
      <div class="divide-gray-200 rounded-2xl border border-gray-200 shadow-sm">
        <div class="p-4 sm:pt-4 sm:pb-0">
          <h2 class="text-lg font-medium text-gray-900">
            Free
            <span class="sr-only">Plan</span>
          </h2>
          <p class="text-gray-700">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </p>
          <!-- <p class="mt-2 sm:mt-4"> -->
            <strong class="text-3xl font-bold text-gray-900 sm:text-3xl">
              0$
            </strong>
            <span class="text-sm font-medium text-gray-700">/month</span>
          <!-- </p> -->
          <a class="mt-2 block rounded border border-indigo-600 bg-indigo-600 px-8 py-3 text-center text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500 sm:mt-2"
            href="#">
            Get Started
          </a>
        </div>
        <div class="p-2 sm:px-4">
          <p class="text-lg font-medium text-gray-900 sm:text-xl">
            What's included:
          </p>
          <ul class="mt-2 space-y-2 sm:mt-2">
            <li class="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="h-5 w-5 text-indigo-700">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <span class="text-gray-700"> 10 users </span>
            </li>
            <li class="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="h-5 w-5 text-indigo-700">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <span class="text-gray-700"> 2GB of storage </span>
            </li>
            <li class="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="h-5 w-5 text-indigo-700">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <span class="text-gray-700"> Email support </span>
            </li>
            <li class="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="h-5 w-5 text-red-700">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span class="text-gray-700"> Help center access </span>
            </li>
            <li class="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="h-5 w-5 text-red-700">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span class="text-gray-700"> Phone support </span>
            </li>
            <li class="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="h-5 w-5 text-red-700">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span class="text-gray-700"> Community access </span>
            </li>
          </ul>
        </div>
      </div>
      <div class="divide-gray-200 rounded-2xl border border-gray-200 shadow-sm">
        <div class="p-4 sm:pt-4 sm:pb-0">
          <h2 class="text-lg font-medium text-gray-900">
            Pro
            <span class="sr-only">Plan</span>
          </h2>
          <p class="text-gray-700">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </p>
          
            <strong class="text-3xl font-bold text-gray-900 sm:text-3xl">
              30$
            </strong>
            <span class="text-sm font-medium text-gray-700">/month</span>
       
          <a class="mt-2 block rounded border border-indigo-600 bg-indigo-600 px-8 py-3 text-center text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500 sm:mt-2"
            href="#">
            Get Started
          </a>
        </div>
        <div class="p-2 sm:px-4">
          <p class="text-lg font-medium text-gray-900 sm:text-xl">
            What's included:
          </p>
          <ul class="mt-2 space-y-2 sm:mt-2">
            <li class="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="h-5 w-5 text-indigo-700">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <span class="text-gray-700"> 20 users </span>
            </li>
            <li class="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="h-5 w-5 text-indigo-700">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <span class="text-gray-700"> 5GB of storage </span>
            </li>
            <li class="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="h-5 w-5 text-indigo-700">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <span class="text-gray-700"> Email support </span>
            </li>
            <li class="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="h-5 w-5 text-indigo-700">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <span class="text-gray-700"> Help center access </span>
            </li>
            <li class="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="h-5 w-5 text-red-700">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span class="text-gray-700"> Phone support </span>
            </li>
            <li class="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="h-5 w-5 text-red-700">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span class="text-gray-700"> Community access </span>
            </li>
          </ul>
        </div>
      </div>
      <div class=" divide-gray-200 rounded-2xl border border-gray-200 shadow-sm">
        <div class="p-4 sm:pt-4 sm:pb-0">
          <h2 class="text-lg font-medium text-gray-900">
            Enterprise
            <span class="sr-only">Plan</span>
          </h2>
          <p class="text-gray-700">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </p>
          
            <strong class="text-3xl font-bold text-gray-900 sm:text-3xl">
              Custom
            </strong>   
          <a class="mt-2 block rounded border border-indigo-600 bg-indigo-600 px-8 py-3 text-center text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500 sm:mt-2"
            href="#">
            Contact Sales
          </a>
        </div>
        <div class="p-2 sm:px-4">
          <p class="text-lg font-medium text-gray-900 sm:text-xl">
            What's included:
          </p>
          <ul class="mt-2 space-y-2 sm:mt-2">
            <li class="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="h-5 w-5 text-indigo-700">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <span class="text-gray-700"> 50 users </span>
            </li>
            <li class="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="h-5 w-5 text-indigo-700">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <span class="text-gray-700"> 20GB of storage </span>
            </li>
            <li class="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="h-5 w-5 text-indigo-700">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <span class="text-gray-700"> Email support </span>
            </li>
            <li class="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="h-5 w-5 text-indigo-700">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <span class="text-gray-700"> Help center access </span>
            </li>
            <li class="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="h-5 w-5 text-indigo-700">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <span class="text-gray-700"> Phone support </span>
            </li>
            <li class="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="h-5 w-5 text-indigo-700">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <span class="text-gray-700"> Community access </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
