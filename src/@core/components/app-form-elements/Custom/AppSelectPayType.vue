<script lang="ts" setup>
import { VLabel, VSelect } from "vuetify/components";
import { computed, onMounted, ref, useAttrs, watch } from "vue";
import PayTypeApi from "@/Api/Business/PayTypeBusiness";
import { GetByPackage } from "@/Common/enum/Pay/PayCode";

// Props
const props = defineProps<{
  businessTypeId: string;
  modelValue: string | null;
}>();

// Emits
const emit = defineEmits<{
  (e: "update:modelValue", value: string | null): void;
}>();

// Danh sách items
const items = ref<{ key: string; value: string; icon: {} }[]>([]);

// Load dữ liệu từ API
const loadData = async () => {
  if (!props.businessTypeId) {
    return;
  }

  try {
    const res = await PayTypeApi.GetAll(props.businessTypeId);
    items.value = res.map((item: any) => ({
      key: item.id,
      value: GetByPackage(item.package)?.text || "",
      icon: GetByPackage(item.package)?.icon || "",
    }));

    // Nếu modelValue đang null và có item → chọn item đầu tiên
    if (!props.modelValue && items.value.length > 0) {
      emit("update:modelValue", items.value[0].key);
    }
  } catch (error) {
    console.error("Lỗi load PayType:", error);
  }
};

// Khởi tạo
onMounted(async () => {
  await loadData();
});

// Theo dõi thay đổi businessTypeId
watch(
  () => props.businessTypeId,
  async () => {
    await loadData();
  }
);

// Danh sách cho VSelect
const computedItems = computed(() =>
  items.value.map((item) => ({
    title: item.value,
    value: item.key,
    icon: item.icon,
  }))
);

// Model binding
const modelValue = computed<string | null>({
  get() {
    const allKeys = items.value.map((i) => i.key);
    return allKeys.includes(props.modelValue || "") ? props.modelValue : null;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});

// Xử lý label và id tự động
const attrs = useAttrs();
const label = computed(() => attrs.label as string | undefined);
const elementId = computed(() => {
  const token = attrs.id || attrs.label;
  return token
    ? `app-select-${token}-${Math.random().toString(36).slice(2, 7)}`
    : undefined;
});
</script>
<template>
  <div>
    <div class="app-select flex-grow-1" :class="$attrs.class">
      <VLabel
        v-if="label"
        :for="elementId"
        class="mb-1 text-body-2 text-high-emphasis"
        :text="label"
      />

      <VSelect
        :id="elementId"
        :items="computedItems"
        :item-title="'title'"
        :item-value="'value'"
        :model-value="modelValue"
        @update:modelValue="modelValue = $event"
        variant="outlined"
        :searchable="true"
        v-bind="{ ...$attrs, class: null, label: undefined }"
        :menu-props="{
          contentClass: [
            'app-inner-list',
            'app-select__content',
            'v-select__content',
            $attrs.multiple !== undefined ? 'v-list-select-multiple' : '',
          ],
        }"
      >
        <template v-for="[name, fn] in Object.entries($slots)" :key="name">
          <slot :name="name" v-bind="fn ? fn() : {}" />
        </template>
      </VSelect>
    </div>
  </div>
</template>
<!-- 
<script lang="ts" setup>
import { computed, onMounted, ref, useAttrs, watch } from "vue";
import { VLabel, VSelect } from "vuetify/components";
import roleAuthenticationApi from "@/Api/authen/roleAuthenticationApi";
import type { RoleDTO } from "@/models/Role&UserAbility/RoleDTO";

import PayTypeApi from "@/Api/Business/PayTypeBusiness";
import { GetByPackage } from "@/Common/enum/Pay/PayCode";
import { PayTypeBusinessDTORes } from "@/models/PayTypeBusiness/PayTypeBusinessDTO";

// Nhận props và emit sự kiện
const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

// computed để liên kết với v-model
const modelValue = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val), // Cập nhật khi giá trị thay đổi
});

const keyword = ref("");
const dataPaytype = ref<PayTypeBusinessDTORes[]>([]);

const paydata = ref<{ key: string; value: string; icon: {} }[]>([]);

const loadRole = () => {
  PayTypeApi.GetAll(props.modelValue)
    .then((res) => {
      dataPaytype.value = res;
      paydata.value = res.map((item: any) => ({
        key: item.id,
        value: GetByPackage(item.package)?.text || "",
        icon: GetByPackage(item.package)?.icon || "",
      }));
      console.log(dataPaytype.value);
      console.log(paydata.value);
      console.log(res);
      console.log(props.modelValue);
    })
    .catch((err) => console.error("Lỗi khi load role:", err));
};

onMounted(() => {
  loadRole();
});

// Theo dõi thay đổi giá trị
watch(modelValue, (newVal) => {
  modelValue.value = newVal;
  emit("update:modelValue", modelValue.value);
});

const attrs = useAttrs();
const label = computed(() => attrs.label as string | undefined);

const elementId = computed(() => {
  const _elementIdToken = attrs.id || attrs.label;

  return _elementIdToken
    ? `app-select-${_elementIdToken}-${Math.random().toString(36).slice(2, 7)}`
    : undefined;
});
</script>

<template>
  <div class="app-select flex-grow-1" :class="$attrs.class">
    <VLabel
      v-if="label"
      :for="elementId"
      class="mb-1 text-body-2 text-high-emphasis"
      :text="label"
    />

    <VSelect
      :id="elementId"
      v-model="modelValue"
      :items="paydata"
      item-title="value"
      item-value="key"
      :multiple="Array.isArray(modelValue)"
      variant="outlined"
      :clearable="$attrs.clearable !== undefined"
      v-bind="{ ...$attrs, class: null, label: undefined }"
      :menu-props="{
        contentClass: [
          'app-inner-list',
          'app-select__content',
          'v-select__content',
          $attrs.multiple !== undefined ? 'v-list-select-multiple' : '',
        ],
      }"
    >
      <template v-for="(_, name) in $slots" #[name]="slotProps">
        <slot :name="name" v-bind="slotProps || {}" />
      </template>
    </VSelect>
  </div>
</template> -->
