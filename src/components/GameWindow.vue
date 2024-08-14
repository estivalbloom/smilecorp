<template>
	<canvas ref="gameCanvas"></canvas>
</template>

<script setup lang="ts">
import { Chunk, useWorldStore } from '@/stores/world';
import { onMounted, ref } from 'vue';

const gameCanvas = ref<HTMLCanvasElement>();
let ctx : CanvasRenderingContext2D | null = null;

const worldStore = useWorldStore();
const loadedChunks = new Array<Chunk>();

let viewOffsetX = 0;
let viewOffsetY = 0;
let scaleFactor = 4;

function draw() {
	if(!ctx) {
		return;
	}

	const context = ctx; // For type safety reasons
	ctx.translate(viewOffsetX, viewOffsetY);
	ctx.scale(scaleFactor, scaleFactor);
	loadedChunks.forEach(e => {
		e.draw(context, 0, 0);
	});
}

function resizeCanvas() {
	if(!gameCanvas.value) {
		return;
	}
	gameCanvas.value.width = window.innerWidth;
	gameCanvas.value.height = window.innerHeight;

	draw();
}

onMounted(() => {
	if(!gameCanvas.value) {
		console.error('No game canvas found!');
		return;
	}
	
	const chunk = worldStore.world.generateChunk(0, 0);
	loadedChunks.push(chunk);

	ctx = gameCanvas.value.getContext('2d');

	if(!ctx) {
		console.error('Couldn\'t get canvas context!');
		return;
	}

	ctx.imageSmoothingEnabled = false;

	window.addEventListener('resize', resizeCanvas);
	resizeCanvas();
});

</script>

<style scoped>
canvas {
	position: absolute;
	top: 0px;
	left: 0px;
}
</style>