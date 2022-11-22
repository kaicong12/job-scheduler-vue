<template>
<div id="wrapper">
    <img :src="signup" />
    <div id="signup">
        <SignupForm />
    </div>
</div>
</template>

<script>
import SignupForm from '@/components/SignupForm.vue'
export default {
    name: 'Signup',
    data() {
        return {
            signup: require('@/assets/signup.png')
        }
    },
    components: {
        SignupForm
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
    width: 381px;
    height: 300px;
    float: left;
    padding: 20px;
    margin-right: 100px;
    align-self: center;
}
</style>
