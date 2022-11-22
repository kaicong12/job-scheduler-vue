<template>
  <div class="popup-wrapper">
    <div class="request-popup">
      <h2>Edit Employee Tags</h2>

      <label>Assigned Tags</label>
      <Multiselect
          v-model="assignedTag"
          mode="tags"
          placeholder="Select Tags"
          track-by="value"
          label="value"
          :close-on-select="false"
          :options="tagOptions"
          @select="postTagAssignment"
          @deselect="removeTagAssignment"
      />

      <div class="button-wrapper custom-action-row">
        <button class="action-button cancel" type="button" @click="this.$emit('togglePopup')">Cancel</button>
        <button class="action-button done" type="button" @click="this.showConfirmation=true">Done</button>
      </div>

      <!--  Modal component  -->
      <ConfirmationMessage
          v-if="showConfirmation"
          msg="Would you like to confirm your edits?"
          @closeMessage="closeMessage"
          @confirmEdit="confirmEditFn"
      />
    </div>
  </div>
</template>

<script>
import Multiselect from '@vueform/multiselect'
import ConfirmationMessage from "@/modals/ConfirmationMessage";
import {getTag, unsubListTag, allTags, addTag, removeTag} from "@/db/Tags";


export default {
  name: "EditEmployeeTag",
  props: ["employeeID"],
  emits: ["togglePopup"],
  components: {Multiselect, ConfirmationMessage},
  data() {
    return {
      assignedTag: [],
      unsubscribeListener: [unsubListTag],
      branchOptions: [],
      tagOptions: allTags,
      showConfirmation: false,
    }
  },
  created() {
    const [unsubGetTags, tags] = getTag(this.employeeID)
    this.assignedTag = tags
    this.unsubscribeListener.push(unsubGetTags)
  },
  methods: {
    closeMessage() {
      this.showConfirmation = false
    },
    async removeTagAssignment(tagName) {
      await removeTag(this.employeeID, tagName)
    },
    async postTagAssignment(tagName) {
      await addTag(this.employeeID, tagName)
    },
    confirmEditFn() {
      this.showConfirmation = false
      this.$emit('togglePopup')
    }
  }
}
</script>

<style scoped>
.popup-wrapper {
  z-index: 99;
  background-color: rgb(0, 0, 0, 0.2);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.request-popup {
  background-color: white;
  border-radius: 20px;
  width: 50%;
  min-height: 200px;
  max-height: 320px;
  gap: 10px;
  padding: 30px;
  position: relative;
  max-width: 400px;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>