<template>
	<canvas ref="gameCanvas"></canvas>
</template>

<script setup lang="ts">
import { Chunk, gameWorld } from '@/gameobjects/world';
import { onMounted, onUnmounted, ref } from 'vue';

const gameCanvas = ref<HTMLCanvasElement>();
let ctx : CanvasRenderingContext2D | null = null;

const loadedChunks = new Array<Chunk>();

let viewOffsetX = 0;
let viewOffsetY = 0;
let scaleFactor = 4;
let isPanning = false;
let prevMousePos = { screenX : 0, screenY : 0 };

let redrawIntervalId = -1;
let drawInterval = 33;

function draw() {
	if(!gameCanvas.value || !ctx) {
		return;
	}

	const context = ctx; // For type safety reasons
	ctx.clearRect(0, 0, gameCanvas.value.width, gameCanvas.value.height);
	ctx.save();
	ctx.translate(Math.round(viewOffsetX), Math.round(viewOffsetY));
	loadedChunks.forEach(e => {
		e.draw(context, 0, 0);
	});
	ctx.restore();
}

function resizeCanvas() {
	if(!gameCanvas.value) {
		return;
	}
	gameCanvas.value.width = window.innerWidth / scaleFactor;
	gameCanvas.value.height = window.innerHeight / scaleFactor;
	gameCanvas.value.style.width = `${window.innerWidth}px`;
	gameCanvas.value.style.height = `${window.innerHeight}px`; 

	draw();
}

function zoom(delta : number) {
	const zoom = delta < 0 ? 1.1 : 0.9;
  	scaleFactor *= zoom;
	resizeCanvas();
}

onMounted(() => {
	if(!gameCanvas.value) {
		console.error('No game canvas found!');
		return;
	}
	
	const chunk = gameWorld.generateChunk(0, 0);
	loadedChunks.push(chunk);

	gameCanvas.value.addEventListener('wheel', (e) => zoom(e.deltaY));
	gameCanvas.value.addEventListener('mousedown', (e) => {
		isPanning = true;
		prevMousePos = { screenX: e.screenX, screenY: e.screenY };
	});
	gameCanvas.value.addEventListener('mousemove', (e) => {
		if( isPanning ){
			viewOffsetX += (e.screenX - prevMousePos.screenX) / scaleFactor;
			viewOffsetY += (e.screenY - prevMousePos.screenY) / scaleFactor;
			prevMousePos = { screenX: e.screenX, screenY: e.screenY };
		}
	});
	gameCanvas.value.addEventListener('mouseup', () => isPanning = false);
	ctx = gameCanvas.value.getContext('2d');

	if(!ctx) {
		console.error('Couldn\'t get canvas context!');
		return;
	}

	ctx.imageSmoothingEnabled = false;

	window.addEventListener('resize', resizeCanvas);
	resizeCanvas();

	redrawIntervalId = setInterval(draw, drawInterval);
});

onUnmounted(() => {
	clearInterval(redrawIntervalId);
});
</script>

<style scoped>
canvas {
	position: absolute;
	top: 0px;
	left: 0px;
	/* https://itch.io/jam/lowrezjam2016/topic/19730/solved-html5-canvas-scaling-nearest-neighbor-no-blur */
	image-rendering: optimizeSpeed;             /* Older versions of FF          */
    image-rendering: -moz-crisp-edges;          /* FF 6.0+                       */
    image-rendering: -webkit-optimize-contrast; /* Safari                        */
    image-rendering: -o-crisp-edges;            /* OS X & Windows Opera (12.02+) */
	image-rendering: crisp-edges;
    image-rendering: pixelated;                 /* Awesome future-browsers       */
    -ms-interpolation-mode: nearest-neighbor;   /* IE                            */
}
</style>