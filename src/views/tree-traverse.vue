<script lang="ts" setup>
import flatJson from '@/mocks/categories-flat.json'
import { ref } from 'vue';
import TreeNode from '@components/tree-node.vue';

interface CategoryNode {
  id: number;
  name: string;
  parentId?: number;
  children?: CategoryNode[];
}

interface NodeType {
    id: number;
    name: string;
    children: any[];
    isChecked: boolean;
    isIndeterminate: boolean;
    isExpanded: boolean;
    parentId?: number;
}

function createNestedStructure(flatData:CategoryNode[]) {
    const idMap = {};
    const root = [];

    flatData.forEach(item => {
        idMap[item.id] = { ...item, children: [],isChecked:false,isIndeterminate:false,isExpanded:true };
    });

    flatData.forEach(item => {
        if (item.parentId) {
            const parent = idMap[item.parentId];
            if (parent) {
                parent.children.push(idMap[item.id]);
            }
        } else {
            root.push(idMap[item.id]);
        }
    });

    return root;
}

const treeData = ref<NodeType[]>([]);

treeData.value = createNestedStructure(flatJson);

</script>
<template>
    <div class="p-4 bg-white">
        <TreeNode v-for="node in treeData" :key="node.id" :node="node" :parent-node="treeData" />
    </div>
</template>