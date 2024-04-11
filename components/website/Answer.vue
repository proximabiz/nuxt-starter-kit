<script setup lang="ts">
const props = defineProps({
  question: String,
})
const questionsAndAnswers = [
  {
    question: 'What is a Mind Map?',
    answer: 'A visual representation of ideas and concepts for defining a process or solving a problem.',
  },
  {
    question: 'What is an AI FlowMapper?',
    answer: 'AI FlowMapper is smart and powerful AI based Mind Map tool designed by Proxima systems.',
  },
  {
    question: 'Can I have a trial version of the AI FlowMapper?',
    answer: 'Yes, you can create a trail version of the AI FlowMapper and access it for XXXX number of days for free.',
  },
  {
    question: 'What does the "I have more details" checkbox indicate?',
    answer: 'You can select the I have more details check box to add more details on your idea or problem. You can elaborate on your requirements to get more accurate results while generating the Mind Map. ',
  },
  {
    question: 'How do I create a Mind Map using AI FlowMapper?',
    answer: 'Login to your account. Click Get Started and then click + Create New. Enter the required keywords on the subject for which you want to create Mind Map and click Submit. ',
  },
  {
    question: 'What are the various ways in which you can create a Mind Map from AI FlowMapper?',
    answer: 'There are two ways (Data Driven and JSON) in which you can provide the input to generate Mind Map. ',
  },
  {
    question: 'What if I face any issue, how to reach support team?',
    answer: '',
  },
  {
    question: 'How do I create an account for AI FlowMapper?',
    answer: 'Access the Sign Up page. Click Sign Up link, enter the Email Address and Create Password and click Sign Up. Enter the Address and Contact Details to access AI FlowMapper.',
  },
  {
    question: 'Can I edit my account details?',
    answer: 'Yes, you can access My Account on clicking the Profile icon and update the account details. ',
  },
  {
    question: 'How can I reset my password?',
    answer: '',
  },
  {
    question: 'What is Data Driven function way to create Mind Map?',
    answer: 'Data Driven allows you to create Mind Map by adding key word.',
  },
  {
    question: 'What is From JSON function way to create Mind Map?',
    answer: 'From JSON allows you to create Mind Map by adding the JSON data.',
  },
  {
    question: 'Can I download the Mind Map?',
    answer: 'A visual representation of ideas and concepts for defining a process or solving a problem.',
  },
  {
    question: 'Where can I see the Mind Maps that I have created?',
    answer: 'You can see the list of Mind Maps by clicking the My Diagrams icon on top left corner.  My Diagrams provides list of Minds Maps created by you along with the Title of the Mind Map, Last Modified Date, edit and delete actions.',
  },
  {
    question: 'Can I edit my Mind Map?',
    answer: 'Yes, you can edit your Mind Map. Click My Diagrams and click the Edit icon to update your Mind Map.',
  },
  {
    question: 'Can I delete my Mind Map?',
    answer: 'Yes, you can delete your Mind Map. Click My Diagrams and click the Delete icon and click Delete from the confirmation message.',
  },
  {
    question: 'Can I download the Mind Map that I have created?',
    answer: 'Yes, you can download the Mind Map as an image by clicking the Download icon available on top right corner.',
  },
  {
    question: 'Can I export the Mind Map as a JSON file?',
    answer: 'Yes, you can export the Mind Map as JSON file by clicking the Export JSON icon available on top right corner.',
  },
  {
    question: 'Can I check the different versions available for the Mind Map?',
    answer: 'Yes, you can check the version history of the Mind Map by clicking the Diagram Versions icon available on top right corner. You can see the version history along with the date and time when the Mind Map was modified and by whom. You can also click on the required version to view the Mind Map.',
  },
  {
    question: 'Can I change the look and feel of the Mind Map?',
    answer: 'Yes, you can change the look and feel by changing the font and color of the Mind Map. Click on the required node, update the color and font of your choice.',
  },
  {
    question: 'Can I change the font style in the Mind Map?',
    answer: 'Yes, you can change the font style of the Mind Map. Click on the required node, update font style of your choice.',
  },
  {
    question: 'Can I change the color of my font in the Mind Map?',
    answer: 'Yes, you can change the font color the Mind Map. Click on the required node, update color of your choice.',
  },
  {
    question: 'Can I change the background color of a Node in the Mind Map?',
    answer: 'Yes, you can change the background color of the node in the Mind Map. Click on the required node, select Background and click on the required color of your choice.',
  },
  {
    question: 'Can I drag and drop the node?',
    answer: 'Yes, you can drag and drop the node to make a sibling node as child node. You cannot drag and drop a child node and make it as sibling node.',
  },
  {
    question: 'Can I delete or remove a node?',
    answer: 'Yes, you can delete or remove node. Right click on the required node and select Remove Node Delete to remove or delete a node. ',
  },
  {
    question: 'Can I add a Tag?',
    answer: '',
  },
  {
    question: 'Can I add an Icon?',
    answer: '',
  },
  {
    question: 'Can I add an external link or URL to a Node in the Mind Map?',
    answer: 'Yes, you can add the link or URL to the node. Click on the required node, in the URL text box, enter the URL that you want to link to the node. A link icon gets added to the node. On click of the link icon, you will be navigated to the URL that was added to the node.',
  },
  {
    question: 'Can I remove the link or external link that I had added to the Node?',
    answer: 'Yes, you can remove the link or external link that was added to the node. Click on the node which has the link added to it. Remove the link added in the URL text box. ',
  },
  {
    question: 'Can I change the label of the Node?',
    answer: 'Yes, you can change the label of the node. Double click on the required node, update the label as per your need.',
  },
  {
    question: 'Can I add a Child to a Node?',
    answer: 'Yes, you can add a child to the desired node. Right click on the required node where you want to add the child, select Add Child to add a child to the node.',
  },
  {
    question: 'Can I add a Parent to a Node?',
    answer: 'Yes, you can add a parent to the desired node. Right click on the required node where you want to add the parent, select Add Parent to add a parent to the node. ',
  },
  {
    question: 'Can I add a Sibling to a Node?',
    answer: 'Yes, you can add a sibling to the desired node. Right click on the required node where you want to add the sibling, select Add Sibling to add a sibling to the node. ',
  },
  {
    question: 'What is Focus Mode?',
    answer: 'Focus Mode allows you to focus a particular node along with its child and sibling node. Right click on the required node which you want to focus, select Focus Mode to focus  the node. All other nodes will get hidden.',
  },
  {
    question: 'Can I cancel the Focus Mode?',
    answer: 'Yes, you can cancel the Focus Mode. Right click in the Parent node and select Cancel Focus Mode. The Focus Mode for the particular mode will be removed and you can see all the other nodes that were hidden in the Focus Mode. ',
  },
  {
    question: 'Can I Move Up a Node?',
    answer: '',
  },
  {
    question: 'Can I Move Down a Node?',
    answer: '',
  },
  {
    question: 'What is Summary?',
    answer: '',
  },
  {
    question: 'What is Link?',
    answer: '',
  },
  {
    question: 'What are the various plans available for the AI FlowMapper tool?',
    answer: 'Proxima does offer various paid plans that provides additional features, better support, updates and for professional use. You can visit our link for different types of paid version.',
  },
  {
    question: 'Can I cancel Free subscription?',
    answer: '',
  },
  {
    question: 'Can I cancel Paid subscription?',
    answer: '',
  },
  {
    question: 'How to upgrade my subscription?',
    answer: '',
  },
  {
    question: 'What happens after my Free plan gets over?',
    answer: '',
  },
  {
    question: 'How can I renew my subscription?',
    answer: '',
  },
]

// Computed property to find the answer
const selectedAnswer = computed(() => {
  const match = questionsAndAnswers.find(qa => qa.question === props.question)
  return match ? match.answer : 'Question not found.'
})
</script>

<template>
  <div class="ml-4">
    <p class="text-xl font-bold mt-8">
      {{ question }}
    </p>
    <p class="mt-4">
      {{ selectedAnswer }}
    </p>
  </div>
</template>
