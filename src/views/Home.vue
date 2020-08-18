<template>
  <div class="home">
      <Weather/>
      <Links class="linksComp"/>
  </div>
</template>

<script>
// @ is an alias to /src
import Weather from '@/components/Weather.vue'
import Links from '@/components/Links.vue'

export default {
  name: 'Home',
  components: {
    Weather,
    Links
  }
}
</script>

<style lang="scss">

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

</style>
