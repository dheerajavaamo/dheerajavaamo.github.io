

function getStorage(url) {
    $.ajax({
        async: true,
        type: "GET",
        url: proxyurl + url,
        headers: {
            "Content-Type": "application/json",
            "access-token": storage_access_token,
        },
        success: function (json) {
            for (let obj of json.storage) {
                if (obj.key == "person") {
                    var first_name = obj.value;
                }
                else if (obj.key == "account_number_1") {
                    var account_number = obj.value;
                }
                else if (obj.key == "phone") {
                    var phone = obj.value;
                }
                else if (obj.key == "accident_location") {
                    var accident_location = obj.value;
                }
                else if (obj.key == "accident_city") {
                    var accident_city = obj.value;
                }
                
                else if (obj.key == "car_make_1") {
                    var car_make = obj.value;
                }
                else if (obj.key == "car_model_1") {
                    var car_model = obj.value;
                }

                else if (obj.key == "other_passengers_in_car") {
                    var other_passengers_in_car = obj.value;
                }
                else if (obj.key == "other_vehicle_information") {
                    var other_vehicle_information = obj.value;
                }
                else if (obj.key == "injuries") {
                    var injuries = obj.value;
                }
                else if (obj.key == "towed") {
                    var towed = obj.value;
                }
                else if (obj.key == "datetime") {
                    var datetime = obj.value;
                }
                else if (obj.key == "time_of_accident") {
                    var time_of_accident = obj.value;
                }
                else if (obj.key == "damage_location") {
                    var damage_location = obj.value;
                }
                else if (obj.key == "how_many_vehicles_damaged") {
                    var how_many_vehicles_damaged = obj.value;
                }
                else if (obj.key == "accident_details_1" && obj.value) {
                    var accident_details = JSON.parse(obj.value).join(". ");
                    console.log(accident_details);
                }
                // if (debug.includes(obj.key)) {
                //   html += "<div>" + obj.key + ": " + obj.value + "</div>";
                // }
            }
            // $("#form-data").html("<p>" + html + "</p>");
            // console.log(html);
            $("#first-name").attr("value", first_name);
            $("#account-number").attr("value", account_number);
            $("#location").attr("value", location);
            $("#towed").attr("value", towed);
            $("#other_vehicle_information").html(other_vehicle_information);
            $("#phone").attr("value", phone);
            $("#datetime").attr("value", datetime);
            $("#car-make").attr("value", car_make);
            $("#car-model").attr("value", car_model);
            $("#accident-details").html(accident_details);

            $("#accident_location").attr("value", accident_location);
            // $("#accident_city").attr("value", accident_city);
            $("#other_passengers_in_car").attr("value", other_passengers_in_car);
            $("#injuries").attr("value", injuries);
            $("#time_of_accident").attr("value", time_of_accident);
            $("#damage_location").attr("value", damage_location);
            $("#how_many_vehicles_damaged").attr("value", how_many_vehicles_damaged);

            let firstBlankField = $('select,input,textarea').filter(function() { return $(this).val() == ""; })[0];
            if(firstBlankField){
                // firstBlankField.scrollIntoView(false);
                scrollToTargetAdjusted(firstBlankField);
            }
        },
    });
}

function scrollToTargetAdjusted(element){
    var scrollView = document.querySelector("form.form");
    var headerOffset = 170;
    var elementPosition = element.getBoundingClientRect().top;
    var offsetPosition = elementPosition - headerOffset + scrollView.scrollTop;
    
    console.log("offset", elementPosition, offsetPosition);

    scrollView.scrollTo({
         top: offsetPosition,
         behavior: "smooth"
    });
}