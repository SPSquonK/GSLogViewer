
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

  div(class="container" v-if="dataTable")
    div(class="table-container")
      table(class="table is-bordered is-striped is-hoverable is-fullwidth")
        thead
          tr
            th #
            th Player
            th Guild
            th Points
            th K/D
            th Kills
            th Death
        tbody
          tr(v-for="(player, i) in dataTable.players" v-bind:key="player.name")
            td
              span(v-if="i == 0 || dataTable.players[i - 1].totalPoints != player.totalPoints")
                | {{ i + 1 }}
            td {{ player.name }}
            td {{ player.guild }}
            td {{ player.totalPoints }}
            td {{ player.kills.length }} / {{ player.death.length }}
            td {{ player.kills.join(", ") }}
            td {{ player.death.join(", ") }}
</template>


<script lang="ts">
import { defineComponent } from 'vue';
import * as GSInterpretation from "../GSInterpretation";

type Data = {
  selectedFileName: string | null;
  content: string | null;
  dataTable: GSInterpretation.Interpretation | null
}

export default defineComponent({

  data(): Data {
    return {
      selectedFileName: null,
      content: null,
      dataTable: null
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

          this.dataTable = GSInterpretation.InterpretLog(this.content);
        } else {
          this.content = "ah bah c'est pas un string";
        }
      });
      fileReader.readAsText(selectedFile, "cp1252");
    }

  }

});
</script>
