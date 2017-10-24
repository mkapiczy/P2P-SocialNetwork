let findData = function () {
    document.getElementById("btnSearch").disabled = true;
    let name = document.getElementById("name").value;

    $.get("/data/endpoints", {key: name}, function(data) {
        document.getElementById("name").value = "";
        document.getElementById("btnSearch").disabled = false;
        if(data === "") {
            document.getElementById("result").value = "No results found!";
        } else {
            document.getElementById("result").value = data.value;
            document.getElementById("node").value = data.node;
        }

    });
};