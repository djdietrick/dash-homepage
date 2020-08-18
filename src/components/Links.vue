<template>
    <div class="links">
        <sl-dropdown class="add">
            <sl-button slot="trigger"><sl-icon name="plus"></sl-icon></sl-button>
        </sl-dropdown>
    </div>
</template>

<script>
export default {
    
}
</script>

<style lang="scss" scoped>
@import "../styles/main.scss";
.links {
    background-color: $color-grey-dark-3;
    border-radius: 3rem;
    position: relative;
}

.add {
    position: absolute;
    top: 2rem;
    right: 2rem;

    sl-icon {
        font-size: 2rem;
    }
}

</style>