

function getStorage(url) {
    $.ajax({
        async: true,
        type: "GET",
        url: proxyurl + url,
        headers: {
            "Content-Type": "application/json",
            "access-token": "23c0601fb7704e30836cea931e266b26",
        },
        success: function (json) {
            for (let obj of json.storage) {
                if (obj.key == "person") {
                    var first_name = obj.value;
                }
                if (obj.key == "last_name_1") {
                    var last_name = obj.value;
                }
                if (obj.key == "insurance_type_1") {
                    var insurance_type = obj.value;
                }
                if (obj.key == "email") {
                    var email = obj.value;
                }
                if (obj.key == "account_number_1") {
                    var account_number = obj.value;
                }
                if (obj.key == "drivers_license") {
                    var drivers_license = obj.value;
                }
                if (obj.key == "custom_city_1") {
                    var city = obj.value;
                }
                if (obj.key == "custom_state_1") {
                    var state = obj.value;
                }
                if (obj.key == "location_1") {
                    var location = obj.value;
                }
                if (obj.key == "zip_code") {
                    var zip_code = obj.value;
                }
                if (obj.key == "custom_country_1") {
                    var country = obj.value;
                }
                if (obj.key == "phone") {
                    var phone = obj.value;
                }
                if (obj.key == "datetime") {
                    var datetime = obj.value;
                }
                if (obj.key == "car_make_1") {
                    var car_make = obj.value;
                }
                if (obj.key == "car_model_1") {
                    var car_model = obj.value;
                }
                if (obj.key == "accident_details_1" && obj.value) {
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
            $("#drivers-license").attr("value", drivers_license);
            // $("#city").attr("value", city);
            // $("#state").attr("value", state);
            $("#location").attr("value", location);
            // $("#zip-code").attr("value", zip_code);
            $("#phone").attr("value", phone);
            $("#datetime").attr("value", datetime);
            $("#car-make").attr("value", car_make);
            $("#car-model").attr("value", car_model);
            $("#accident-details").html(accident_details);

            let firstBlankField = $('select,input,textarea').filter(function() { return $(this).val() == ""; })[0];
            if(firstBlankField){
                firstBlankField.scrollIntoView(false);
            }
        },
    });
}