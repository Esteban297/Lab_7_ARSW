const app = (function () {

    let author;
    let blueprintName;
    let useSelectedModule;
    let create = false;

    function getName() {
        $("#author-name").text(author + "'s " + "blueprints:");
    }

    function getBluePrintName() {
        $("#actual-name").text("Current blueprint: " + blueprintName);
    }

    function clearAll() {
        $("#actual-name").text("Current blueprint:");
        $("#button-der__id").css("visibility", "hidden");
        $("#button-izq__id").css("visibility", "hidden");
        $("#newbp").css("visibility", "hidden");
        apievent.clearCanvas();
        const c = document.getElementById("myCanvas");
        const ctx = c.getContext("2d");
        ctx.clearRect(0, 0, c.width, c.height);
        ctx.restore();
        ctx.beginPath();
    }

    function getNameAuthorBlueprints() {
        clearAll();
        useSelectedModule = "js/apiclient.js";
        author = $("#author").val();
        if (author === "") {
            alert("Debe ingresar un nombre !");
        } else {
            $.getScript(useSelectedModule, function () {
                api.getBlueprintsByAuthor(author, (req, resp) => {
                    parceroData(resp);
                });
            });
        }
    }

    function parceroData(data) {
        $("#table-blueprints tbody").empty();

        if (data === undefined) {
            alert("No existe el autor!");
            $("#author-name").empty();
            $("#user-points").empty();
        } else {
            getName();
            const datanew = data.map((elemento) => {
                return {
                    name: elemento.name,
                    puntos: elemento.points.length
                }
            });

            datanew.map((elementos) => {
                $("#table-blueprints > tbody:last").append($("<tr><td>" + elementos.name + "</td><td>" + elementos.puntos.toString() +
                    "</td><td>" + "<button  id=" + elementos.name + " onclick=app.getBlueprintByAuthorAndName(this)>open</button>" + "</td>"));
            });

            const totalPuntos = datanew.reduce((suma, {puntos}) => suma + puntos, 0);

            $("#user-points").text(totalPuntos);
        }
    }

    function getBlueprintByAuthorAndName(data) {
        $("#newbp").css("visibility", "hidden");
        author = $("#author").val();
        blueprintName = data.id;
        $.getScript(useSelectedModule, function () {
            api.getBlueprintsByNameAndAuthor(blueprintName, author, (req, resp) => {
                pintaparcero(resp);
            });
        });
    }

    function pintaparcero(data) {
        getBluePrintName();
        const puntos = data.points;
        const c = document.getElementById("myCanvas");
        const ctx = c.getContext("2d");
        ctx.clearRect(0, 0, c.width, c.height);
        ctx.restore();
        ctx.beginPath();
        for (let i = 1; i < puntos.length; i++) {
            ctx.moveTo(puntos[i - 1].x, puntos[i - 1].y);
            ctx.lineTo(puntos[i].x, puntos[i].y);
            if (i === puntos.length - 1) {
                ctx.moveTo(puntos[i].x, puntos[i].y);
                ctx.lineTo(puntos[0].x, puntos[0].y);
            }
        }
        ctx.stroke();
        apievent.updatepuntos(puntos)
        apievent.init()
        visibility()
    }

    function visibility() {
        $("#button-der__id").css("visibility", "visible");
        $("#button-izq__id").css("visibility", "visible");
    }

    function saveUpdate() {
        if (create) {
            saveBlueprint();
            create = false;
        } else {
            updateBlueprint();
        }
    }

    function saveBlueprint() {
        let bluep = $("#newbp").val();
        blueprintName = bluep;
        let punticos = apievent.getPuntos();
        const promise = $.post({
            url: "/blueprints",
            contentType: "application/json",
            data: "{\"author\": \"" + author + "\",\"points\":" + JSON.stringify(punticos) + ",\"name\":" + "\"" + bluep + "\"" + "}",
        });
        promise.then(function (data) {
                $.getScript(useSelectedModule, function () {
                    api.getBlueprintsByAuthor(author, (req, resp) => {
                        parceroData(resp);
                    });
                });
            }, function (error) {
                alert("No se pudo crear el blueprint")
            }
        );
    }

    function updateBlueprint() {
        let punticos = apievent.getPuntos();
        return $.ajax({
            url: "/blueprints" + "/" + author + "/" + blueprintName,
            type: 'PUT',
            data: "{\"author\": \"" + author + "\",\"points\":" + JSON.stringify(punticos) + ",\"name\":" + "\"" + blueprintName + "\"" + "}",
            contentType: "application/json",
            success: function (data) {
                $.getScript(useSelectedModule, function () {
                    api.getBlueprintsByAuthor(author, (req, resp) => {
                        parceroData(resp);
                    });
                });
            }
        });
    }

    function deleteBlueprint() {
        return $.ajax({
            url: "/blueprints" + "/" + author + "/" + blueprintName,
            type: 'DELETE',
            contentType: "application/json",
            success: function (data) {
                $.getScript(useSelectedModule, function () {
                    api.getBlueprintsByAuthor(author, (req, resp) => {
                        clearAll();
                        parceroData(resp);
                    });
                });
            }
        });
    }

    function createNewBluePrint() {
        clearAll();
        $("#newbp").css("visibility", "visible");
        create = true;
    }

    function changeInputNew() {
        let bluep = $("#newbp").val();
        $("#actual-name").text("Current blueprint: " + bluep);
        let puntos = [];
        puntos.push({x: 0, y: 0});
        apievent.updatepuntos(puntos)
        apievent.init()
        visibility()
    }

    return {
        getNameAuthorBlueprints: getNameAuthorBlueprints,
        getBlueprintByAuthorAndName: getBlueprintByAuthorAndName,
        saveUpdate: saveUpdate,
        createNewBluePrint: createNewBluePrint,
        changeInputNew: changeInputNew,
        deleteBlueprint: deleteBlueprint
    }

})();