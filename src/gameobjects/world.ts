
import { GameTile, tiles, tileSize } from '@/gameobjects/tiles';

const chunkSize = 16;

class Chunk {
	#tiles: Array<GameTile>

	constructor(fillTile?: GameTile) {
		this.#tiles = new Array<GameTile>(chunkSize * chunkSize);

		if (fillTile) {
			this.#tiles.fill(fillTile);
		}
	}

	setTile(i: number, j: number, tile: GameTile): void {
		this.#tiles[i * chunkSize + j] = tile;
	}

	getTile(i: number, j: number): GameTile {
		return this.#tiles[i * chunkSize + j];
	}

	draw(ctx: CanvasRenderingContext2D, x: number, y: number) {
		for (let i = 0; i < chunkSize; i++) {
			for (let j = 0; j < chunkSize; j++) {
				this.getTile(i, j).draw(ctx, x + i * tileSize, y + j * tileSize);
			}
		}
	}
}

function idxFromCoords(i: number, j: number) {
	return `${i}:${j}`;
}

class World {
	#chunks: Map<string, Chunk>

	constructor() {
		this.#chunks = new Map<string, Chunk>();
	}

	generateChunk(i: number, j: number): Chunk {
		const idx = idxFromCoords(i, j);

		let chunk = this.#chunks.get(idx);
		if (chunk) {
			console.error(`Attempted to regenerate chunk: ${idx}`);
			return chunk;
		}

		chunk = new Chunk(defaultTile);
		this.#chunks.set(idx, chunk);
		return chunk;
	}

	getChunk(i: number, j: number) {
		const idx = idxFromCoords(i, j);

		if (!this.#chunks.has(idx)) {
			this.generateChunk(i, j);
		}

		return this.#chunks.get(idx);
	}
}

const defaultTile = tiles.get('basic_floor');
const gameWorld = new World();

export { Chunk, World, gameWorld }
