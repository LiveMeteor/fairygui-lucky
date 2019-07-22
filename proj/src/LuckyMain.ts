import { LuckyCell } from "./LuckyCell";
import { LuckyResult } from "./LuckyResult";

export class LuckyMain extends fgui.Window {

    private cells: LuckyCell[] = [];
    private cellsContainer: fgui.GComponent;
    private lastStatus: number;

    public constructor() {
        super();
    }

    protected onInit(): void {
        this.setSize(fgui.GRoot.inst.width, fgui.GRoot.inst.height);
        this.contentPane = fgui.UIPackage.createObject("lucky", "lucky_main") as fgui.GComponent;
        this.contentPane.setSize(fgui.GRoot.inst.width, fgui.GRoot.inst.height);
        this.contentPane.addRelation(fgui.GRoot.inst, fgui.RelationType.Size);
        this.modal = false;
        this.center();

        this.contentPane.getChild("light1").visible = false;
        this.cellsContainer = new fgui.GComponent();
        this.cellsContainer.setXY(494, 363);
        this.addChild(this.cellsContainer);
    }

    protected onShown(): void {
        super.onShown();
        let btnStart = this.contentPane.getChild("btn_start") as fgui.GButton;
        btnStart.click(this.onStart, this);

        for (let i = 0; i < 8; i++)
        {
            let cell = new LuckyCell();
            cell.setIndex(i);
            this.cellsContainer.addChild(cell);
            this.cells.push(cell);
        }

        this.setStatus(1);
    }

    private setStatus(status: number): void
    {
        switch (status) {
            case 1:
                //初始状态
                this.contentPane.getChild("rainbow_s").visible = true;
                this.contentPane.getChild("rainbow_a").visible = false;
                this.contentPane.getChild("btn_start").visible = true;
                this.contentPane.getChild("effect_light").visible = false;
                this.contentPane.getChild("effect_sign").visible = false;
                this.lastStatus = 1;
                this.cellsContainer.rotation = 0;
                break;
            case 2:
                //运行中
                if (this.lastStatus != 1)
                    return;
                this.contentPane.getChild("btn_start").visible = false;
                this.contentPane.getChild("effect_light").visible = true;
                this.contentPane.getChild("effect_sign").visible = true;
                
                fgui.GTimer.inst.addLoop(200, this.twinkleLight, this);
                let rainbow_a = this.contentPane.getChild("rainbow_a");
                rainbow_a.visible = true;
                rainbow_a.alpha = 0;
                createjs.Tween.get(rainbow_a).to({alpha: 1}, 1000).to({alpha: 0}, 1000).call(() => {
                    this.turnFinished();
                });
                this.cellsContainer.rotation = 0;
                createjs.Tween.get(this.cellsContainer).to({rotation: 720}, 2000);
                this.cellsContainer.alpha = 1;
                createjs.Tween.get(this.cellsContainer).to({alpha: 0}, 1000).to({alpha: 1}, 1000)
                this.lastStatus = 2;
                break;
            case 3:
                //结果
                fgui.GTimer.inst.remove(this.twinkleLight, this);
                this.lastStatus = 3;
                break;
        }
    }

    /** 启动 */
    private onStart(evt: PIXI.interaction.InteractionEvent): void
    {
        this.setStatus(2);
    }

    private twinkleLight(): void
    {
        const light0 = this.contentPane.getChild("light0");
        const light1 = this.contentPane.getChild("light1");
        light0.visible = !light0.visible;
        light1.visible = !light1.visible;
    }

    private turnFinished(): void
    {
        this.setStatus(3);
        let luckyResult = new LuckyResult();
        luckyResult.setData("./imgs/card_apple_yellow.png");
        luckyResult.show();
        luckyResult.on("removed", this.resetStatus, this);
    }

    private resetStatus(evt: PIXI.interaction.InteractionEvent): void
    {
        this.setStatus(1);
    }

    public dispose(): void
    {
        fgui.GTimer.inst.remove(this.twinkleLight, this);
        for (let i in this.cells)
        {
            this.cells[i].dispose();
        }
        this.cells = [];
        super.dispose();
    }
}