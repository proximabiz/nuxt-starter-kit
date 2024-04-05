<script setup lang="ts">
import logo from '@/assets/media/logo.png'
import AboutProduct from '@/assets/media/AboutProduct.png'
import illustration from '@/assets/media/illustration.png'
import partner from '@/assets/media/partners.png'
import input from '@/assets/media/input.png'
import node from '@/assets/media/node.png'
import storage from '@/assets/media/data-storage.png'
import monitoring from '@/assets/media/monitoring.png'
import mindmap from '@/assets/media/mindmap.png'
import flowchart from '@/assets/media/flowchart.png'
import ui from '@/assets/media/ui.png'
import drag from '@/assets/media/drag.png'
import version from '@/assets/media/clock.png'

const features = [
  {
    title: 'User Interface (UI)',
    description: 'An intuitive and user-friendly interface that allows users to create, edit, and navigate through the flow map easily',
    iconSrc: ui,
    bgColor: 'bg-pink-200',
  },
  {
    title: 'Graphical Representation',
    description: 'Visual representation of processes and workflows using graphical elements such as nodes, branches, and connections.',
    iconSrc: illustration,
    bgColor: 'bg-yellow-200',
  },
  {
    title: 'Drag-and-Drop Functionality',
    description: 'Ability to add, rearrange, and connect elements in the flow map using a simple drag-and-drop interface for ease of use.',
    iconSrc: drag,
    bgColor: 'bg-blue-200',
  },
  {
    title: 'Node Customization',
    description: 'Ability to customize nodes with relevant information, labels, icons, or colors to convey specific details about each element in the workflow.',
    iconSrc: node,
    bgColor: 'bg-orange-200',
  },
  {
    title: 'Data Input and Output',
    description: 'Ability to input data in natural language and let AI visualize the output. Helps user to seamlessly analyze the change in impact on the workflow.',
    iconSrc: input,
    bgColor: 'bg-green-200',
  },
  {
    title: 'Real-Time Monitoring',
    description: 'Real-time monitoring capabilities that allow users to observe the progression of workflows and identify potential bottlenecks or inefficiencies.',
    iconSrc: monitoring,
    bgColor: 'bg-orange-200',
  },
  {
    title: 'Import/ Export Diagrams',
    description: 'Generate diagrams using AI and export in the form of .png or JSON. Facility to import JSON for generating mind map.',
    iconSrc: storage,
    bgColor: 'bg-green-200',
  },
  {
    title: 'Collaboration',
    description: 'Bring team together, Diagram can be shared with team members for review or modifications.',
    iconSrc: partner,
    bgColor: 'bg-pink-200',
  },
  {
    title: 'Version Control',
    description: 'View previous versions of mind maps, who modified it and when. Allows to restore any previous version of mind map',
    iconSrc: version,
    bgColor: 'bg-yellow-200',
  },
]
</script>

<template>
  <section class="flex flex-col gap-2 items-center mb-8 mt-10">
    <div class="grid grid-cols-3 gap-12">
      <div class="p-8">
        <img :src="logo" class="" alt="">
      </div>
      <div class="mt-4 col-span-2">
        <p
          class="font-extrabold text-transparent text-3xl bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400"
        >
          What challenges are we solving?
        </p>
        <p class="mt-4">
          Many professionals, especially in the technology, education and enterprises,
          need to create visual representations of their ideas, processes, systems, or structures.
          This could range from developers trying to illustrate the architecture of their software, to managers plotting
          out business processes,
          to educators crafting lesson plans. Traditional methods of creating these diagrams or flowcharts can be:
        </p>
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
      <div class="col-span-2">
        <p
          class="font-extrabold text-transparent text-3xl bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400"
        >
          Why use AI FlowMapper?
        </p>
        <ol class="relative text-gray-700 border-s-2 border-gray-200 dark:border-gray-700 dark:text-gray-400 mt-4">
          <li class="mb-10 ms-20">
            <span
              class="absolute flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full -start-4 ring-4 ring-white dark:ring-gray-900 dark:bg-green-900"
            >
              1
            </span>
            <h3 class="font-medium leading-tight">
              Time Efficiency:
            </h3>
            <p class="text-sm">
              Many people spend unnecessary long time manually creating diagrams. This tool reduces that effort significantly.
            </p>
          </li>
          <li class="mb-10 ms-20">
            <span
              class="absolute flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full -start-4 ring-4 ring-white dark:ring-gray-900 dark:bg-gray-700"
            >
              2
            </span>
            <h3 class="font-medium leading-tight">
              Skill Gap:
            </h3>
            <p class="text-sm">
              Not everyone is skilled in using visual design tools or has an innate ability to layout complex ideas coherently in visual form. The AI assists in bridging this gap.
            </p>
          </li>
          <li class="mb-10 ms-20">
            <span
              class="absolute flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full -start-4 ring-4 ring-white dark:ring-gray-900 dark:bg-gray-700"
            >
              3
            </span>
            <h3 class="font-medium leading-tight">
              Customization & Flexibility:
            </h3>
            <p class="text-sm">
              Often, after creating a diagram, one might want to make changes, which can be cumbersome in traditional tools. Our solution allows easy edits and adjustments.
            </p>
          </li>
          <li class="ms-20">
            <span
              class="absolute flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full -start-4 ring-4 ring-white dark:ring-gray-900 dark:bg-gray-700"
            >
              4
            </span>
            <h3 class="font-medium leading-tight">
              Ease of Use:
            </h3>
            <p class="text-sm">
              By merely utilising GenAI capabilities, users can generate comprehensive visuals without requiring to master the intricacies of a design tool.
            </p>
          </li>
        </ol>
      </div>
      <div class="">
        <img :src="AboutProduct" class="w-full h-full object-fit" alt="">
      </div>
    </div>
  </section>
  <section class="flex flex-col gap-2 items-center mb-8 mt-16">
    <p class="font-extrabold text-transparent text-3xl bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400">
      About AI FlowMapper
    </p>
    <div>
      Unlock the power of visualization with our AI-driven platform, transforming text seamlessly into interactive
      flowcharts and mind maps.
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
  <section class="flex flex-col gap-2 mt-5 items-center mb-8">
    <p class="font-extrabold text-transparent text-3xl bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400">
      Key Features
    </p>
  </section>
  <section>
    <div class="flex flex-wrap justify-center -mx-8">
  <div v-for="(feature, index) in features" :key="index" class="flex justify-center items-center flex-col px-8 mb-16" style="flex: 0 1 calc(33.333% - 16px);">
    <div class="rounded-xl p-6" :class="feature.bgColor">
      <img :src="feature.iconSrc" alt="" width="32px" height="32px">
    </div>
    <h2 class="text-2xl font-semibold mt-8">
      {{ feature.title }}
    </h2>
    <p>{{ feature.description }}</p>
  </div>
</div>

  </section>
  <section class="flex flex-col gap-2 items-center mt-20">
    <p class="font-extrabold text-transparent text-3xl bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400">
      Launching Soon...
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
</template>
