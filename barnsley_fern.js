

let canvas;
let ctx;
let ctx2;
let x = 0, y = 0;

let p1, p2, p3, p4, _p1 = 1 / 100, _p2 = 85 / 100, _p3 = 7 / 100, _p4 = 7 / 100



let panZoom = { x: 0, y: 0, scale: 1 }
let mouse = { x: 0, y: 0, wheel: 0 }

let points = []

let copyCanvas = document.createElement("canvas")

let pixeles
let pixelescopy

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

}
function handleWheel(e) {
    mouse = { ...mouse, wheel: mouse.wheel + -e.deltaY }
    let scale = 1
    if (mouse.wheel !== 0) {
        scale = mouse.wheel < 0 ? 1 / 1.01 : 1.01
        mouse = { ...mouse, wheel: mouse.wheel * 0.8 }
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
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.setTransform(panZoom.scale, 0, 0, panZoom.scale, panZoom.x, panZoom.y)
    update()
}

function update() {
    pixeles = ctx.getImageData(0, 0, canvas.width, canvas.height)
    for (let i = 0; i < 100000; i++) {
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

        let valorMinimoEscalado = (0 - panZoom.x) / panZoom.scale
        let valorMaximoEscalado = (canvas.width - 100) - panZoom.x
        let valorMaximoEscaladoY = (canvas.height - 100) - panZoom.x
        let plotX = ((x - (-2.1820)) / (2.6558 - (-2.1820))) * ((valorMaximoEscalado) - valorMinimoEscalado) + valorMinimoEscalado

        let plotY = (y * valorMaximoEscaladoY) / 9.9983

        paint(plotX, plotY)

        x = newX
        y = newY
    }

    ctx.putImageData(pixeles, 0, 0)

    ctx2.drawImage(canvas, 0, 0)

}

function paint(x, y) {


    let index = (Math.trunc(y) * pixeles.width + Math.trunc(x)) * 4
    pixeles.data[index + 1] = 255
    pixeles.data[index + 2] = 255
    pixeles.data[index + 3] = 255
    pixeles.data[index + 4] = 255


}


