<template>
    <sl-form class="login" @slSubmit="formatAndSubmit">
        <transition name="fade">
            <div v-if="error" class="form__error">{{error}}</div>
        </transition>
        <sl-input label="Email" v-sl-model="email" type="email"></sl-input>
        <sl-input label="Password" v-sl-model="password" type="password" toggle-password></sl-input>
        <sl-button @click="formatAndSubmit">Login</sl-button>
    </sl-form>
</template>

<script>
import {mapActions} from "vuex";
export default {
    data() {
        return {
            email: "",
            password: "",
            error: null
        }
    },
    methods: {
        ...mapActions(["loginWithEmail"]),
        async formatAndSubmit() {
            this.error = null;
            this.loginWithEmail({
                email: this.email,
                password: this.password
            })
            .catch(e => this.error = e.message);
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../../styles/main.scss";

.login {
    display: flex;
    flex-direction: column;
    width: 40rem;
    border: 2px solid $color-primary;
    border-radius: 1rem;
    padding: 2rem;
    background-color: $color-grey-dark-3;

    sl-button {
        margin-top: 2rem;
        align-self:center;
    }
}

</style>