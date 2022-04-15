const palettes = document.querySelectorAll(".palette");
const palette1 = document.querySelector(".palette");
const container = document.querySelector(".palette-container");
const mask = document.querySelector(".mask");
const changeButton = document.querySelector(".changeColor");
const turnBackButton = document.querySelector(".back");
const turnFrontButton = document.querySelector(".front");
const lockButtons = document.querySelectorAll(".lock");
const saveButton = document.querySelector(".saveColor");
const closeButton = document.querySelector(".saveColorWindow .close");
const saveColorWindow = document.querySelector(".saveColorWindow");
const cancelButton = document.querySelector(".saveColorWindow .cancel");
const save = document.querySelector(".saveColorWindow .save");
const colorSideMenuButton = document.querySelector(".colorSideMenuButton");
const colorSideMenu = document.querySelector(".colorSideMenu");
const colorSideMenuClose = document.querySelector(".colorSideMenuClose");
const sideMenuContainer = document.querySelector(".sideMenuContainer");
const copyButton = document.querySelector(".copy");
const colorSelectors = document.querySelectorAll("input[type=color]");
const btns = document.querySelectorAll(".btn");
const i = document.querySelectorAll(".btn i");
const moveButton = document.querySelector(".move");
//////////// 這邊是對手機端瀏覽器做一些優化
//符合螢幕高度
let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty("--vh", `${vh}px`);
//雙點擊不要放大螢幕
document.addEventListener("gesturestart", function (e) {
    e.preventDefault();
});
document.addEventListener("dblclick", (e) => {
    e.preventDefault();
});
btns.forEach((btn) => {
    btn.addEventListener("gesturestart", function (e) {
        e.preventDefault();
    });
    btn.addEventListener("dblclick", () => {
        e.preventDefault();
    });
});
i.forEach((btn) => {
    btn.addEventListener("gesturestart", function (e) {
        e.preventDefault();
    });
});
//禁止滑動
const html = document.querySelector("html");
const body = document.querySelector("body");
html.addEventListener("pointerdown", (e) => {
    e.preventDefault();
});
html.addEventListener("pointermove", (e) => {
    e.preventDefault();
});
body.addEventListener("pointerdown", (e) => {
    e.preventDefault();
});
body.addEventListener("pointermove", (e) => {
    e.preventDefault();
});
///////////
let colorHistory = [];
let currentHistory = 0;
//create a random hex
function randomHex() {
    let hex = Math.floor(Math.random() * 0xffffff)
        .toString(16)
        .padEnd(6, "0");
    return hex;
}
// transform hex to RGB
function hexToRGB(hex) {
    let RGB =
        "rgb(" +
        parseInt("0x" + hex.slice(0, 2)) +
        "," +
        parseInt("0x" + hex.slice(2, 4)) +
        "," +
        parseInt("0x" + hex.slice(4, 6)) +
        ")";
    return {
        r: parseInt("0x" + hex.slice(0, 2)),
        g: parseInt("0x" + hex.slice(2, 4)),
        b: parseInt("0x" + hex.slice(4, 6)),
        rgb: RGB,
    };
}
function brightnessChange(palette, hex) {
    const { r, g, b } = hexToRGB(hex);
    console.log(r * 0.299 + g * 0.578 + b * 0.114);
    //乘上的數值為網路上的公式
    if (r * 0.299 + g * 0.578 + b * 0.114 >= 160) {
        palette.children[0].style.color = "black";
        palette.children[1].style.color = "black";
        palette.children[2].style.color = "black";
        palette.children[3].style.color = "black";
        palette.children[4].style.color = "black";
    } else {
        palette.children[0].style.color = "white";
        palette.children[1].style.color = "white";
        palette.children[2].style.color = "white";
        palette.children[3].style.color = "white";
        palette.children[4].style.color = "white";
    }
}
//click button to change colors
function changeColor(palette) {
    const hex = randomHex().toUpperCase();
    palette.style.backgroundColor = `#${hex}`;
    palette.children[3].value = `#${hex}`;
    palette.children[0].innerHTML = hex;

    //whenever change color,saving color to the element's attribute:data-color
    palette.dataset.color = hex;
    brightnessChange(palette, hex);
}
function selectColor(element) {
    element.addEventListener("change", () => {
        let palette = element.parentElement;
        let hex = element.value.toUpperCase();

        console.log(typeof hex);
        console.log(hex);
        palette.style.background = hex;
        palette.dataset.color = hex.slice(1, 7);
        palette.children[0].innerHTML = hex.slice(1, 7);

        brightnessChange(palette, hex.slice(1, 7));
    });
}

