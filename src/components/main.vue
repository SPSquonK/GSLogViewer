
<template lang="pug">
div(class="section")
  div(class="container")
    h1(class="title")
      | SquonK's Guild Siege Viewer
  
  div(class="container")
    form
      div(class="file")
        label(class="file-label")
          input(
            class="file-input"
            type="file"
            name="gslogfile"
            v-on:change="changedFile"
          )
          span(class="file-cta")
            span(class="file-icon")
              i(class="fas fa-upload")
            span(class="file-label")
              | Your guild siege log file
        span(v-if="selectedFileName" class="file-name")
          | {{ selectedFileName }}
    
  div(class="container" v-if="content")
    textarea
      | {{ content }}

</template>


<script lang="ts">
import { defineComponent } from 'vue';

type Data = {
  selectedFileName: string | null;
  content: string | null;
}

export default defineComponent({

  data(): Data {
    return {
      selectedFileName: null,
      content: null
    };
  },

  methods: {

    changedFile(event: Event) {
      const inputElement = event.target as HTMLInputElement;
      const selectedFile = inputElement.files?.[0];
      if (selectedFile === undefined) return;

      this.selectedFileName = selectedFile.name;

      const fileReader = new FileReader();
      fileReader.addEventListener('load', () => {
        if (typeof fileReader.result == 'string') {
          this.content = fileReader.result;
        } else {
          this.content = "ah bah c'est pas un string";
        }
      });
      fileReader.readAsText(selectedFile, "cp1252");
    }

  }

});
</script>
