

let canvas;
let ctx;
let ctx2;
let x = 0, y = 0;

let p1, p2, p3, p4, _p1 = 1 / 100, _p2 = 85 / 100, _p3 = 7 / 100, _p4 = 7 / 100

var _scrollTimeout = null;

let panZoom = { x: 0, y: 0, scale: 1 }
let mouse = { x: 0, y: 0, wheel: 0 }

let points = []

let copyCanvas = document.createElement("canvas")

let m, b, m1, b1, x_min, x_max, y_min, y_max, x_canvas_min, x_canvas_max, y_canvas_min, y_canvas_max

let pixelescopy

let _maxIterations = 1000000

let myTimeout


window.onload = function () {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d")
    body = document.getElementById("body")

    p1 = document.getElementById("eq-p1")
    p2 = document.getElementById("eq-p2")
    p3 = document.getElementById("eq-p3")
    p4 = document.getElementById("eq-p4")

    let arr = [p1, p2, p3, p4]
    let functs = [handlep1, handlep2, handlep3, handlep4]
    arr.forEach((element, i) => {
        element.addEventListener("keyup", functs[i])
    });


    canvas.addEventListener("wheel", handleWheel)
    canvas.addEventListener("mousemove", handleMouse)
    canvas.addEventListener("mousedown", handleMouseDown)
    canvas.addEventListener("mouseup", handleMouseUp)

    canvas.width = body.offsetHeight - 10
    canvas.height = body.offsetHeight - 10

    copyCanvas.width = body.offsetHeight - 10
    copyCanvas.height = body.offsetHeight - 10

    ctx2 = copyCanvas.getContext("2d")
    ctx.fillRect(0, 0, canvas.width, canvas.height)


    x_min = -2.1820
    x_max = 2.6558;

    y_min = 0
    y_max = 9.9983

    x_canvas_min = 0
    x_canvas_max = canvas.width

    y_canvas_min = 0
    y_canvas_max = canvas.height

    update()

};


function handlep1(e) {
    _p1 = e.target.value / 100
    if (_p1 + _p2 + _p3 + _p4 > 1) {
        p1.classList.add("error-input")
        p2.classList.add("error-input")
        p3.classList.add("error-input")
        p4.classList.add("error-input")
    } else {
        p1.classList.remove("error-input")
        p2.classList.remove("error-input")
        p3.classList.remove("error-input")
        p4.classList.remove("error-input")
    }

}
function handlep2(e) {
    _p2 = e.target.value / 100

    if (_p1 + _p2 + _p3 + _p4 > 1) {
        p1.classList.add("error-input")
        p2.classList.add("error-input")
        p3.classList.add("error-input")
        p4.classList.add("error-input")
    } else {
        p1.classList.remove("error-input")
        p2.classList.remove("error-input")
        p3.classList.remove("error-input")
        p4.classList.remove("error-input")
    }
}
function handlep3(e) {
    _p3 = e.target.value / 100

    if (_p1 + _p2 + _p3 + _p4 > 1) {
        p1.classList.add("error-input")
        p2.classList.add("error-input")
        p3.classList.add("error-input")
        p4.classList.add("error-input")
    } else {
        p1.classList.remove("error-input")
        p2.classList.remove("error-input")
        p3.classList.remove("error-input")
        p4.classList.remove("error-input")
    }
}
function handlep4(e) {
    _p4 = e.target.value / 100

    if (_p1 + _p2 + _p3 + _p4 > 1) {
        p1.classList.add("error-input")
        p2.classList.add("error-input")
        p3.classList.add("error-input")
        p4.classList.add("error-input")
    } else {
        p1.classList.remove("error-input")
        p2.classList.remove("error-input")
        p3.classList.remove("error-input")
        p4.classList.remove("error-input")
    }

}

function loop() {
    setTimeout(function () {
        for (let i = 0; i < 100000; i++) {
            const number = window.requestAnimationFrame(loop);
            update(number);
        }

    }, 1000 / 100)
}


function handleMouseDown(e) {
    mouse = { ...mouse, button: e.button === 0 ? true : mouse.button, button2: e.button === 1 ? true : mouse.button2, lastButton: mouse.button }
}

function handleMouseUp(e) {
    mouse = { ...mouse, button: e.button === 0 ? false : mouse.button, button2: e.button === 1 ? false : mouse.button2 }
}

