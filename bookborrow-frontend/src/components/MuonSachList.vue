<script>
export default {
    props: {
        muonsachs: { type: Array, default: () => [] },
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
        <li class=list-group-item v-for="(muonsach, index) in muonsachs" :key="muonsach._id"
            :class="{ active: index === activeIndex }" @click="updateActiveIndex(index)">
            {{ muonsach.MaDocGia }} : {{ muonsach.MaSach }}
        </li>
    </ul>
</template>