<script lang="ts" setup>
import flatJson from '@/mocks/categories-flat.json'
import { ref } from 'vue';
import TreeNode from '@components/tree-node.vue';

interface Node {
    id: number;
    name: string;
    children: Node[];
}

interface CategoryNode {
  id: number;
  name: string;
  parentId?: number;
  children?: CategoryNode[];
}

function createNestedStructure(flatData:CategoryNode[]) {
    const idMap = {};
    const root = [];

    flatData.forEach(item => {
        idMap[item.id] = { ...item, children: [] };
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

const treeData = ref<Node[]>([]);

treeData.value = createNestedStructure(flatJson);

</script>
<template>
    <div class="p-4 bg-white">
        <TreeNode v-for="node in treeData" :key="node.id" :node="node" />
    </div>
</template>