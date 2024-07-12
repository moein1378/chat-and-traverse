<script setup lang="ts">
import { ref } from 'vue';

interface NodeType {
    id: number;
    name: string;
    children: any[];
    isChecked: boolean;
    isIndeterminate: boolean;
    isExpanded: boolean;
    parentId?: number;
}

interface Props {
    node: NodeType;
    parentNode?: any;
}

const props = defineProps<Props>();
const nestedNodesCheckStates = ref<boolean[]>([])

const captureTraverseNestedNode = (nestedChildren: any[], checkState: boolean) => {
    nestedChildren.forEach((node: NodeType) => {
        node.isChecked = checkState
        if (node.children && node.children.length) {
            captureTraverseNestedNode(node.children, checkState)
        }
    })
}

const bubblingTraverseNestedNode = (node: NodeType) => {
    if (node.children && node.children.length) {
        node.children.forEach((subNode: NodeType) => {
            nestedNodesCheckStates.value.push(subNode.isChecked)
            bubblingTraverseNestedNode(subNode)
        })
    }
}

const controlNonParentIdNode = (node: NodeType) => {
    if (node.children && node.children.length) {
        captureTraverseNestedNode(node.children, node.isChecked)
    }
}

const controlParentIdNode = (node: NodeType) => {
    if (node.parentId) {
        if (props.parentNode?.children && props.parentNode?.children.length) {
            props.parentNode.isIndeterminate = false
            nestedNodesCheckStates.value = []
            bubblingTraverseNestedNode(props.parentNode);
            controlNodeState(props.parentNode)
        }
    }
}

const controlNodeState = (node:NodeType)=>{
    const allChecked = nestedNodesCheckStates.value.every((isChecked: boolean) => isChecked)
    const allUnchecked = nestedNodesCheckStates.value.every((isChecked: boolean) => !isChecked)
    const allDeterminate = nestedNodesCheckStates.value.some((isChecked: boolean) => !isChecked)

    if (allChecked) {
        node.isChecked = allChecked
        node.isIndeterminate = false
    }
    if (allDeterminate) {
        node.isChecked = false
        node.isIndeterminate = allDeterminate
    }
    if (allUnchecked) {
        node.isChecked = false
        node.isIndeterminate = !allUnchecked
    }
}


const toggleExpand = (node: NodeType) => {
    node.isExpanded = !node.isExpanded
}
const toggleCheck = (node: NodeType) => {
    node.isChecked = !node.isChecked
    controlNonParentIdNode(node)
    controlParentIdNode(node)
}

</script>
<template>
    <div class="my-2">
        <div class="flex items-center">
            <input type="checkbox" :checked="props.node.isChecked" :indeterminate="props.node.isIndeterminate"
                @change="toggleCheck(props.node)" class="cursor-pointer mr-2 form-checkbox h-5 w-5 text-blue-600" ref="checkbox">
            <span @click="toggleExpand(props.node)" class="cursor-pointer mr-2 text-gray-500"
                v-if="node.children && node.children.length">
                {{ props.node.isExpanded ? '▼' : '►' }}
            </span>
            <span class="text-gray-800">{{ node.name }}</span>
        </div>
        <div v-if="props.node.isExpanded" class="ml-6">
            <TreeNode v-for="child in node.children" :key="child.id" :node="child" :parentNode="node" />
        </div>
    </div>
</template>