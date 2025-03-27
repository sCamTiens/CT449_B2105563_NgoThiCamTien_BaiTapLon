<script>
export default {
    props: {
        nhanviens: { type: Array, default: () => [] },
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
                    <th class="text-center"><strong>Họ tên nhân viên</strong></th>
                    <th class="text-center"><strong>Chức vụ</strong></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(nhanvien, index) in nhanviens" :key="nhanvien._id" @click="updateActiveIndex(index)">
                    <td>{{ nhanvien.HoTenNV }}</td>
                    <td class="text-center">{{ nhanvien.ChucVu }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>