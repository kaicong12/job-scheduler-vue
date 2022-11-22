<template>
<div id="wrapper">
    <img :src="logo" />
    <div id="signup">
        <ForgotPasswordForm />
    </div>
</div>
</template>

<script>
import ForgotPasswordForm from '@/components/ForgotPasswordForm.vue'
export default {
    name: 'App',
    data() {
        return {
            logo: require('@/assets/logo.png')
        }
    },
    components: {
        ForgotPasswordForm
    }
}
</script>

<style scoped>
#wrapper {
    background-color: #F9EBC9;
    height: 100vh;
    width: 100vw;
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
}
img {
    width: 300px;
    height: 300px;
    float: left;
    padding: 20px;
    margin-right: 100px;
    align-self: center;
}
</style>