function initializePalette() {
    let subColorArr = [];
    palettes.forEach((palette) => {
        changeColor(palette);
        subColorArr.push(palette.dataset.color);

        //add colorHex to span
        const collection = document.querySelector(".collection");
        const colorBlock = document.createElement("div");
        const hexNumber = document.createElement("span");
        colorBlock.appendChild(hexNumber);
        colorBlock.classList.add("colorBlock");
        collection.appendChild(colorBlock);

        //add eventListener to copyButton
        const copyButton = palette.children[2];
        copyButton.addEventListener("click", copyHex);

        //use color input to change color;
        const colorSelector = palette.children[5];

        selectColor(colorSelector);

        // add Drag event to palette;
        // addDragEvt(palette);
    });
    //push color set to colorHistory;
    colorHistory.push(subColorArr);
}

initializePalette();
function turnBack() {
    if (currentHistory > 0) {
        currentHistory--;
        palettes.forEach((palette, index) => {
            palette.dataset.color = `${colorHistory[currentHistory][index]}`;
            palette.style.backgroundColor = `#${colorHistory[currentHistory][index]}`;
            palette.children[0].innerHTML = colorHistory[currentHistory][index];
            palette.children[3].value = `#${colorHistory[currentHistory][index]}`;
            console.log(palette.style.backgroundColor);
            brightnessChange(palette, colorHistory[currentHistory][index]);
        });
    }
}
function turnFront() {
    if (currentHistory < colorHistory.length - 1) {
        currentHistory++;
        palettes.forEach((palette, index) => {
            palette.dataset.color = `${colorHistory[currentHistory][index]}`;
            palette.style.backgroundColor = `#${colorHistory[currentHistory][index]}`;
            palette.children[0].innerHTML = colorHistory[currentHistory][index];
            palette.children[3].value = `#${colorHistory[currentHistory][index]}`;
            brightnessChange(palette, colorHistory[currentHistory][index]);
        });
    }
}

changeButton.addEventListener("click", () => {
    const palettes = document.querySelectorAll(".palette");
    //當改變顏色時會將colorHistory[currentHistory]後面的顏色清空
    colorHistory = colorHistory.filter((colors, index) => {
        return index <= currentHistory;
    });

    palettes.forEach((palette) => {
        if (palette.children[1].dataset.lock == "false") {
            changeColor(palette);
        }
    });
    //to save current color set
    let subColorArr = [];
    palettes.forEach((palette) => {
        subColorArr.push(palette.dataset.color);
    });
    colorHistory.push(subColorArr);
    currentHistory++;
    console.log(colorHistory);
});

turnBackButton.addEventListener("click", turnBack);
turnFrontButton.addEventListener("click", turnFront);
lockButtons.forEach((button) => {
    button.addEventListener("click", function () {
        if (this.dataset.lock == "false") {
            this.dataset.lock = "true";
            this.children[0].style.display = "none";
            this.children[1].style.display = "inline-block";
        } else {
            this.dataset.lock = "false";
            this.children[0].style.display = "inline-block";
            this.children[1].style.display = "none";
        }
    });
});

