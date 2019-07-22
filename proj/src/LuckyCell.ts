import { ExLoader } from "./fw/ExLoader";

export class LuckyCell extends fgui.GComponent {

    private mIndex = 0;
    private image: ExLoader;

    public constructor() {
        super();
        this.image = new ExLoader();
        this.image.setPivot(0.5, 0.5);
        this.image.y = -260;
        this.image.on("complete", evt => {
            this.image.x = -this.image.content.width >> 1;
        }, this);
        this.addChild(this.image);
    }

    public setIndex(value: number): void
    {
        this.mIndex = value;
        this.rotation = 45 * value;
        this.image.url = "./imgs/card_apple_yellow.png";
        console.log(this.image.url);
    }



}