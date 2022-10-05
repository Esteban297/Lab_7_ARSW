const apievent = (function () {

    let CordX;
    let CordY;
    let puntos;

    function makeDrawFunction() {
        try {
            if ($("#actual-name").text() !== "Current blueprint:") {
                const elem = document.getElementById("myCanvas");
                const context = elem.getContext('2d');
                context.beginPath();
                return function (e) {
                    const offset = $(elem).offset();
                    context.moveTo(CordX, CordY);
                    CordX = e.clientX - offset.left;
                    CordY = e.clientY - offset.top;
                    try{
                        puntos.push({x: CordX, y: CordY})
                    } catch (e) {
                        console.log("Fcita No puedo Dibujar :'v")
                    }
                    context.lineTo(CordX, CordY);
                    context.stroke();
                }
            }
        } catch (error){
            console.log("Fcita No puedo Dibujar :'v")
        }
    }

    function updatepuntos(points) {
        puntos = points;
        CordX = puntos[puntos.length - 1].x
        CordY = puntos[puntos.length - 1].y
    }

    function init() {
        $("#myCanvas").click(makeDrawFunction());
    }

    function clearCanvas(){
        console.log("sadsadasdasd");
        $("#myCanvas").click(function () {
            return false;
        });
    }

    function getPuntos() {
        return puntos;
    }

    return {
        makeDrawFunction: makeDrawFunction,
        init: init,
        updatepuntos: updatepuntos,
        getPuntos: getPuntos,
        clearCanvas: clearCanvas
    }

})();