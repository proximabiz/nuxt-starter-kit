
<script setup lang="ts">
const props = defineProps({
  question: String
});
const questionsAndAnswers = [
  {
    question: 'What are the core components of our service?',
    answer: 'The core components of our service include a user-friendly interface, robust security measures, seamless integration capabilities with other tools, and dedicated customer support to address any issues promptly.'
  },
  {
    question: 'How does our service stand out from competitors?',
    answer: 'Our service stands out by offering unparalleled customization options, employing advanced AI algorithms for personalized user experiences, ensuring data privacy with end-to-end encryption, and supporting a wide range of integrations.'
  },
  {
    question: 'What improvements can we make to enhance user experience?',
    answer: 'To enhance user experience, we can focus on reducing load times, introducing more intuitive navigation features, expanding our help and tutorial sections, and incorporating user feedback into regular updates for continuous improvement.'
  },
  {
    question: 'How can we improve communication in remote teams?',
    answer: 'Improving communication in remote teams can be achieved by implementing regular video call meetings, utilizing collaborative tools that allow for real-time editing and feedback, and establishing clear guidelines on communication protocols and availability.'
  },
  {
    question: 'What tools can enhance our teamwork and collaboration?',
    answer: 'Tools that enhance teamwork and collaboration include project management software like Trello or Asana, communication platforms like Slack or Microsoft Teams, and file-sharing services like Google Drive or Dropbox, all integrated within our service.'
  },
  {
    question: 'How do we maintain team morale and productivity in a virtual environment?',
    answer: 'Maintaining team morale and productivity in a virtual environment can be supported by recognizing individual and team achievements, promoting a healthy work-life balance, organizing virtual team-building activities, and ensuring team members feel valued and heard.'
  },
  {
    question: 'What integrations would most enhance our product’s value?',
    answer: 'Integrations that would most enhance our product’s value include those with popular CRM systems, email marketing platforms, social media networks for marketing automation, and analytics tools for deeper insights into user behavior.'
  },
  {
    question: 'How can we ensure seamless integration with third-party services?',
    answer: 'Ensuring seamless integration with third-party services can be achieved by adhering to standard API protocols, conducting thorough testing for compatibility, offering detailed documentation for developers, and providing dedicated support for integration issues.'
  },
  {
    question: 'Which new features are our users requesting the most?',
    answer: 'Based on user feedback, the most requested features include advanced analytics capabilities, more customizable dashboard options, AI-driven insights for decision making, and enhanced mobile app functionality.'
  },
  {
    question: 'What subscription models best align with our user’s needs?',
    answer: 'The best subscription models for our users include a freemium model for new users to test our service, tiered subscription levels based on usage and features, and flexible pricing for enterprise customers with specific needs.'
  },
  {
    question: 'How can we provide more value in our subscription packages?',
    answer: 'We can provide more value in our subscription packages by offering exclusive content, advanced features, priority support, additional storage space, and special offers for long-term commitments.'
  },
  {
    question: 'What feedback have users given on our current subscription options?',
    answer: 'Users have appreciated the flexibility of our subscription options but have requested more transparent pricing, the ability to customize packages with specific features, and easier upgrade and downgrade options.'
  }
];
// Computed property to find the answer
const selectedAnswer = computed(() => {
  const match = questionsAndAnswers.find(qa => qa.question === props.question);
  return match ? match.answer : 'Question not found.';
});
</script>

<template>
     <div class="ml-4">    
    <p class="text-xl font-bold mt-8">{{ question }}</p>
    <p class="mt-4">{{ selectedAnswer }}</p>   
  </div>
</template>