function mapArrayColorsToSideMenu(colorArr) {
    let sideMenuItem = document.createElement("div");
    let sideMenuItemColors = document.createElement("div");
    let selectColor = document.createElement("button");
    selectColor.innerHTML = "選擇";
    selectColor.classList.add("selectColor");
    let deleteColor = document.createElement("button");
    deleteColor.innerHTML = "刪除";
    deleteColor.classList.add("deleteColor");
    sideMenuItemColors.classList.add("colors");
    sideMenuItem.classList.add("sideMenuItem");
    sideMenuItem.appendChild(sideMenuItemColors);

    sideMenuItem.appendChild(selectColor);
    sideMenuItem.appendChild(deleteColor);
    colorArr.forEach((hex) => {
        let colorBox = document.createElement("div");
        colorBox.dataset.color = hex;
        colorBox.style.background = `#${hex}`;
        sideMenuItemColors.appendChild(colorBox);
    });
    sideMenuContainer.appendChild(sideMenuItem);

    selectColor.addEventListener("click", (e) => {
        console.log(e.target.parentElement.children[0].childNodes);
        let colors = e.target.parentElement.children[0].childNodes;
        const palettes = document.querySelectorAll(".palette");
        console.log(palettes[0]);
        console.log(colors[1].dataset.color);

        colors.forEach((color, index) => {
            console.log(index);
            palettes[index].dataset.color = color.dataset.color;
            palettes[index].style.background = `#${color.dataset.color}`;
            palettes[index].children[0].innerHTML = color.dataset.color;
            palettes[index].children[3].value = `#${color.dataset.color}`;
            brightnessChange(palettes[index], color.dataset.color);
        });
        colorSideMenu.classList.toggle("colorSideMenuOn");
        mask.style.zIndex = "-1";
    });
    deleteColor.addEventListener("click", (e) => {
        let colorList = JSON.parse(localStorage.getItem("colorList"));

        console.log(sideMenuContainer.childNodes);

        sideMenuContainer.childNodes.forEach((child, index) => {
            if (child === e.target.parentElement) {
                colorList.splice(index, 1);
            }
        });

        localStorage.setItem("colorList", JSON.stringify(colorList));
        e.target.parentElement.remove();
    });
}

//get localStorage data and map then to sidemenu
let colorList = localStorage.getItem("colorList");
if (colorList !== null) {
    colorList = JSON.parse(colorList);
    colorList.forEach(mapArrayColorsToSideMenu);
} else {
    colorList = [];
}

saveButton.addEventListener("click", () => {
    const palettes = document.querySelectorAll(".palette");
    const colorBlocks = document.querySelectorAll(".colorBlock");

    saveColorWindow.classList.toggle("saveColorWindowOn");
    mask.style.zIndex = "3";
    colorBlocks.forEach((colorBlock, index) => {
        colorBlock.style.backgroundColor = `#${palettes[index].dataset.color}`;
        colorBlock.children[0].innerHTML = palettes[index].dataset.color;
    });
});
closeButton.addEventListener("click", () => {
    mask.style.zIndex = "-1";
    saveColorWindow.classList.remove("saveColorWindowOn");
});
cancelButton.addEventListener("click", () => {
    mask.style.zIndex = "-1";
    saveColorWindow.classList.remove("saveColorWindowOn");
});

save.addEventListener("click", () => {
    const palettes = document.querySelectorAll(".palette");
    let arr = [];
    palettes.forEach((palette) => {
        arr.push(palette.dataset.color);
    });
    colorList.push(arr);
    localStorage.setItem("colorList", JSON.stringify(colorList));
    mapArrayColorsToSideMenu(arr);
    saveColorWindow.classList.remove("saveColorWindowOn");
    mask.style.zIndex = "-1";
});

colorSideMenuButton.addEventListener("click", () => {
    colorSideMenu.classList.toggle("colorSideMenuOn");
    mask.style.zIndex = "3";
});
colorSideMenuClose.addEventListener("click", () => {
    colorSideMenu.classList.toggle("colorSideMenuOn");
    mask.style.zIndex = "-1";
});

