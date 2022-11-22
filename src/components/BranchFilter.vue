<template>
  <Multiselect
      v-model="assignedBranch"
      mode="tags"
      placeholder="Select Branches"
      track-by="value"
      label="value"
      :close-on-select="false"
      :options="branchOptions"
      @select="selectToggle"
      @deselect="removeToggle"
    />

<!--  Modal component  -->
    <ConfirmationMessage
        v-if="showConfirmation"
        msg="Would you like to confirm your edits?"
        @closeMessage="closeMessage"
        @confirmEdit="confirmEditFn(this.action)"
    />
</template>

<script>
import Multiselect from '@vueform/multiselect'
import ConfirmationMessage from "@/modals/ConfirmationMessage";
import { fetchBranchAssignment, createBranchAssignment, removeBranchAssignment } from "@/db/Employee";

const CONFIRM_ACTION = {
  CREATE: "create",
  DELETE: "delete"
}

export default {
  name: "BranchFilter",
  components: { Multiselect, ConfirmationMessage },
  props: ["employeeID", "branchOptions"],
  data() {
    return {
      unsubscribeListener: null,
      assignedBranch: [],
      showConfirmation: false,
      action: null,
      selectedOption: "",
      removedOption: ""
    }
  },
  created() {
    const [unsubscribe, assignedBranch] = fetchBranchAssignment(this.employeeID, this.branchOptions)
    this.unsubscribeListener = unsubscribe
    this.assignedBranch = assignedBranch
  },
  unmounted() {
    this.unsubscribeListener()
  },
  methods: {
    selectToggle(selectedOption) {
      this.showConfirmation = true
      this.selectedOption = selectedOption
      this.action = CONFIRM_ACTION.CREATE
    },
    removeToggle(removedOption) {
      this.showConfirmation = true
      this.removedOption = removedOption
      this.action = CONFIRM_ACTION.DELETE
    },
    async confirmEditFn(action) {
      let branchID = ""
      const toCompare = (this.selectedOption === "") ? this.removedOption : this.selectedOption
      this.branchOptions.forEach((branch) => {
        if (branch.value === toCompare) {
          branchID = branch.id
        }
      })

      if (action === CONFIRM_ACTION.CREATE) {
        if (branchID !== "") {
          await createBranchAssignment(this.employeeID, branchID)
          this.selectedOption = ""
        }
      } else if (action === CONFIRM_ACTION.DELETE) {
          await removeBranchAssignment(this.employeeID, branchID)
          this.removedOption = ""
      }

      this.showConfirmation = false
    },
    closeMessage() {
      this.showConfirmation=false
      if (this.selectedOption !== "") {
        const removeIdx = this.assignedBranch.indexOf(this.selectedOption)
        if (removeIdx > -1) {
          this.assignedBranch.splice(removeIdx, 1)
        }
        this.selectedOption = ""
      } else if (this.removedOption !== "") {
        this.assignedBranch.push(this.removedOption)
        this.removedOption = ""
      }
    }
  },
}
</script>

<style src="../../node_modules/@vueform/multiselect/themes/default.css">

</style>