<template>
    <div class="auth">
        <h1 class="heading-primary">Dash Homepage</h1>
        <div class="auth__btn-group">
            <sl-button @click="setComponent('login')">Login</sl-button>
            <sl-button @click="setComponent('signup')">Signup</sl-button>
        </div>
        <component :is="selectedComponent"/>
    </div>
</template>

<script>
import Login from './Login.vue';
import Signup from './Signup.vue';

export default {
    data() {
        return {
            selectedComponent: "login"
        }
    },
    components: {
        login: Login,
        signup: Signup
    },
    methods: {
        setComponent(comp) {
            this.selectedComponent = comp;
        }
    }    
}
</script>

<style lang="scss">
.auth {
    display: flex;
    flex-direction: column;
    align-items: center;

    sl-button {
        margin-bottom: 2rem;
        &:not(:last-child) {
            margin-right: 2rem;
        }
    }
}
</style>