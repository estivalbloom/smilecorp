class GameTile {
	path: string;
	image: HTMLImageElement | null;
	imageLoaded: boolean;

	constructor(path: string) {
		this.path = path;
		this.image = null;
		this.imageLoaded = false;
	}

	loadImage(): Promise<HTMLImageElement> {
		if (this.imageLoaded) {
			return Promise.resolve(this.image as HTMLImageElement);
		}

		return new Promise((resolve, reject) => {
			const img = new Image();
			img.src = this.path;

			img.onload = () => {
				this.image = img;
				this.imageLoaded = true;
				resolve(img);
			};

			img.onerror = (err) => {
				reject(err);
			};
		});
	}

	draw(ctx: CanvasRenderingContext2D, x: number, y: number) {
		if (this.imageLoaded && this.image) {
			ctx.drawImage(this.image, x, y);
		} else {
			this.loadImage().then(() => {
				if (this.image) {
					ctx.drawImage(this.image, x, y);
				}
			}).catch(err => {
				console.error(`Failed to load image at ${this.path}`, err);
			});
		}
	}
}

export default GameTile