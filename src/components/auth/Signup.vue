<template>
    <sl-form class="signup" @slSubmit="validateAndSubmit">
        <transition name="fade">
            <div v-if="error" class="form__error">{{error}}</div>
        </transition>
        <sl-input label="Name" v-sl-model="name"></sl-input>
        <sl-input label="Email" v-sl-model="email"></sl-input>
        <sl-input label="Password" v-sl-model="password" type="password" toggle-password></sl-input>
        <sl-input label="Confirm Password" v-sl-model="confirmPassword" type="password" toggle-password></sl-input>
        <sl-button @click="validateAndSubmit">Login</sl-button>
    </sl-form>
</template>

<script>
import {mapActions} from "vuex";

export default {
    data() {
        return {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            error: "",
            attemptedSignIn: false
        }
    },
    methods: {
        ...mapActions(["signupWithEmail"]),
        async validateAndSubmit() {
            this.attemptedSignIn = true;

            let errors = false;
            if(!this.name.length) {
                this.error = "Please input a name.";
                return;
            }
            if(!this.validEmail(this.email)) {
                this.error = "Please enter a valid email address.";
                return;
            }
            if(this.password.length < 8) {
                this.error = "Please enter a password with at least 8 characters.";
                return;
            }
            if(this.confirmPassword !== this.password) {
                this.error = "Password and confirm password do not match.";
                return;
            }

            this.signupWithEmail({
                name: this.name,
                email: this.email,
                password: this.password
            })
            .catch(e => this.error = e.message);
        },
        validEmail: function (email) {
            var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        }
    },
    watch: {
        confirmPassword: function(val) {
            if(val === 0)
                return;
            else if(val !== this.password && this.attemptedSignIn) {
                this.error = "Passwords must match!";
            }
            else if(this.error.length !== 0) {
                this.error = "";
                this.$forceUpdate();
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../../styles/main.scss";

.signup {
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