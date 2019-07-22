var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("LoadingView", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LoadingView = (function (_super) {
        __extends(LoadingView, _super);
        function LoadingView() {
            var _this = _super.call(this) || this;
            _this.createView();
            return _this;
        }
        LoadingView.prototype.createView = function () {
            this.textField = new fgui.GTextField();
            this.textField.width = 500;
            this.textField.fontSize = 26;
            this.textField.x = this.textField.width * .5;
            this.textField.y = this.textField.height * .5 - 40;
            this.addChild(this.textField);
            this.textField.addRelation(this, 3);
            this.textField.addRelation(this, 10);
        };
        LoadingView.prototype.setProgress = function (p) {
            this.textField.text = "Loading..." + Math.round(p) + "%";
        };
        return LoadingView;
    }(fgui.GComponent));
    exports.LoadingView = LoadingView;
});
define("fw/ExLoader", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ExLoader = (function (_super) {
        __extends(ExLoader, _super);
        function ExLoader() {
            return _super.call(this) || this;
        }
        ExLoader.prototype.loadExternal = function () {
            var _this = this;
            var texture = PIXI.Texture.fromImage(this.$url, true);
            this["$loadingTexture"] = texture;
            texture.once("update", function () {
                if (!texture.width || !texture.height)
                    _this["$loadResCompleted"](null);
                else
                    _this["$loadResCompleted"](texture);
                _this.emit("complete", _this.texture);
            });
        };
        return ExLoader;
    }(fgui.GLoader));
    exports.ExLoader = ExLoader;
});
define("LuckyCell", ["require", "exports", "fw/ExLoader"], function (require, exports, ExLoader_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LuckyCell = (function (_super) {
        __extends(LuckyCell, _super);
        function LuckyCell() {
            var _this = _super.call(this) || this;
            _this.mIndex = 0;
            _this.image = new ExLoader_1.ExLoader();
            _this.image.setPivot(0.5, 0.5);
            _this.image.y = -260;
            _this.image.on("complete", function (evt) {
                _this.image.x = -_this.image.content.width >> 1;
            }, _this);
            _this.addChild(_this.image);
            return _this;
        }
        LuckyCell.prototype.setIndex = function (value) {
            this.mIndex = value;
            this.rotation = 45 * value;
            this.image.url = "./imgs/card_apple_yellow.png";
            console.log(this.image.url);
        };
        return LuckyCell;
    }(fgui.GComponent));
    exports.LuckyCell = LuckyCell;
});
define("LuckyResult", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LuckyResult = (function (_super) {
        __extends(LuckyResult, _super);
        function LuckyResult() {
            return _super.call(this) || this;
        }
        LuckyResult.prototype.onInit = function () {
            this.setSize(fgui.GRoot.inst.width, fgui.GRoot.inst.height);
            this.contentPane = fgui.UIPackage.createObject("lucky", "lucky_result");
            this.modal = true;
            this.center();
        };
        LuckyResult.prototype.onShown = function () {
            _super.prototype.onShown.call(this);
            this.imgUrl && this.updateImg();
            this.btnNext = this.contentPane.getChild("btn_next");
            this.btnNext.click(this.onTouchNext, this);
        };
        LuckyResult.prototype.setData = function (value) {
            this.imgUrl = value;
            this.isShowing && this.updateImg();
        };
        LuckyResult.prototype.updateImg = function () {
            if (!this.imgUrl)
                return;
            var img = this.contentPane.getChild("img");
            img.url = this.imgUrl;
            ;
        };
        LuckyResult.prototype.onTouchNext = function () {
            this.hide();
        };
        LuckyResult.prototype.dispose = function () {
            this.btnNext && this.btnNext.removeClick(this.onTouchNext, this);
            _super.prototype.dispose.call(this);
        };
        return LuckyResult;
    }(fgui.Window));
    exports.LuckyResult = LuckyResult;
});
define("LuckyMain", ["require", "exports", "LuckyCell", "LuckyResult"], function (require, exports, LuckyCell_1, LuckyResult_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LuckyMain = (function (_super) {
        __extends(LuckyMain, _super);
        function LuckyMain() {
            var _this = _super.call(this) || this;
            _this.cells = [];
            return _this;
        }
        LuckyMain.prototype.onInit = function () {
            this.setSize(fgui.GRoot.inst.width, fgui.GRoot.inst.height);
            this.contentPane = fgui.UIPackage.createObject("lucky", "lucky_main");
            this.contentPane.setSize(fgui.GRoot.inst.width, fgui.GRoot.inst.height);
            this.contentPane.addRelation(fgui.GRoot.inst, 24);
            this.modal = false;
            this.center();
            this.contentPane.getChild("light1").visible = false;
            this.cellsContainer = new fgui.GComponent();
            this.cellsContainer.setXY(494, 363);
            this.addChild(this.cellsContainer);
        };
        LuckyMain.prototype.onShown = function () {
            _super.prototype.onShown.call(this);
            var btnStart = this.contentPane.getChild("btn_start");
            btnStart.click(this.onStart, this);
            for (var i = 0; i < 8; i++) {
                var cell = new LuckyCell_1.LuckyCell();
                cell.setIndex(i);
                this.cellsContainer.addChild(cell);
                this.cells.push(cell);
            }
            this.setStatus(1);
        };
        LuckyMain.prototype.setStatus = function (status) {
            var _this = this;
            switch (status) {
                case 1:
                    this.contentPane.getChild("rainbow_s").visible = true;
                    this.contentPane.getChild("rainbow_a").visible = false;
                    this.contentPane.getChild("btn_start").visible = true;
                    this.contentPane.getChild("effect_light").visible = false;
                    this.contentPane.getChild("effect_sign").visible = false;
                    this.lastStatus = 1;
                    this.cellsContainer.rotation = 0;
                    break;
                case 2:
                    if (this.lastStatus != 1)
                        return;
                    this.contentPane.getChild("btn_start").visible = false;
                    this.contentPane.getChild("effect_light").visible = true;
                    this.contentPane.getChild("effect_sign").visible = true;
                    fgui.GTimer.inst.addLoop(200, this.twinkleLight, this);
                    var rainbow_a = this.contentPane.getChild("rainbow_a");
                    rainbow_a.visible = true;
                    rainbow_a.alpha = 0;
                    createjs.Tween.get(rainbow_a).to({ alpha: 1 }, 1000).to({ alpha: 0 }, 1000).call(function () {
                        _this.turnFinished();
                    });
                    this.cellsContainer.rotation = 0;
                    createjs.Tween.get(this.cellsContainer).to({ rotation: 720 }, 2000);
                    this.cellsContainer.alpha = 1;
                    createjs.Tween.get(this.cellsContainer).to({ alpha: 0 }, 1000).to({ alpha: 1 }, 1000);
                    this.lastStatus = 2;
                    break;
                case 3:
                    fgui.GTimer.inst.remove(this.twinkleLight, this);
                    this.lastStatus = 3;
                    break;
            }
        };
        LuckyMain.prototype.onStart = function (evt) {
            this.setStatus(2);
        };
        LuckyMain.prototype.twinkleLight = function () {
            var light0 = this.contentPane.getChild("light0");
            var light1 = this.contentPane.getChild("light1");
            light0.visible = !light0.visible;
            light1.visible = !light1.visible;
        };
        LuckyMain.prototype.turnFinished = function () {
            this.setStatus(3);
            var luckyResult = new LuckyResult_1.LuckyResult();
            luckyResult.setData("./imgs/card_apple_yellow.png");
            luckyResult.show();
            luckyResult.on("removed", this.resetStatus, this);
        };
        LuckyMain.prototype.resetStatus = function (evt) {
            this.setStatus(1);
        };
        LuckyMain.prototype.dispose = function () {
            fgui.GTimer.inst.remove(this.twinkleLight, this);
            for (var i in this.cells) {
                this.cells[i].dispose();
            }
            this.cells = [];
            _super.prototype.dispose.call(this);
        };
        return LuckyMain;
    }(fgui.Window));
    exports.LuckyMain = LuckyMain;
});
define("Main", ["require", "exports", "LoadingView", "LuckyMain"], function (require, exports, LoadingView_1, LuckyMain_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Main = (function (_super) {
        __extends(Main, _super);
        function Main() {
            var _this = _super.call(this, {
                view: document.querySelector("#canvasContainer canvas"),
                backgroundColor: 0xb5b5b5,
                antialias: true
            }) || this;
            _this.stats = new window["Stats"]();
            document.body.appendChild(_this.stats.dom);
            fgui.GTimer.inst.setTicker(PIXI.ticker.shared);
            fgui.GRoot.inst.attachTo(_this, {
                designWidth: 1440,
                designHeight: 810,
                scaleMode: "fixedWidth",
                orientation: "landscape",
                alignV: 3,
                alignH: 0
            });
            _this.contentlayer = new fgui.GComponent();
            fgui.GRoot.inst.addChild(_this.contentlayer);
            _this.contentlayer.addChild(_this.loadingView = new LoadingView_1.LoadingView());
            _this.loadingView.setSize(fgui.GRoot.inst.width, fgui.GRoot.inst.height);
            _this.loadingView.addRelation(fgui.GRoot.inst, 24);
            var loader = new fgui.utils.AssetLoader();
            loader.add("lucky", "images/lucky.jpg", { loadType: PIXI.loaders.Resource.LOAD_TYPE.XHR, xhrType: PIXI.loaders.Resource.XHR_RESPONSE_TYPE.BUFFER })
                .add("lucky@atlas0", "images/lucky@atlas0.png")
                .add("lucky@atlas0_1", "images/lucky@atlas0_1.png")
                .on("progress", _this.loadProgress, _this)
                .on("complete", _this.resLoaded, _this)
                .load();
            return _this;
        }
        Main.prototype.loadProgress = function (loader) {
            var p = loader.progress;
            this.loadingView.setProgress(p);
            if (p >= 100) {
                loader.off("progress", this.loadProgress, this);
                this.loadingView.dispose();
                this.loadingView = null;
            }
        };
        Main.prototype.resLoaded = function (loader) {
            loader.destroy();
            fgui.UIPackage.addPackage("lucky");
            var luckyMain = new LuckyMain_1.LuckyMain();
            luckyMain.show();
        };
        Main.prototype.render = function () {
            this.stats.update();
            _super.prototype.render.call(this);
        };
        return Main;
    }(PIXI.Application));
    exports.Main = Main;
});
//# sourceMappingURL=Main.js.map