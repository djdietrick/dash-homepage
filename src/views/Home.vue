<template>
  <div class="home">
      <Weather/>
      <Links class="linksComp"/>
      <sl-button class="menu__trigger" @click="showMenu"><sl-icon name="chevron-double-left"></sl-icon></sl-button>
      <sl-drawer class="menu" ref="menu">
          <sl-button class="logout" @click="logout">Logout</sl-button>
      </sl-drawer>
  </div>
</template>

<script>
// @ is an alias to /src
import Weather from '@/components/Weather.vue'
import Links from '@/components/Links.vue'
import {mapActions} from 'vuex';

export default {
  name: 'Home',
  components: {
    Weather,
    Links
  },
  methods: {
    ...mapActions(['logout']),
    showMenu() {
      this.$refs.menu.show();
    }
  }
}
</script>

<style lang="scss">
@import "../styles/main.scss";

.home {
  height: 92vh;
  width: 92vw;
  display: grid;
  grid-template-rows: 1fr 1fr;
  grid-template-columns: 1fr 1fr;
  grid-gap: 2rem;
  margin: 1rem;
}

.linksComp {
  grid-column: 2 / 3;
  grid-row: 1 / -1;
}

.menu {
  &::part(body), &::part(header) {
      background-color: $color-grey-dark-3;
      border: none;
  }

  &__trigger {
    position: fixed;
    top: 3rem;
    right: 2rem;
    opacity: 0.5;
    transition: 0.2s ease-in-out;

    &:hover {
      opacity: 0.8;
    }
  }
}

</style>