mask.addEventListener("click", () => {
    colorSideMenu.classList.remove("colorSideMenuOn");
    saveColorWindow.classList.remove("saveColorWindowOn");
    mask.style.zIndex = "-1";
});
function copyHex(e) {
    let colorHex = this.parentElement.dataset.color;
    const input = document.createElement("input");
    document.body.appendChild(input);
    input.value = `#${colorHex}`;
    input.select();
    document.execCommand("copy");
    document.body.removeChild(input);
    window.alert("已複製該顏色");
}

let spans = document.querySelectorAll("span");
spans.forEach((span) => {
    span.addEventListener("mousedown", (e) => {
        e.stopPropagation();
    });
});

function addDragEvt(element) {
    element.addEventListener("mousedown", () => {
        element.setAttribute("draggable", "true");
    });
    element.addEventListener("dragstart", (e) => {
        element.classList.add("dragging");
        source = element;
    });
    element.addEventListener("dragend", () => {
        element.classList.remove("dragging");
        element.removeAttribute("draggable");
        source = null;
    });
}

let overItem = null;
function cleanOverItem() {
    if (!overItem) return;
    overItem.classList.remove("before");
    overItem.classList.remove("after");
    overItem = null;
}
function addDropEvt(element) {
    element.addEventListener("dragover", (e) => {
        cleanOverItem();

        if (e.target.getAttribute("data-color") && e.target !== source) {
            overItem = e.target;

            if (e.offsetX > e.target.offsetWidth / 2) {
                overItem.classList.add("after");
            } else {
                overItem.classList.add("before");
            }
        }
        e.preventDefault();
    });
    element.addEventListener("drop", (e) => {
        const list = document.querySelector(".palette-container");
        if (overItem) {
            if (overItem.classList.contains("before")) {
                list.insertBefore(source, overItem);
            } else {
                list.insertBefore(source, overItem.nextElementSibling);
            }
        } else {
            if (e.currentTarget.contains(source)) return;
            list.appendChild(source);
        }
        cleanOverItem();
    });
}

// addDropEvt(container);

//use when width less 950px;
let containerHeight = container.offsetHeight;
let paletteHeight = containerHeight / 5;
let paletteMidLineY = [];
//use when width more 950px;
let containerWidth = container.offsetWidth;
let paletteWidth = containerWidth / 5;
let paletteMidLineX = [];

palettes.forEach((palette, index) => {
    paletteMidLineY.push(paletteHeight / 2 + paletteHeight * index);
    paletteMidLineX.push(paletteWidth / 2 + paletteWidth * index);
    palette.dataset.index = index;
    palette.dataset.number = index;
    palette.dataset.move = "false";

    for (let i = 0; i < palette.childElementCount; i++) {
        if (i !== 3) {
            palette.children[i].addEventListener("pointerdown", (e) => {
                e.stopPropagation();
            });
            palette.children[i].addEventListener("pointerup", (e) => {
                e.stopPropagation();
            });
        }
    }

    addPointerEvt(palette, index);
});

