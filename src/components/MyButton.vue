<template>
  <button class="btn btn-primary" type="submit" 
    :disabled="disabled"
    @click="emit('save')" >{{ name }}</button>
</template>

<script setup lang="ts">

defineProps({
  disabled: {
    type: Boolean, 
    default:false
  },
  name: String
})

const emit = defineEmits(['save'])

</script>
