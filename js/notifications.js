const DEFAULT_OPTIONS = {
    autoClose: 7500,
    position: "top-right",
    class: "gnwx-default",
    onClose: () => {
    },
    canClose: false,
    showProgress: true,
    pauseOnHover: false,
    pauseOnFocusLoss: false,
    redirect: false,
    redirect_url: ""
};

class GNWX_NOTIFY {
    #notifyElem
    #autoCloseInterval
    #progressInterval
    #removeBind
    #timeVisible = 0
    #autoClose
    #isPaused = false
    #unpause
    #pause
    #visibilityChange
    #shouldUnPause
    #redirectUrl
    #isRedirect = false

    constructor(options) {
        this.#notifyElem = document.createElement("div");
        this.#notifyElem.classList.add("gnwx-notify");

        requestAnimationFrame(() => {
            this.#notifyElem.classList.add("gnwx-show");
        });

        this.#removeBind = this.remove.bind(this);
        this.#unpause = () => this.#isPaused = false;
        this.#pause = () => this.#isPaused = true;
        this.#visibilityChange = () => this.#shouldUnPause = document.visibilityState === "visible";
        this.update({...DEFAULT_OPTIONS, ...options});
    }

    set position(value) {
        const currentContainer = document.querySelector(".gnwx-notify");
        const selector = `.gnwx-notify-container[data-position="${value}"]`;
        const container = document.querySelector(selector) || createContainer(value);
        container.append(this.#notifyElem);

        if (currentContainer == null || currentContainer.hasChildNodes()) return;
        currentContainer.remove();
    }

    set text(value) {
        this.#notifyElem.textContent = value;
    }

    set autoClose(value) {
        this.#autoClose = value;
        this.#timeVisible = 0;

        if (value === false) return

        let lastTime;
        const func = (time) => {
            if (this.#shouldUnPause) {
                lastTime = null;
                this.#shouldUnPause = false;
            }
            if (lastTime == null) {
                lastTime = time;
                this.#autoCloseInterval = requestAnimationFrame(func);
                return;
            }

            if (!this.#isPaused) {
                this.#timeVisible += time - lastTime;

                if (this.#timeVisible >= this.#autoClose) {
                    this.remove();
                    return;
                }
            }

            lastTime = time;
            this.#autoCloseInterval = requestAnimationFrame(func);
        };

        this.#autoCloseInterval = requestAnimationFrame(func);
    }

    set class(value) {
        if (typeof value === "string") {
            if (this.#notifyElem) this.#notifyElem.classList.add(value);
        } else {
            if (this.#notifyElem) this.#notifyElem.classList.add(DEFAULT_OPTIONS.class);
        }
    }

    set canClose(value) {
        this.#notifyElem.classList.toggle("can-close", value);

        if (value) {
            this.#notifyElem.addEventListener("click", this.#removeBind);
        } else {
            this.#notifyElem.removeEventListener("click", this.#removeBind);
        }
    }

    set showProgress(value) {
        this.#notifyElem.classList.toggle("gnwx-progress");
        this.#notifyElem.style.setProperty("--progress", 1);

        if (value) {
            const func = () => {
                if (!this.#isPaused) {
                    let progressTime = this.#autoClose ? 1 - `${(this.#timeVisible / this.#autoClose)}` : `${1 - 0}`;
                    this.#notifyElem.style.setProperty("--progress", progressTime);
                }
                this.#progressInterval = requestAnimationFrame(func);
            };

            requestAnimationFrame(func);
        }
    }

    set pauseOnHover(value) {
        if (value) {
            this.#notifyElem.addEventListener("mouseover", this.#pause);
            this.#notifyElem.addEventListener("mouseleave", this.#unpause);
        } else {
            this.#notifyElem.removeEventListener("mouseover", this.#pause);
            this.#notifyElem.removeEventListener("mouseleave", this.#unpause);
        }
    }

    set redirect(value) {
        if (typeof value === "boolean") {
            if (!value) return;
            this.#isRedirect = true;
        } else {
            this.#isRedirect = false;
        }


    }

    set redirect_url(value) {
        if (!this.#isRedirect) {

        } else {
            this.#redirectUrl = value;
            setTimeout(() => {
                window.location.href = this.#redirectUrl;
            }, this.#autoClose);
        }
    }

    set pauseOnFocusLoss(value) {
        if (value) {
            document.addEventListener("visibilitychange", this.#visibilityChange);
        } else {
            document.removeEventListener("visibilitychange", this.#visibilityChange);
        }
    }

    update(options) {
        Object.entries(options).forEach(([key, value]) => {
            this[key] = value;
        });
    }

    remove() {
        let container = document.querySelector(".gnwx-notify").parentElement;
        document.querySelector(".gnwx-notify").classList.remove("gnwx-show");
        document.querySelector(".gnwx-notify").addEventListener("transitionend", () => {
            document.querySelector(".gnwx-notify").remove();

            if (container == null || container.hasChildNodes()) return;
            container.remove();
        });

        cancelAnimationFrame(this.#autoCloseInterval);
        cancelAnimationFrame(this.#progressInterval);
    }
}

function createContainer(position) {
    const container = document.createElement("div");
    container.classList.add("gnwx-notify-container");
    container.dataset.position = position;
    document.body.append(container);

    return container;
}