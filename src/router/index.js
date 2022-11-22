import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/Login.vue";
import EmployeeCalendar from "@/views/EmployeeCalendar.vue";
import Signup from '@/views/Signup.vue'
import ForgotPassword from '@/views/ForgotPassword.vue'
import Availability from "@/views/Availability";
import EmployeeDatabase from "@/views/EmployeeDatabase";
import EmployerShift from "@/views/EmployerShift";
import EmployerDashboard from "@/views/EmployerDashboard.vue"
import SettingDefault from "@/views/SettingDefault.vue"
import Home from "@/views/Home.vue"

const routes = [
	{
		path:'/home',
		name: 'Home',
		component: Home
	},
	{
		path:'/',
		name: 'Login',
		component: Login
	},
	{
		path:'/signup',
		name: 'Signup',
		component: Signup
	},
	{
		path:'/forgotpassword',
		name: 'ForgotPassword',
		component: ForgotPassword
	},
	{
		path:'/setting',
		name: 'SettingDefault',
		component: SettingDefault
	},
	{
		path:'/availability',
		name: 'Availability',
		component: Availability
	},
	{
		path:'/employee',
		name: 'EmployeeDatabase',
		component: EmployeeDatabase
	},
	{
		path: "/employeecalendar",
		name: "EmployeeCalendar",
		component: EmployeeCalendar,
	},
	{
		path: "/shifts",
		name: "EmployerShift",
		component: EmployerShift
	},
	{
		path: "/employerdashboard",
		name: "EmployerDashboard",
		component: EmployerDashboard,
	},

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router