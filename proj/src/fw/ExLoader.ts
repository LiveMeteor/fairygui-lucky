export class ExLoader extends fgui.GLoader {

    public constructor() {
        super();
    }

    protected loadExternal(): void {
        let texture = PIXI.Texture.fromImage(this.$url, true);
        this["$loadingTexture"] = texture;
        texture.once("update", () => {
            if (!texture.width || !texture.height)
                this["$loadResCompleted"](null);
            else
                this["$loadResCompleted"](texture);
            this.emit("complete", this.texture);
        });
    }

    

}