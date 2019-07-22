export class LuckyResult extends fgui.Window {

    private imgUrl: string;
    private btnNext: fgui.GButton;

    public constructor() {
        super();
    }

    protected onInit(): void {
        this.setSize(fgui.GRoot.inst.width, fgui.GRoot.inst.height);
        this.contentPane = fgui.UIPackage.createObject("lucky", "lucky_result") as fgui.GComponent;
        this.modal = true;
        this.center();
    }

    protected onShown(): void {
        super.onShown();
        this.imgUrl && this.updateImg();
        this.btnNext = this.contentPane.getChild("btn_next") as fgui.GButton;
        this.btnNext.click(this.onTouchNext, this);
    }

    public setData(value: string): void {
        this.imgUrl = value;

        this.isShowing && this.updateImg();
    }

    private updateImg(): void {
        if (!this.imgUrl)
            return;
        const img = this.contentPane.getChild("img") as fgui.GLoader;
        img.url = this.imgUrl;;
    }

    private onTouchNext(): void {
        this.hide();
    }

    public dispose(): void {
        this.btnNext && this.btnNext.removeClick(this.onTouchNext, this);
        super.dispose();
    }
}