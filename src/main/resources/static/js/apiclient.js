var api = (function () {
    return {
        getBlueprintsByAuthor: function (author, callback) {
            const promise = $.get({
                url: "/blueprints/" + author,
                contentType: "application/json",
            });
            promise.then(function (data) {
                    callback(null, data);
                }, function (error) {
                    window.location.href = "/"
                    alert("No existen datos del autor o se ha eliminado todo del mismo!")
                }
            );
        },

        getBlueprintsByNameAndAuthor: function (name, author, callback) {
            const promise = $.get({
                url: "/blueprints/" + author + "/" + name,
                contentType: "application/json",
            });
            promise.then(function (data) {
                    callback(null, data);
                }, function (error) {
                    alert("No existen datos del autor!")
                }
            );
        }
    }
})();