<template>
  <div class="editor-wrapper">
    <div class="editor-toolbar">
      <v-btn
        v-for="(button, index) in toolbarButtons"
        :key="index"
        icon
        size="small"
        :color="isActive(button.activeCheck) ? 'primary' : 'grey-lighten-3'"
        @click="button.command"
        :title="button.label"
      >
        <v-icon size="20">{{ button.icon }}</v-icon>
      </v-btn>
    </div>

    <EditorContent
      v-model="model"
      @click="focusEditor"
      :editor="editor"
      class="editor-content"
    />
  </div>
</template>

<script setup>
import { Editor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";

const editor = ref(null);
const model = defineModel();

onMounted(() => {
  editor.value = new Editor({
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: false }),
    ],
    content: "<p>여기에 글을 작성하세요 ✏️</p>",
    onUpdate({ editor }) {
      model.value = editor.getHTML();
    },
  });
});

onBeforeUnmount(() => {
  editor.value?.destroy();
});

const cmd = (command, arg = null) => {
  if (!editor.value) return;
  const chain = editor.value.chain().focus();
  if (arg) {
    chain[command](arg).run();
  } else {
    chain[command]().run();
  }
};

const insertLink = () => {
  const url = prompt("링크 주소를 입력하세요");
  if (!url) return;
  editor.value.chain().focus().setLink({ href: url }).run();
};

const isActive = (markOrAttrs) => {
  return editor.value?.isActive(markOrAttrs);
};

const toolbarButtons = [
  {
    label: "굵게",
    icon: "mdi-format-bold",
    command: () => cmd("toggleBold"),
    activeCheck: "bold",
  },
  {
    label: "기울임",
    icon: "mdi-format-italic",
    command: () => cmd("toggleItalic"),
    activeCheck: "italic",
  },
  {
    label: "취소선",
    icon: "mdi-format-strikethrough",
    command: () => cmd("toggleStrike"),
    activeCheck: "strike",
  },
  {
    label: "번호 목록",
    icon: "mdi-format-list-numbered",
    command: () => cmd("toggleOrderedList"),
    activeCheck: "orderedList",
  },
  {
    label: "글머리 목록",
    icon: "mdi-format-list-bulleted",
    command: () => cmd("toggleBulletList"),
    activeCheck: "bulletList",
  },
  {
    label: "왼쪽 정렬",
    icon: "mdi-format-align-left",
    command: () => cmd("setTextAlign", "left"),
    activeCheck: { textAlign: "left" },
  },
  {
    label: "가운데 정렬",
    icon: "mdi-format-align-center",
    command: () => cmd("setTextAlign", "center"),
    activeCheck: { textAlign: "center" },
  },
  {
    label: "오른쪽 정렬",
    icon: "mdi-format-align-right",
    command: () => cmd("setTextAlign", "right"),
    activeCheck: { textAlign: "right" },
  },
  {
    label: "인용구",
    icon: "mdi-format-quote-close",
    command: () => cmd("toggleBlockquote"),
    activeCheck: "blockquote",
  },
  {
    label: "코드블럭",
    icon: "mdi-code-tags",
    command: () => cmd("toggleCodeBlock"),
    activeCheck: "codeBlock",
  },
  {
    label: "구분선",
    icon: "mdi-minus",
    command: () => cmd("setHorizontalRule"),
    activeCheck: "",
  },
  {
    label: "링크 삽입",
    icon: "mdi-link-variant",
    command: insertLink,
    activeCheck: "link",
  },
];

const focusEditor = () => {
  if (editor.value && !editor.value.isFocused) {
    editor.value.commands.focus();
  }
};
</script>

<style scoped>
.editor-wrapper {
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
}

.editor-toolbar {
  padding: 8px;
  border-bottom: 1px solid #eee;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  background-color: #fafafa;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.editor-content {
  padding: 16px;
  min-height: 200px;
}

.editor-content:focus,
.editor-content:focus-visible,
.editor-content *:focus {
  outline: none !important;
  box-shadow: none !important;
}
</style>
