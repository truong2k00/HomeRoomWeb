<script setup lang="ts">
import Quill from "quill";
import { onMounted, ref, watch } from "vue";

interface Props {
  editor: boolean;
  description?: string | null;
}

interface Emit {
  (e: "update:description", value: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emit>();

const showEditor = ref(false);
const editorContent = ref(props.description);
const editorContainer = ref<HTMLElement | null>(null);
let quill: Quill | null = null;

// Hàm khởi tạo editor
const initEditor = () => {
  if (editorContainer.value && !quill) {
    quill = new Quill(editorContainer.value, {
      theme: "snow",
      modules: {
        toolbar: [
          [{ header: "1" }, { header: "2" }, { font: [] }],
          [{ list: "ordered" }, { list: "bullet" }],
          ["bold", "italic", "underline", "strike"],
          [{ align: [] }],
          ["link", "blockquote", "code-block"],
        ],
      },
    });

    quill.on("text-change", () => {
      const content = quill!.root.innerHTML;

      editorContent.value = content;
      emit("update:description", content);
    });
  }
};

// Bật editor
const editContent = () => {
  showEditor.value = true;
  initEditor();

  if (quill && props.description) {
    quill.root.innerHTML = props.description;
    editorContent.value = props.description;
  }
};

// Hủy chỉnh sửa
const cancelContent = () => {
  showEditor.value = false;
  if (quill) quill.root.innerHTML = props.description;

  editorContent.value = props.description;
};

// Theo dõi props thay đổi
watch(
  () => props.description,
  (val) => {
    editorContent.value = val;
    if (quill && !showEditor.value) quill.root.innerHTML = val;
  }
);

onMounted(() => {
  editorContent.value = props.description;
});
</script>

<template>
  <div>
    <!-- Editor Quill -->
    <div v-show="props.editor">
      <div v-show="showEditor" ref="editorContainer" class="quill-editor" />

      <!-- Nút điều khiển -->
      <VBtn v-if="!showEditor" @click="editContent"> Editor </VBtn>
      <span v-else>
        <VRow align="center" class="mb-4">
          <VCol cols="6">
            <VBtn color="secondary" @click="cancelContent">Cancel Editor</VBtn>
          </VCol>
          <VCol cols="6" class="text-right">
            <VBtn color="primary" @click="cancelContent">Save</VBtn>
          </VCol>
        </VRow>
      </span>
    </div>

    <!-- Hiển thị nội dung HTML đã chỉnh sửa -->
    <div class="editor-content" v-html="editorContent" />
  </div>
</template>

<style>
.quill-editor {
  block-size: 200px;
  margin-block-end: 20px;
}

.editor-content .ql-align-center {
  text-align: center !important;
}

.editor-content .ql-align-left {
  text-align: start !important;
}

.editor-content .ql-align-right {
  text-align: end !important;
}

.ql-editor a {
  color: blue;
  text-decoration: underline;
}
</style>
