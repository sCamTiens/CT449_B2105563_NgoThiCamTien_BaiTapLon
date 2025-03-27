<script>
export default {
    props: {
        docgias: { type: Array, default: () => [] },
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
    <div class="table-responsive">
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th class="text-center"><strong>Họ tên độc giả</strong></th>
                    <th class="text-center"><strong>Số lượt mượn</strong></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(docgia, index) in docgias" :key="docgia._id" @click="updateActiveIndex(index)">
                    <td>{{ docgia.HoLot }} {{ docgia.Ten }}</td>
                    <td class="text-center">{{ docgia.soLuongMuon }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>