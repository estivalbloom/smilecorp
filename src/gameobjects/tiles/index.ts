import GameTile from "./gameTile";

const tileSize = 32;

function path(file: string) {
	return `/smilecorp/sprites/tiles/${file}`
}

const tiles = new Map([
	['basic_floor', new GameTile(path('basic_floor.png'))]
]);

export { GameTile, tiles, tileSize }