function handleMouse(e) {
    const bounds = canvas.getBoundingClientRect()
    mouse = { ...mouse, x: e.pageX - bounds.left - window.scrollX, y: e.pageY - bounds.top - window.scrollY, lastX: mouse.x, lastY: mouse.y, lastButton: mouse.button }

    if (mouse.button2) {
        panZoom.x += mouse.x - mouse.lastX;
        panZoom.y += mouse.y - mouse.lastY;
        apply()
    }

}
function handleWheel(e) {
    mouse = { ...mouse, wheel: mouse.wheel + -e.deltaY }

    executeZoom()
}

function executeZoom() {
    let scale = 1
    if (mouse.wheel !== 0) {
        scale = mouse.wheel < 0 ? 1 / 1.01 : 1.01
        mouse = { ...mouse, wheel: mouse.wheel * 0.9 }
        if (Math.abs(mouse.wheel) < 1) {
            mouse = { ...mouse, wheel: 0 }
        }
        let dx, dy
        if (panZoom.scale * scale > panZoom.scale) {
            dx = mouse.x - (mouse.x - panZoom.x) * scale
            dy = mouse.y - (mouse.y - panZoom.y) * scale

        } else {
            dx = mouse.x - (mouse.x - panZoom.x) * scale
            dy = mouse.y - (mouse.y - panZoom.y) * scale
        }
        scaleAt(dx, dy, scale)
    }
}

function scaleAt(parX, parY, sc) {
    panZoom = { ...panZoom, scale: panZoom.scale * sc, x: parX, y: parY }
    apply()

}

function apply() {
    clearTimeout(myTimeout);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.setTransform(panZoom.scale, 0, 0, panZoom.scale, panZoom.x, panZoom.y)
    myTimeout = setTimeout(update, 250);
}

function update() {
    
    x_canvas_min = (0 - panZoom.x) / panZoom.scale
    x_canvas_max = ((canvas.width) - panZoom.x) / panZoom.scale

    y_canvas_min = (0 - panZoom.y) / panZoom.scale
    y_canvas_max = ((canvas.height) - panZoom.y) / panZoom.scale

    x_min = ((x_canvas_min - 0) / canvas.width) * (2.6558 - (-2.1820)) + (-2.1820)
    x_max = ((x_canvas_max - 0) / canvas.width) * (2.6558 - (-2.1820)) + (-2.1820)

    y_min = ((y_canvas_min - 0) / canvas.height) * (9.9983 - (0)) + (0)
    y_max = ((y_canvas_max - 0) / canvas.height) * (9.9983 - (0)) + (0)
    const maxIterations = Math.round(_maxIterations * panZoom.scale);

    ctx.fillStyle = "#fff"
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < maxIterations; i++) {
        let newX, newY
        let r = Math.random();
        if (r < _p1) {
            newX = 0;
            newY = 0.16 * y;
        } else if (r < _p1 + _p2) {
            newX = 0.85 * x + 0.04 * y;
            newY = -0.04 * x + 0.85 * y + 1.6;
        } else if (r < _p1 + _p2 + _p3) {
            newX = 0.20 * x - 0.26 * y;
            newY = 0.23 * x + 0.22 * y + 1.6;
        } else {
            newX = -0.15 * x + 0.28 * y;
            newY = 0.26 * x + 0.24 * y + 0.44;
        }

        let plotX = ((x - x_min) / (x_max - x_min)) * (canvas.width - 0) + 0;
        let plotY = ((y - y_min) / (y_max - y_min)) * (canvas.height - 0) + 0;

        if (plotX >= x_canvas_min && plotX <= x_canvas_max && plotY >= y_canvas_min && plotY <= y_canvas_max) {
            paint(plotX, plotY);
        }
        x = newX;
        y = newY;
    }
    ctx2.setTransform(1, 0, 0, 1, 0, 0);
    ctx2.clearRect(0, 0, canvas.width, canvas.height);
    ctx2.fillStyle = "#000"
    ctx2.fillRect(0, 0, canvas.width, canvas.height)
    ctx2.setTransform(panZoom.scale, 0, 0, panZoom.scale, panZoom.x, panZoom.y)
    
    ctx2.drawImage(canvas, 0, 0)








}

function paint(x, y) {
    ctx.fillRect(x, y, 1, 1)
}


