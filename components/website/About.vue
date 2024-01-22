<script setup lang="ts">
import diamond from "@/assets/media/diamond.png"

const features = [
  {
    title: "Free Forever",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit",
    iconSrc: diamond,
    bgColor: "bg-pink-200"
  },
  {
    title: "Group Collaboration",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit",
    iconSrc: diamond,
    bgColor: "bg-yellow-200"
  },
  {
    title: "Save Your Work",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit",
    iconSrc: diamond,
    bgColor: "bg-blue-200"
  },
  {
    title: "Free Forever",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit",
    iconSrc: diamond,
    bgColor: "bg-orange-200"
  },
  {
    title: "Free Forever",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit",
    iconSrc: diamond,
    bgColor: "bg-green-200"
  },
  {
    title: "Free Forever",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit",
    iconSrc: diamond,
    bgColor: "bg-pink-200"
  },

];
</script>


<template>
  
    <section class="flex flex-col gap-2 items-center mb-8">
      <p class="text-2xl font-bold text-slate-700">
        About The Product
      </p>
      <div>Unlock the power of visualization with our AI-driven platform, transforming text seamlessly into interactive
        flowcharts and mind maps.</div>
        <div class="grid grid-cols-2 gap-12">
        <div>image</div>
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
      <div>Unlock the power of visualization with our AI-driven platform, transforming text seamlessly into interactive
        flowcharts and mind maps.</div>
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
        <div>image</div>
      </div>
    </section>
  
  <section class="flex flex-col gap-2 items-center mb-8 mt-4">
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
        <h2 class="text-2xl font-semibold">{{ feature.title }}</h2>
        <p>{{ feature.description }}</p>
      </div>
    </div>
  </section>
</template>
