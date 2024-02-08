<script setup lang="ts">
import logo from '@/assets/media/logo.png'
import efficiency from '@/assets/media/efficiency.png'
import direction from '@/assets/media/direction.png'
import arrow from '@/assets/media/arrow.png'
import learning from '@/assets/media/learning.png'
import storage from '@/assets/media/data-storage.png'
import support from '@/assets/media/support.png'
import mindmap from '@/assets/media/mindmap.png'
import flowchart from '@/assets/media/flowchart.png'

const features = [
  {
    title: 'Time Efficiency',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit',
    iconSrc: efficiency,
    bgColor: 'bg-pink-200',
  },
  {
    title: 'Collaboration and Flexibility',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit',
    iconSrc: direction,
    bgColor: 'bg-yellow-200',
  },
  {
    title: 'Easy to download',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit',
    iconSrc: arrow,
    bgColor: 'bg-blue-200',
  },
  {
    title: 'Skill gap',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit',
    iconSrc: learning,
    bgColor: 'bg-orange-200',
  },
  {
    title: 'Save your work',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit',
    iconSrc: storage,
    bgColor: 'bg-green-200',
  },
  {
    title: '24/7 support',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit',
    iconSrc: support,
    bgColor: 'bg-pink-200',
  },

]
</script>

<template>
  <section class="flex flex-col gap-2 items-center mb-8 mt-10">
    <div class="grid grid-cols-4 gap-12">
      <div class="col-span-1">
        <img :src="logo" class="w-full h-full object-fit" alt="">
      </div>
      <div class="mt-4 col-span-3">
        <h1
          class="font-extrabold text-transparent text-3xl bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400">
          What challenges are we solving?</h1>
        <p class="mt-4 indent-12">Many professionals, especially in the technology, education and enterprises,
          need to create visual representations of their ideas, processes, systems, or structures.
          This could range from developers trying to illustrate the architecture of their software, to managers plotting
          out business processes,
          to educators crafting lesson plans. Traditional methods of creating these diagrams or flowcharts can be:</p>
        <ul class="list-disc flex flex-col gap-2 mt-4">
          <li>Time-consuming.</li>
          <li>Require design or visual skills which not everyone possesses.</li>
          <li>Difficult to modify on-the-fly during presentations or discussions.</li>
        </ul>
      </div>
    </div>
  </section>
  <section class="flex flex-col gap-2 items-center mb-8 mt-10">
    <div class="grid grid-cols-3 gap-12">
      <div class="">
        <img src="" class="w-full h-full object-fit" alt="">
      </div>
      <div class="col-span-2">
        <h1
          class="font-extrabold text-transparent text-3xl bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400">
          Why use AI Flow Mapper?</h1>
        <ol class="relative text-gray-700 border-s-2 border-gray-200 dark:border-gray-700 dark:text-gray-400 mt-4">
          <li class="mb-10 ms-6">
            <span
              class="absolute flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full -start-4 ring-4 ring-white dark:ring-gray-900 dark:bg-green-900">
              1
            </span>
            <h3 class="font-medium leading-tight">Time Efficiency:</h3>
            <p class="text-sm">Many people spend undue time manually creating diagrams. This tool reduces that effort significantly.</p>
          </li>
          <li class="mb-10 ms-6">
            <span
              class="absolute flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full -start-4 ring-4 ring-white dark:ring-gray-900 dark:bg-gray-700">
              2
            </span>
            <h3 class="font-medium leading-tight">Skill Gap</h3>
            <p class="text-sm">Not everyone is skilled in using visual design tools or has an innate ability to layout complex ideas coherently in visual form. The AI assists in bridging this gap.</p>
          </li>
          <li class="mb-10 ms-6">
            <span
              class="absolute flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full -start-4 ring-4 ring-white dark:ring-gray-900 dark:bg-gray-700">
              3
            </span>
            <h3 class="font-medium leading-tight">Customization & Flexibility:</h3>
            <p class="text-sm">Often, after creating a diagram, one might want to make changes, which can be cumbersome in traditional tools. Your solution allows easy edits and adjustments.</p>
          </li>
          <li class="ms-6">
            <span
              class="absolute flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full -start-4 ring-4 ring-white dark:ring-gray-900 dark:bg-gray-700">
              4
            </span>
            <h3 class="font-medium leading-tight">Ease of Use:</h3>
            <p class="text-sm">By merely answering the AI's queries, users can generate comprehensive visuals without needing to master the intricacies of a design tool.</p>
          </li>
        </ol>
      </div>
    </div>
  </section>
  <section class="flex flex-col gap-2 items-center mb-8 mt-16">
    <p class="text-2xl font-bold text-slate-700">
      About The Product
    </p>
    <div>
      Unlock the power of visualization with our AI-driven platform, transforming text seamlessly into interactive
      flowcharts and mind maps.Many professionals,
    </div>
    <p class="text-2xl font-semibold">
      Mindmap
    </p>
    <div class="grid grid-cols-2 gap-12">
      <div>
        <img :src="mindmap" class="" alt="">
      </div>
      <div class="mt-4">
        <ul class="list-disc flex flex-col gap-2">
          <li>Create dynamic hierarchies for clear thought structure.</li>
          <li>Watch ideas come alive through colorful, intuitive representations.</li>
          <li>Map tasks, priorities, and deadlines for streamlined productivity.</li>
          <li>Real-time engagement for teams to contribute and refine ideas.</li>
          <li>Modify, add, or rearrange effortlessly as ideas evolve.</li>
          <li>Transform mind maps into powerful study aids or project overviews</li>
          <li>Unleash the potential of your text, transforming it into vibrant mind maps.</li>
        </ul>
      </div>
    </div>
  </section>
  <section class="flex flex-col gap-2 items-center mb-8">
    <p class="text-2xl font-bold text-slate-700">
      Lunching Soon...
    </p>
    <div>
      Unlock the power of visualization with our AI-driven platform, transforming text seamlessly into interactive
      flowcharts and mind maps.
    </div>
    <p class="text-2xl font-semibold">
      Flowchart
    </p>
    <div class="grid grid-cols-2 gap-12">
      <div class="mt-4">
        <ul class="list-disc flex flex-col gap-2">
          <li> Visual representation for clear understanding of processes.</li>
          <li>Detailed process examination to identify improvements.</li>
          <li>Effective tool for conveying workflows and systems.</li>
          <li>Presents pathways and decision points within processes.</li>
          <li>Illustrates project workflows, dependencies, and milestones.</li>
          <li>Provides a visual baseline for refining processes over time.</li>
          <li>Encourages cross-functional understanding and cooperation.</li>
        </ul>
      </div>
      <div><img :src="flowchart" class="" alt=""></div>
    </div>
  </section>
  <section class="flex flex-col gap-2 mt-5 items-center mb-8">
    <p class="text-2xl font-bold text-slate-700">
      What We're Trying to Solve
    </p>
  </section>
  <section>
    <div class="grid grid-cols-3 gap-16">
      <div v-for="(feature, index) in features" :key="index" class="flex justify-center items-center flex-col">
        <div class="rounded-xl p-6" :class="feature.bgColor">
          <img :src="feature.iconSrc" alt="" width="32px" height="32px">
        </div>
        <h2 class="text-2xl font-semibold">
        {{ feature.title }}
      </h2>
      <p>{{ feature.description }}</p>
    </div>
  </div>
</section></template>
