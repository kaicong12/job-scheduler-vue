<template>
  <div class="popup-wrapper">
    <div class="request-popup">
      <h2>Request Tags/Branches</h2>

      <label>Assigned Branches</label>
      <Multiselect
        v-model="assignedBranch"
        mode="tags"
        placeholder="Select Branches"
        track-by="value"
        label="value"
        :close-on-select="false"
        :options="branchOptions"
        @deselect="removeBranch"
      />

      <label>Assigned Tags</label>
      <Multiselect
        v-model="assignedTag"
        mode="tags"
        placeholder="Select Tags"
        track-by="value"
        label="value"
        :close-on-select="false"
        :options="tagOptions"
        @deselect="removeTag"
      />

      <div class="button-wrapper custom-action-row">
        <button class="action-button cancel" type="button" @click="this.$emit('togglePopup')">Cancel</button>
        <button class="action-button done" type="button" @click="this.showConfirmation=true">Request</button>
      </div>
    </div>

    <!--  Modal component  -->
    <ConfirmationMessage
      v-if="showConfirmation"
      msg="Would you like to confirm your edits?"
      @closeMessage="closeMessage"
      @confirmEdit="confirmEditFn"
    />
  </div>
</template>

<script>
import Multiselect from '@vueform/multiselect'
import ConfirmationMessage from "@/modals/ConfirmationMessage";
import {unsubBranch, branches, fetchBranchAssignment } from "@/db/Employee";
import {getTag, unsubListTag, allTags } from "@/db/Tags";
import {requestBranch, requestTag} from "@/db/EmployeeRequests";

export default {
  name: "TagRequest",
  props: ["employeeID"],
  emits: ["togglePopup", "sendRequest"],
  components: { Multiselect, ConfirmationMessage },
  data() {
    return {
      branches: branches,
      assignedTag: [],
      assignedBranch: [],
      unsubscribeListener: [unsubBranch, unsubListTag],
      branchOptions: [],
      tagOptions: allTags,
      showConfirmation: false,
    }
  },
  created() {
    const branchOptions = this.branches.map((branch) => {
      return {'id': branch.id, 'value': branch.name}
    })
    this.branchOptions = branchOptions

    const [unsubscribe, assignedBranch] = fetchBranchAssignment(this.employeeID, branchOptions)
    this.unsubscribeListener.push(unsubscribe)
    this.assignedBranch = assignedBranch

    const [unsubGetTags, tags] = getTag(this.employeeID)
    this.assignedTag = tags
    this.unsubscribeListener.push(unsubGetTags)
  },
  methods: {
    closeMessage() {
      this.showConfirmation=false
    },
    confirmEditFn() {
      this.assignedBranch.forEach((branchName) => {
        requestBranch(this.employeeID, branchName)
      })

      this.assignedTag.forEach((tagName) => {
        requestTag(this.employeeID, tagName)
      })
      this.showConfirmation=false
      this.$emit('sendRequest')
    },
    removeBranch(removedValue) {
      alert("You do not have permission to remove branch assignment")
      this.assignedBranch.push(removedValue)
    },
    removeTag(removedValue) {
      alert("You do not have permission to remove tag assignment")
      this.assignedTag.push(removedValue)
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

label {
  margin-right: auto;
}
</style>