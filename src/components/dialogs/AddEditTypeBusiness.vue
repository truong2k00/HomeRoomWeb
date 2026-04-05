<script setup lang="ts">
import { VForm } from "vuetify/components/VForm";

interface typeBusiness {
  id: string;
  name: string;
}

interface Props {
  typeBusiness?: typeBusiness;
  isDialogVisible: boolean;
}
interface Emit {
  (e: "update:isDialogVisible", value: boolean): void;
  (e: "update:typeBusiness", value: typeBusiness): void;
}

const props = withDefaults(defineProps<Props>(), {
  typeBusiness: () => ({
    id: "",
    name: "",
  }),
});

const emit = defineEmits<Emit>();

const isSelectAll = ref(false);

watch(props, () => {});

const onSubmit = () => {
  emit("update:typeBusiness", props.typeBusiness);
  emit("update:isDialogVisible", false);
  isSelectAll.value = false;
};

const onReset = () => {
  emit("update:isDialogVisible", false);
  isSelectAll.value = false;
};
</script>

<template>
  <div>
    <VDialog
      :width="$vuetify.display.smAndDown ? 'auto' : 900"
      :model-value="props.isDialogVisible"
      @update:model-value="onReset"
    >
      <!-- 👉 Dialog close btn -->
      <DialogCloseBtn @click="onReset" />

      <VCard class="pa-sm-8 pa-5">
        <!-- 👉 Title -->
        <VCardItem class="text-center">
          <VCardTitle class="text-h3 mb-3">
            {{ props.typeBusiness.id ? "Edit" : "Add New" }} Type
          </VCardTitle>
          <p class="text-base mb-0">Set Type Business</p>
        </VCardItem>

        <VCardText class="mt-6">
          <!-- 👉 Form -->
          <VForm ref="refPermissionForm">
            <h6 class="text-h4 mt-8 mb-3">Type Business</h6>
            <AppTextField
              v-model="props.typeBusiness.id"
              label="Id Type"
              placeholder="Enter id Name"
            />
            <AppTextField
              v-model="props.typeBusiness.name"
              label="Type Name"
              placeholder="Enter Type Name"
            />

            <!-- 👉 Actions button -->
            <div class="d-flex align-center justify-center gap-3 mt-6">
              <VBtn @click="onSubmit"> Submit </VBtn>

              <VBtn color="secondary" variant="tonal" @click="onReset">
                Cancel
              </VBtn>
            </div>
          </VForm>
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>

<style lang="scss">
.permission-table {
  td {
    border-block-end: 1px solid
      rgba(var(--v-border-color), var(--v-border-opacity));
    padding-block: 0.5rem;

    .v-checkbox {
      min-inline-size: 4.75rem;
    }

    &:not(:first-child) {
      padding-inline: 0.5rem;
    }

    .v-label {
      white-space: nowrap;
    }
  }
}
</style>
