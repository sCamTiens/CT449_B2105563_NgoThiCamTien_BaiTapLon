<script>
export default {
    props: {
        modelValue: {
            type: String,
            default: ''
        },
    },
    emits: ['submit', 'update:modelValue'],
    methods: {
        updateModelValue(e) {
            this.$emit('update:modelValue', e.target.value)
        },
        submit() {
            this.$emit('submit');
        },
    },
};
</script>

<template>
    <div class="input-group">
        <input type="text" class="form-control" placeholder="Nhập nội dung" :value="modelValue"
            @input="updateModelValue" @keyup.enter="submit" />
        <div class="input-group-append">
            <button class="btn" type="button" @click="submit">
                <font-awesome-icon icon="magnifying-glass" /> Tìm kiếm
            </button>
        </div>
    </div>
</template>

<style>
.input-group {
    border: 1px solid #54333f;
    border-radius: 5px;
}

.input-group-append button {
    color: #fff;
    background-color: #54333f;
}

.input-group-append button:hover {
    color: #54333f;
    background-color: #ddbebe;
}
</style>
