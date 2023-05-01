

let canvas;
let ctx;
let x = 0, y = 0;

let panZoom = { x: 0, y: 0, scale: 1 }
let mouse = { x: 0, y: 0, wheel: 0 }

let points = []

window.onload = function () {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d")
    body = document.getElementById("body")

    canvas.addEventListener("wheel", handleWheel)
    canvas.addEventListener("mousemove", handleMouse)
    canvas.addEventListener("mousedown", handleMouseDown)
    canvas.addEventListener("mouseup", handleMouseUp)


    canvas.width = body.offsetHeight - 10
    canvas.height = body.offsetHeight - 10


    ctx.fillRect(0, 0, canvas.width, canvas.height)
    setInterval(() => {

        for (let i = 0; i < 20; i++)
            update();

    }, 1000 / 100);
};


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
}

function update() {
    let newX, newY
    let r = Math.random();
    let indicator = ''
    if (r < 0.01) {
        newX = 0;
        newY = 0.16 * y;
        indicator = 'stem'
    } else if (r < 0.86) {
        newX = 0.85 * x + 0.04 * y;
        newY = -0.04 * x + 0.85 * y + 1.6;
        indicator = 'smaller'
    } else if (r < 0.93) {
        newX = 0.20 * x - 0.26 * y;
        newY = 0.23 * x + 0.22 * y + 1.6;
        indicator = 'left-hand'
    } else {
        newX = -0.15 * x + 0.28 * y;
        newY = 0.26 * x + 0.24 * y + 0.44;
        indicator = 'right-hand'
    }



    let valorMinimoEscalado = (0 - panZoom.x) / panZoom.scale
    let valorMaximoEscalado = (canvas.width - 100) - panZoom.x

    let valorMaximoEscaladoY = (canvas.height - 100) - panZoom.x

    let plotX = ((x - (-2.1820)) / (2.6558 - (-2.1820))) * ((valorMaximoEscalado) - valorMinimoEscalado) + valorMinimoEscalado


    let plotY = (y * valorMaximoEscaladoY) / 9.9983



    ctx.beginPath()
    switch (indicator) {
        case 'stem':
            ctx.fillStyle = '#043600'
            break;
        case 'smaller':
            ctx.fillStyle = '#15ff00'
            break;
        case 'left-hand':
            ctx.fillStyle = '#9efa25'
            break;
        case 'right-hand':
            ctx.fillStyle = '#9efa25'
            break;

        default:
            ctx.fillStyle = '#fff'
            break;
    }
    ctx.fillRect(plotX, plotY, 1, 1)

    x = newX
    y = newY

}
