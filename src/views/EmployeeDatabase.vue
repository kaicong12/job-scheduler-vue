<template>
  <div v-if="!admin">NOT AUTHORISED</div>
  <div v-else>
    <NotifButton />
    <NavBar />
    <h1 class="section-title">
      Available Employees <span>{{ filteredEmployees.length }} </span>
    </h1>
    <div class="filter-wrapper">
      <form @submit.prevent="" class="search-bar">
        <input
          class="input-field"
          type="text"
          v-model="employeeSearch"
          placeholder="Search employees by name"
        />
        <font-awesome-icon
          icon="fa-solid fa-x"
          class="cross-icon"
          v-if="employeeSearch.length > 0"
          @click="clearSearchBar"
        />
      </form>

      <select
        name="branch"
        id="branch"
        class="branch-filter input-field"
        v-model="selectedBranch"
      >
        <option value="" selected>All branches</option>
        <option v-for="branch in branches" :value="branch" :key="branch.name">
          {{ branch.name }}
        </option>
      </select>
    </div>
    <div class="employee-wrapper">
      <EmployeeCard
        v-for="employee in filteredEmployees"
        class="employee-card"
        :key="employee.firstName"
        :employee="employee"
        :full-name="employee.fullName"
        :tags="employeeTags[employee.id]"
        :email-address="employee.emailAddress"
        @click="toggleModal(employee)"
      />
    </div>

    <!--  Modal Component-->
    <EmployeePopup
      v-if="lastClick"
      :employee="lastClick"
      :tags="employeeTags[lastClick.id]"
      :branch-options="branchOptions"
      @togglePopup="this.lastClick = null"
    />
  </div>
</template>

<script>
import EmployeeCard from "@/components/EmployeeCard";
import EmployeePopup from "@/modals/EmployeePopup";
import NotifButton from "@/components/NotifButton";
import NavBar from "@/components/NavBar.vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import {
  unsubBranch,
  unsubEmployee,
  unsubAssignments,
  employees,
  branches,
  assignments,
} from "@/db/Employee";
import { unsubTag, tags } from "@/db/Tags";

export default {
  name: "EmployeeDatabase",
  components: { NotifButton, EmployeePopup, EmployeeCard, NavBar },
  data() {
    return {
      unsubscribeListener: [
        unsubEmployee,
        unsubBranch,
        unsubAssignments,
        unsubTag,
      ],
      employees: employees,
      employeeBranches: assignments,
      branches: branches,
      employeeSearch: "",
      selectedBranch: "",
      lastClick: null,
      admin: false,
      adminid: "42vuID5nKWMVL1mODCKyqaoVL7s1",
    };
  },
  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.uid = user.uid;
        if (user.uid === this.adminid) {
          this.admin = true;
        }
      }
    });
  },
  unmounted() {
    this.unsubscribeListener.forEach((callback) => {
      callback();
    });
  },
  computed: {
    filteredEmployees() {
      const dbEmployees = this.employees.filter((employee) => {
        return employee.lastName !== "employer";
      });
      const result = dbEmployees.filter((employee) => {
        return employee.fullName.toLowerCase().includes(this.employeeSearch);
      });

      if (this.selectedBranch !== "") {
        let branchID = this.selectedBranch.id;

        // only return employees from this branch
        const allowedEmployees = [];
        this.employeeBranches.filter((assignment) => {
          if (assignment.branchID === branchID) {
            allowedEmployees.push(assignment.employeeID);
          }
        });

        const newResults = result.filter((employee) => {
          return allowedEmployees.includes(employee.id);
        });
        return newResults;
      }

      return result;
    },
    branchOptions() {
      const result = [];
      this.branches.forEach((branch) => {
        result.push({ id: branch.id, value: branch.name });
      });

      return result;
    },
    employeeTags() {
      const tagAssignment = {};
      tags.value.forEach((tag) => {
        if (tag.employeeID in tagAssignment) {
          tagAssignment[tag.employeeID].push(tag.tagName);
        } else {
          tagAssignment[tag.employeeID] = [tag.tagName];
        }
      });

      return tagAssignment;
    },
  },
  methods: {
    clearSearchBar() {
      this.employeeSearch = "";
    },
    toggleModal(employee) {
      this.lastClick = employee;
    },
    getProfileLink(employeeID) {
      let profileLink = null;
      for (let i = 0; i < this.filteredEmployees.length; i++) {
        const curEmployee = this.filteredEmployees[i];
        if (curEmployee.id === employeeID && curEmployee.hasProfileImage) {
          profileLink = `@/assets/${curEmployee.firstName}.svg`;
        }
      }

      if (profileLink === null) {
        profileLink = "@/assets/unknown.png";
      }

      return profileLink;
    },
  },
};
</script>

<style scoped>
.employee-wrapper {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 30px;
}

h1 span {
  color: #808080;
  font-weight: normal;
  font-size: 20px;
  margin-left: 10px;
}

.search-bar {
  position: relative;
  min-width: 300px;
  max-width: 400px;
  width: 50%;
  display: flex;
  align-items: center;
}

.cross-icon {
  position: absolute;
  right: 20px;
  cursor: pointer;
}

.input-field {
  border: 1px solid #d1d5db;
  border-radius: 4px;
  width: 100%;
  padding: 7px 12px 6px 12px;
  font-family: inherit;
  font-size: inherit;
  outline: none;
}

.input-field:focus,
.input-field:active {
  box-shadow: 0 0 0 3px var(--yellow-tone-1);
}

.filter-wrapper {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 30px;
}

.branch-filter {
  min-width: 200px;
  max-width: 250px;
}
</style>
