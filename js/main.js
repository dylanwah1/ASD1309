$('itourstart').on('pageinit', function () {

});
$('#homeitour').on('pageinit', function () {
    $('#tourList').on('click', getData);
    $('#clearData').on('click', clearLocalData);

});

$('#addTour').on('pageinit', function () {

    var myForm = $('#tourForm');
    myForm.validate({
        invalidHandler: function (form, validator) {},
        submitHandler: function () {
            var data = myForm.serializeArray();
            saveData(data);
        }
    });


});
$('#tourList').on('pageinit', function () {
    getData(false);

});
$('#about').on('pageinit', function () {
    $.ajax({
        url: '_view/type',
        dataType: 'json',
        success: function (data) {
            console.log(data);
            $.each(data.rows, function (index, type) {
                var tourName = type.value.tourName;
                var sDate = type.value.sDate;
                var eDate = type.value.eDate;


                $('#tourList').append(
                $('<li>').append(
                $('<a>').attr("href", "#")
                    .text(tourName)

                ));
            });
            $('#tourList').listview('refresh');
        }
    });
});


var autoFillData = function () {
    var type = $(this).attr('id');

    if (type === 'listxml') {
        $.ajax({
            url: 'data.xml',
            type: 'GET',
            dataType: 'xml',
            success: function (result) {
                $(result).find('tour').each(function () {
                    var item = $(this);
                    var string = "";
                    string += '{"Tour Name":"' + item.find('tname').text() + '",';
                    string += '"Start Date":"' + item.find('sdate').text() + '",';
                    string += '"End Date":"' + item.find('edate').text() + '",';

                    var id = Math.floor(Math.random() * 99999999);
                    localStorage.setItem(id, string);
                });

            },
            error: function (result) {

            }
        });
    } else {
        $.ajax({
            url: 'data.json',
            type: 'GET',
            dataType: 'json',
            success: function (result) {
                console.log('JSON dummie data loaded');
                console.log(result);
                for (var n in result) {
                    var id = Math.floor(Math.random() * 99999999);
                    localStorage.setItem(id, JSON.stringify(result[n]));
                }

            },
            error: function (result) {

            }
        });
    }
};
var getData = function (load) {
    var labels = ["Tour Name: ", "Start Date: ", "End Date: "];
    if (localStorage.length === 0) {
        autoFillData();
        window.location.reload();
    }

    var appendLocation = $('#tourSelect').html("");
    load = false;



    for (var i = 0, j = localStorage.length; i < j; i++) {
        var key = localStorage.key(i);
        var value = localStorage.getItem(key);
        var obj = JSON.parse(value);

        var makeEntry = $('<div></div>')
            .attr('data-role', 'listview')
            .attr('id', key)
            .appendTo(appendLocation);

        var makeList = $('<ul></ul>').appendTo(makeEntry);
        var counter = 0;
        for (var z in obj) {
            var makeLi = $('<li></li>')
                .html(labels[counter] + obj[z])
                .appendTo(makeList);
            counter++;
        }

        var buttonHolder = $('<div></div>').attr('class', 'ui-grid-a').appendTo(makeEntry);
        var editButtonDiv = $('<div></div>').attr('class', 'ui-block-a').appendTo(buttonHolder);
        var removeButtonDiv = $('<div></div>').attr('class', 'ui-block-b').appendTo(buttonHolder);
        var editButton = $('<a></a>')
            .attr('data-role', 'button')
            .attr('href', '#addTour')
            .html('Edit')
            .data('key', key)
            .appendTo(editButtonDiv)
            .on('click', editTour);
        var removeButton = $('<a></a>')
            .attr('data-role', 'button')
            .attr('href', '#')
            .html('Remove')
            .data('key', key)
            .appendTo(removeButtonDiv)
            .on('click', removeTour);
        $(makeEntry).trigger('create');
    }
    $(appendLocation).trigger('create');
};


var saveData = function (data) {
    key = $('#saveTourButton').data('key');
    if (!key) {
        var id = Math.floor(Math.random() * 100000000001);
    } else {
        var id = key;
    }
    var newTour = {};
    newTour.name = data[0].value;
    newTour.sdate = data[1].value;
    newTour.edate = data[2].value;

    localStorage.setItem(id, JSON.stringify(newTour));
    $('saveTourButton').html('Save New Tour').removeData('key');
    alert("Tour Saved!");
    $.mobile.changePage('#homeitour');

};

var editTour = function () {

    var data = $(this).data('key');
    var TourValue = localStorage.getItem(data);
    var tour = JSON.parse(tourValue);


    $('#name').val(tour.name);
    $('#sdate').val(tour.sdate);
    $('#edate').val(tour.edate);
    $('#key').val(data);



};

var removeTour = function () {
    var dele = confirm("Are you sure you want to drop off this tour?");
    if (dele) {
        localStorage.removeItem($(this).data('key'));
        window.location.reload();
    } else {
        alert("You stayed on this tour!");
    }
};

var clearLocalData = function () {

    if (localStorage === 0) {
        alert("You have no tours in local storage");
    } else {
        localStorage.clear();
        alert("Local storage has been deleted.");
        window.location.reload();
        return false;
    }
};