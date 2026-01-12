<script setup>
import { ref } from "vue";
import { tagNote } from "./services/api";
import NoteForm from "./components/NoteForm.vue";
import TagButton from "./components/TagButton.vue";
import HomeView from "./views/homeView.vue";
import AppHeader from "./components/AppHeader/AppHeader.vue";
import BaseButton from "./components/BaseButton/BaseButton.vue";
import SearchNote from "./components/SearchNote.vue";
import BaseModal from "./components/Modal/BaseModal.vue";

const tags = ref([]);
const loading = ref(false);
const error = ref(null);
const isModalOpen = ref(false);

const title = ref("Dışarıdan gelen başlık");
const content = ref("Dışarıdan gelen içerik");

function openCreate() {
  selectedNote.value = null;
  isModalOpen.value = true;
}

async function getTagAi(title, content) {
  const note = "Title : " + title + ", Content : " + content;
  loading.value = true;
  error.value = null;
  tags.value = [];
  console.log("gönderilen", note);
  try {
    const result = await tagNote(note);
    tags.value = result.data.tags;
    console.log("taglar:", tags.value);
  } catch (err) {
    error.value = err.response?.data?.error || "Bir hata oluştu";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <main>
    <AppHeader class="pb-5">
      <template #logo>
        <a class="font-bold text-3xl">RCS Notion</a>
      </template>

      <template #nav><SearchNote /> </template>

      <template #actions>
        <BaseButton
          variant="outline"
          class="h-14 backdrop-blur-3xl"
          @click="isModalOpen = true"
          ><span class="">New Note</span
          ><span class="mb-1.5 text-3xl font-light">+</span></BaseButton
        >
      </template>
    </AppHeader>

    <HomeView />

    <BaseModal v-model="isModalOpen">
      <NoteForm
        v-model:title="title"
        v-model:content="content"
        :loading="loading"
        @submit="content"
        class="p-4"
      >
        <template #tags>
          <div class="flex flex-wrap gap-2">
            <TagButton
              v-for="tag in tags"
              :key="tag"
              :label="tag"
              removable
              @click="onTagClick(tag)"
              @remove="onTagRemove(tag)"
            />

            <TagButton>
              <span class="text-green-300">Tag ekle +</span>
            </TagButton>
          </div>

          <BaseButton
            color="secondary"
            :loading="loading"
            :disabled="loading || !content.trim()"
            @click="getTagAi(title, content)"
            class="w-40 ml-auto"
          >
            <span>{{ loading ? "Etiketleniyor..." : "Ai Etiket" }}</span>
          </BaseButton>
        </template>
        <template #footer>
          <div class="flex flex-col items-center">
            <BaseButton variant="outline" class="w-100">kaydet</BaseButton>
            <p v-if="error" style="color: red" class="pt-5">
              Bir sorun oldu, daha sonra terkar dene :(
              {{ error }}
            </p>
          </div>
        </template>
      </NoteForm>
    </BaseModal>
  </main>
</template>
