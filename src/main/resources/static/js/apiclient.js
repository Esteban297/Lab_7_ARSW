var apiclient = (function () {
    return {
        getBlueprintsByAuthor: function (author, callback) {
            const promise = $.get({
                url: "/blueprints/" + author,
                contentType: "application/json",
            });
            promise.then(function (data) {
                    callback(null, data);
                }, function (error) {
                    alert("No existen datos del autor!")
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