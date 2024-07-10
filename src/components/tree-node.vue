<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

interface Props {
    node: {
        id: number;
        name: string;
        children: any[];
    }
}

const props = defineProps<Props>();
const emit = defineEmits(['update:checked']);

const isChecked = ref(false);
const isIndeterminate = ref(false);
const isExpanded = ref(true);
const checkbox = ref<HTMLInputElement | null>(null);

const childStates = ref<Map<number, boolean>>(new Map());

const toggleExpand = () => {
    isExpanded.value = !isExpanded.value;
};

const toggleCheck = () => {
    isChecked.value = !isChecked.value;
    isIndeterminate.value = false;
    updateChildrenStates(isChecked.value);
    emitUpdateChecked();
};

const updateChildrenStates = (checked: boolean) => {
    props.node.children.forEach(child => {
        childStates.value.set(child.id, checked);
    });
};

const handleChildUpdate = (childId: number, checked: boolean) => {
    childStates.value.set(childId, checked);
    updateState();
};

const updateState = () => {
    const states = Array.from(childStates.value.values());
    const allChecked = states.every(state => state);
    const allUnchecked = states.every(state => !state);

    if (allChecked) {
        isChecked.value = true;
        isIndeterminate.value = false;
    } else if (allUnchecked) {
        isChecked.value = false;
        isIndeterminate.value = false;
    } else {
        isChecked.value = false;
        isIndeterminate.value = true;
    }

    emitUpdateChecked();
};

const emitUpdateChecked = () => {
    emit('update:checked', props.node.id, isChecked.value);
};

onMounted(() => {
    if (props.node.children) {
        props.node.children.forEach(child => {
            childStates.value.set(child.id, false);
        });
    }
});

watch(() => childStates.value, updateState, { deep: true });

watch([isIndeterminate, checkbox], ([indeterminate, el]) => {
    if (el) {
        el.indeterminate = indeterminate;
    }
}, { immediate: true });
</script>
<template>
    <div class="my-2">
        <div class="flex items-center">
            <input type="checkbox" :checked="isChecked" :indeterminate="isIndeterminate" @change="toggleCheck"
                class="mr-2 form-checkbox h-5 w-5 text-blue-600" ref="checkbox">
            <span @click="toggleExpand" class="cursor-pointer mr-2 text-gray-500"
                v-if="node.children && node.children.length">
                {{ isExpanded ? '▼' : '►' }}
            </span>
            <span class="text-gray-800">{{ node.name }}</span>
        </div>
        <div v-if="isExpanded" class="ml-6">
            <TreeNode v-for="child in node.children" :key="child.id" :node="child"
                @update:checked="handleChildUpdate" />
        </div>
    </div>
</template>
