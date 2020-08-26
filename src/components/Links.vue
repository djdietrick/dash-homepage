<template>
    <div class="links">
        <sl-dropdown class="add">
            <sl-button slot="trigger" class="trigger"><sl-icon name="plus"></sl-icon></sl-button>
            <div class="add__dropdown">
                <sl-form @slSubmit="formatAndSubmit">
                    <sl-input class="add__input" v-sl-model="url" label="URL"></sl-input>
                    <sl-input class="add__input" v-sl-model="name" label="Name"></sl-input>
                    <sl-input class="add__input" v-sl-model="category" label="Category"></sl-input>
                    <sl-button @click="formatAndSubmit" class="add__button">Add</sl-button>
                </sl-form>
            </div>
        </sl-dropdown>

        <div v-if="!hasLinks" class="links__placeholder">
            <h2>Add links here for later</h2>
        </div>

        <div v-for="(ls, category) in linksByCategory" :key="category" class="links__category">
            <h2>{{category.charAt(0).toUpperCase() + category.slice(1)}}</h2>
            <div v-for="link in ls" :key="link.url" class="link">
                <p @click="openLink(link.url)" class="link__text">{{link.name}}</p>
                <sl-icon name="x-square" class="removeLink" @click="removeLink(link)"></sl-icon>
            </div>
            <sl-menu-divider></sl-menu-divider>
        </div>
    </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';
import axios from 'axios';
import moment from 'moment';
export default {
    data() {
        return {
            url: '',
            name: '',
            category: ''
        }
    },
    computed: {
        ...mapGetters({
            links: 'getLinks'
        }),
        linksByCategory() {
            let lbc = {};
            for(let i = 0; i < this.links.length; i++) {
                if(lbc[this.links[i].category] === undefined)
                    lbc[this.links[i].category] = [];
                lbc[this.links[i].category].push(this.links[i]);
            }
            return lbc;
        },
        hasLinks() {
            return Array.isArray(this.links) && this.links.length !== 0
        }
    },
    methods: {
        ...mapActions(['fetchLinks', 'addLink', 'removeLink']),
        async formatAndSubmit() {
            if(this.url.length === 0)
                return;

            this.addLink({
                url: this.url,
                name: this.name.length > 0 ? this.name : this.url,
                category: this.category.toLowerCase()
            });
            this.url = '';
            this.name = '';
            this.category = '';
        },
        openLink(url) {
            if(url.startsWith('https://'))
                window.open(url, '_blank');
            else
                window.open(`https://${url}`, '_blank');
        }
    },
    mounted() {
        this.fetchLinks();
    }
}
</script>

<style lang="scss" scoped>
@import "../styles/main.scss";
.links {
    background-color: $color-grey-dark-3;
    border-radius: 1rem;
    position: relative;
    padding: 1rem 2rem;
    overflow-y: auto;

    &__category {
        margin-bottom: 1rem;

        sl-menu-divider::part(base) {
            opacity: 0.2;
        }
    }

    &__placeholder {
        opacity: 0.7;
        text-align: center;
        margin: 0 auto;
        margin-top: 20rem;
    }
}

.link {
    display: grid;
    grid-template-columns: 1fr 1rem;
    align-items: center;
    padding: 0.5rem 1rem;
    height: min-content;
    width: 75%;
    border-radius: 1rem;
    margin-bottom: 0.3rem;
    transition: 0.2s ease-in-out;

    &:hover {
        background-color: $color-background;

        .removeLink {
            opacity: 0.5;
        }
    }

    &__text {
        font-size: 1rem;
        &:hover {
            cursor: pointer;
        }
    }

    .removeLink {
        &:hover {
            cursor: pointer;
            transform: translateY(-1px);
            box-shadow: 0 1rem 2rem rgba($color-black,.2);
            opacity: 0.7;

            &::after {
                transform: scaleX(1.4) scaleY(1.6);
                opacity: 0;
            }
        }
        font-size: 1.8rem;
        opacity: 0;
        justify-self: flex-end;
        transition: 0.2s ease-in-out;
    }
}

.add {
    position: absolute;
    top: 2rem;
    right: 2rem;

    sl-icon {
        transform: translateY(4px);
        font-size: 2rem;
    }

    &__button {
        margin-top: 1rem;
    }

    &__input::part(base) {
        width: 30rem;
    }

    &::part(panel) {
        border-radius: 1rem;
    }
    
    &__dropdown {
        border-radius: 1rem;
        width: minmax(90%, 75rem);
        height: min-content;
        padding: 3rem;
        background-color: $color-grey-dark-3;
    }
}

</style>