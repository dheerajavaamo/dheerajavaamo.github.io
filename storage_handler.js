let scroll_offset;

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
            (async () => {
                $("#first-name").attr("value", await translateIfRequired(first_name, user_locale, "en-US"));
                $("#account-number").attr("value", await translateIfRequired(account_number, user_locale, "en-US"));
                $("#towed").attr("value", await translateIfRequired(towed, user_locale, "en-US"));
                $("#other_vehicle_information").html(await translateIfRequired(other_vehicle_information, user_locale, "en-US"));
                $("#phone").attr("value", await translateIfRequired(phone, user_locale, "en-US"));
                $("#datetime").attr("value", await translateIfRequired(datetime, user_locale, "en-US"));
                $("#car-make").attr("value", await translateIfRequired(car_make, user_locale, "en-US"));
                $("#car-model").attr("value", await translateIfRequired(car_model, user_locale, "en-US"));
                // $("#accident-details").html(accident_details);

                $("#accident_location").attr("value", await translateIfRequired(accident_location, user_locale, "en-US"));
                // $("#accident_city").attr("value", accident_city);
                $("#other_passengers_in_car").attr("value", await translateIfRequired(other_passengers_in_car, user_locale, "en-US"));
                $("#injuries").attr("value", await translateIfRequired(injuries, user_locale, "en-US"));
                $("#time_of_accident").attr("value", await translateIfRequired(time_of_accident, user_locale, "en-US"));
                $("#damage_location").attr("value", await translateIfRequired(damage_location, user_locale, "en-US"));
                $("#how_many_vehicles_damaged").attr("value", await translateIfRequired(how_many_vehicles_damaged, user_locale, "en-US"));

                if(!scroll_offset){
                    scroll_offset = document.querySelector("#first-name").getBoundingClientRect().top;
                }

                let firstBlankField = $('select,input,textarea').filter(function() { return $(this).val() == ""; })[0];
                if(firstBlankField){
                    // firstBlankField.scrollIntoView(false);
                    scrollToTargetAdjusted(firstBlankField);
                }
            })();
            
        },
    });
}

function scrollToTargetAdjusted(element){
    var scrollView = document.querySelector("form.form");
    var headerOffset = scroll_offset || 170;
    var elementPosition = element.getBoundingClientRect().top;
    var offsetPosition = elementPosition - headerOffset + scrollView.scrollTop;
    
    console.log("offset", elementPosition, offsetPosition);

    scrollView.scrollTo({
         top: offsetPosition,
         behavior: "smooth"
    });
}