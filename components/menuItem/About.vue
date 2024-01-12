 <script setup lang="ts">
import { computed } from 'vue';

const features = computed(() => {
  return [
    {
      name: 'Time Efficiency',
      description:
        'Many people spend undue time manually creating diagrams. This tool reduces that effort significantly.',
      icon: 'mdi-clock'
    },
    {
      name: 'Skill Gap',
      description:
        'Not everyone is skilled in using visual design tools or has an innate ability to layout complex ideas coherently in visual form.',
      icon: 'mdi-auto-fix'
    },
    {
      name: 'Customization & Flexibility',
      description:
        'Often, after creating a diagram, one might want to make changes, which can be cumbersome in traditional tools.',
      icon: 'mdi-star'
    },
    {
      name: 'Ease of Use',
      description:
        "By merely answering the AI's queries, users can generate comprehensive visuals without needing to master the intricacies of a design tool.",
      icon: 'mdi-draw'
    }
  ];
});
</script>

<template>
  <div class="mt-8">
    <section class="flex flex-col gap-2 items-center mb-8">
      <p class="text-2xl font-bold text-slate-700">What We're Trying to Solve</p>
      <p class="text-lg text-slate-800">We tried to addresses the following challenges by providing an
          automated method to generate visual diagrams.</p>
    </section>
  </div>
</template>
 