function addPointerEvt(element, index) {
    let itemIndex;

    function translateX(e) {
        e.preventDefault();
        let currentPalettePosition = Number(element.dataset.number);
        element.setPointerCapture(e.pointerId);

        const moveDistance = e.clientX - element.offsetWidth / 2 - element.offsetWidth * currentPalettePosition;
        element.style.transform = `translate(${moveDistance}px,0)`;

        if (e.clientX + element.offsetWidth / 2 > paletteMidLineX[itemIndex + 1]) {
            const nextElement = document.querySelector(`[data-index="${itemIndex + 1}"]`);
            if (nextElement.dataset.move == "true") {
                nextElement.style.transform = `translate(0,0px)`;
                element.dataset.index = itemIndex + 1;
                nextElement.dataset.index = itemIndex;
                nextElement.dataset.move = "false";
                itemIndex++;
                return;
            }
            nextElement.style.transform = `translate(${-element.offsetWidth}px,0)`;
            element.dataset.index = itemIndex + 1;
            nextElement.dataset.index = itemIndex;
            nextElement.dataset.move = "true";
            itemIndex++;
        }
        if (e.clientX - element.offsetWidth / 2 < paletteMidLineX[itemIndex - 1]) {
            const lastElement = document.querySelector(`[data-index="${itemIndex - 1}"]`);

            if (lastElement.dataset.move == "true") {
                lastElement.style.transform = `translate(0,0)`;
                element.dataset.index = itemIndex - 1;
                lastElement.dataset.index = itemIndex;
                lastElement.dataset.move = "false";
                itemIndex--;
                return;
            }
            lastElement.style.transform = `translate(${element.offsetWidth}px,0)`;
            element.dataset.index = itemIndex - 1;
            lastElement.dataset.index = itemIndex;
            lastElement.dataset.move = "true";
            itemIndex--;
        }
    }

    function translateY(e) {
        e.preventDefault();
        let currentPalettePosition = Number(element.dataset.number);
        element.setPointerCapture(e.pointerId);

        const moveDistance = e.clientY - element.offsetHeight / 2 - element.offsetHeight * currentPalettePosition;
        element.style.transform = `translate(0,${moveDistance}px)`;

        if (e.clientY + element.offsetHeight / 2 > paletteMidLineY[itemIndex + 1]) {
            const nextElement = document.querySelector(`[data-index="${itemIndex + 1}"]`);
            if (nextElement.dataset.move == "true") {
                nextElement.style.transform = `translate(0,0px)`;
                element.dataset.index = itemIndex + 1;
                nextElement.dataset.index = itemIndex;
                nextElement.dataset.move = "false";
                itemIndex++;
                return;
            }
            nextElement.style.transform = `translate(0,${-element.offsetHeight}px)`;
            element.dataset.index = itemIndex + 1;
            nextElement.dataset.index = itemIndex;
            nextElement.dataset.move = "true";
            itemIndex++;
        }
        if (e.clientY - element.offsetHeight / 2 < paletteMidLineY[itemIndex - 1]) {
            const lastElement = document.querySelector(`[data-index="${itemIndex - 1}"]`);

            if (lastElement.dataset.move == "true") {
                lastElement.style.transform = `translate(0,0)`;
                element.dataset.index = itemIndex - 1;
                lastElement.dataset.index = itemIndex;
                lastElement.dataset.move = "false";
                itemIndex--;
                return;
            }
            lastElement.style.transform = `translate(0,${element.offsetHeight}px)`;
            element.dataset.index = itemIndex - 1;
            lastElement.dataset.index = itemIndex;
            lastElement.dataset.move = "true";
            itemIndex--;
        }
    }

    element.addEventListener("pointerdown", (e) => {
        console.log(window.innerWidth);
        element.style.zIndex = "8";
        itemIndex = Number(element.dataset.index);
        if (window.innerWidth <= 950) {
            element.addEventListener("pointermove", translateY);
            element.removeEventListener("pointermove", translateX);
        }
        if (window.innerWidth > 950) {
            element.addEventListener("pointermove", translateX);
            element.removeEventListener("pointermove", translateY);
        }
    });

    element.addEventListener("pointerup", (e) => {
        for (let i = 0; i < 5; i++) {
            const palette = document.querySelector(`[data-index="${i}"]`);
            palette.dataset.move = "false";
            palette.dataset.number = `${palette.dataset.index}`;
            palette.style.transform = `translate(0,0)`;
            palette.style.zIndex = "0";

            container.appendChild(palette);
        }
        element.releasePointerCapture(e.pointerId);
        element.removeEventListener("pointermove", translateY);
        element.removeEventListener("pointermove", translateX);
    });
}
