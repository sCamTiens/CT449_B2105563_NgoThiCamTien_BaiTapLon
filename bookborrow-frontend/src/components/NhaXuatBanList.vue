<script>
export default {
    props: {
        nhaxuatbans: { type: Array, default: () => [] },
        activeIndex: { type: Number, default: -1 },
    },
    emits: ['update:activeIndex'],
    methods: {
        updateActiveIndex(index) {
            this.$emit('update:activeIndex', index);
        }
    }
};
</script>

<template>
    <ul class="list-group">
        <li class=list-group-item v-for="(nhaxuatban, index) in nhaxuatbans" :key="nhaxuatban._id"
            :class="{ active: index === activeIndex }" @click="updateActiveIndex(index)">
            {{ nhaxuatban.TenNXB }}
        </li>
    </ul>
</template>