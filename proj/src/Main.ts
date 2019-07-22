import { LoadingView } from "./LoadingView";
import { LuckyMain } from "./LuckyMain";

export class Main extends PIXI.Application {

    private loadingView: LoadingView;
    private contentlayer: fgui.GComponent;
    private stats: { update: () => void, dom: HTMLElement };

    public constructor() {

        super({
            view: document.querySelector("#canvasContainer canvas") as HTMLCanvasElement,
            backgroundColor: 0xb5b5b5,
            antialias: true
        });

        this.stats = new window["Stats"]();
        document.body.appendChild(this.stats.dom);

        fgui.GTimer.inst.setTicker(PIXI.ticker.shared);

        fgui.GRoot.inst.attachTo(this, {
            designWidth: 1440,
            designHeight: 810,
            scaleMode: fgui.StageScaleMode.FIXED_WIDTH,
            orientation: fgui.StageOrientation.LANDSCAPE,
            alignV: fgui.StageAlign.TOP,
            alignH: fgui.StageAlign.LEFT
        });

        this.contentlayer = new fgui.GComponent();
        fgui.GRoot.inst.addChild(this.contentlayer);

        this.contentlayer.addChild(this.loadingView = new LoadingView());
        this.loadingView.setSize(fgui.GRoot.inst.width, fgui.GRoot.inst.height);
        this.loadingView.addRelation(fgui.GRoot.inst, fgui.RelationType.Size);

        let loader = new fgui.utils.AssetLoader();
        loader.add("lucky", "images/lucky.jpg", { loadType: PIXI.loaders.Resource.LOAD_TYPE.XHR, xhrType: PIXI.loaders.Resource.XHR_RESPONSE_TYPE.BUFFER })
            .add("lucky@atlas0", "images/lucky@atlas0.png")
            .add("lucky@atlas0_1", "images/lucky@atlas0_1.png")
            .on("progress", this.loadProgress, this)
            .on("complete", this.resLoaded, this)
            .load();
    }

    private loadProgress(loader: PIXI.loaders.Loader): void {
        let p = loader.progress;
        this.loadingView.setProgress(p);
        if (p >= 100) {
            loader.off("progress", this.loadProgress, this);
            this.loadingView.dispose();
            this.loadingView = null;
        }
    }

    private resLoaded(loader: PIXI.loaders.Loader): void {
        loader.destroy();
        fgui.UIPackage.addPackage("lucky");

        let luckyMain = new LuckyMain();
        luckyMain.show();
    }

    public render(): void {
        this.stats.update();
        super.render();
    }
}
