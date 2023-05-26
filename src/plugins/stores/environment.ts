import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useEnvironmentStore = defineStore('environment', () => {
  // Update speed of main loop (milliseconds per month)
  const speed = ref(1000);

  return { speed };
});
