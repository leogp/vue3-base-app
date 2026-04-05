<template>
  <v-row dense class="mb-4">
    <v-col cols="12" sm="6" md="5">
      <v-text-field
        v-model="search"
        label="Search by title or body"
        prepend-inner-icon="mdi-magnify"
        clearable
        variant="outlined"
        density="compact"
        hide-details
      />
    </v-col>
    <v-col cols="12" sm="6" md="3">
      <v-select
        v-model="userId"
        :items="USER_IDS"
        label="Filter by User ID"
        clearable
        variant="outlined"
        density="compact"
        hide-details
      />
    </v-col>
    <v-col cols="auto" class="d-flex align-center">
      <v-btn
        v-if="search || userId"
        icon="mdi-close"
        variant="text"
        size="small"
        density="compact"
        @click="reset"
      />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import type { IPostFilter } from '@/interfaces/post'
import { usePostFilters } from '@/composables/usePostFilters'

const emit = defineEmits<{
  change: [filters: IPostFilter]
}>()

const USER_IDS = Array.from({ length: 10 }, (_, i) => i + 1)

const { search, userId, reset } = usePostFilters((filters) => emit('change', filters))
</script>
