//variables
let gifOffset = 0;
let imgPage = 1;
let nyti = 0;
let foodInput = "";
let nytResponse = {};

function getNutrition(foodInput) {

    //----------------------------------------------------------
    //beginning of nutrution query
    //variables for nutrition input
    let foodID = ""
    const data = {
        'generalSearchInput': foodInput
    };
    let usda_check = "";

    $.ajax({
        "async": true,
        "crossDomain": true,
        "url": "https://api.nutritionix.com/v1_1/search/" + foodInput + "?results=0%3A20&cal_min=0&cal_max=50000&fields=item_name%2Cbrand_name%2Citem_id%2Cbrand_id&appId=21fc5346&appKey=ced84d9b86a8143034b8ede11feaf534",
        "method": "GET"
    })

    .then(function(response) {
        console.log(response);
        // console.log("foodID: " + response.hits[0].fields.item_id); **
        foodID = response.hits[0].fields.item_id;
    })

    .then(function(response) {
        $.ajax({
                "async": true,
                "crossDomain": true,
                "url": "https://api.nutritionix.com/v1_1/item?id=" + foodID + "&appId=21fc5346&appKey=ced84d9b86a8143034b8ede11feaf534",
                "method": "GET"
            })
            .then(function(response) {
                console.log(response)
                $("#servingSizeAmt").text(response.nf_serving_size_qty + " " + response.nf_serving_size_unit + " (" + parseInt(response.nf_serving_weight_grams) + "g)");
                $("#calAmt").text(parseInt(response.nf_calories));

                // write vitamin values to the DOM
                $("#vitA-amt").text(parseInt(response.nf_vitamin_a_dv) + "%");
                $("#vitC-amt").text(parseInt(response.nf_vitamin_c_dv) + "%");
                $("#calcium-amt").text(parseInt(response.nf_calcium_dv) + "%");
                $("#iron-amt").text(parseInt(response.nf_iron_dv) + "%");
                //end of vitamin section

                // console.log("usda info: " + response.usda_fields)  **
                if (response.usda_fields === null) {
                    $("#fatAmt").text(parseInt(response.nf_total_fat) + "g");
                    $("#cholesterolAmt").text(parseInt(response.nf_cholesterol) + "mg");
                    $("#sodiumAmt").text(parseInt(response.nf_sodium) + "mg");
                    $("#carbohydrateAmt").text(parseInt(response.nf_total_carbohydrate) + "g");
                    $("#fiberAmt").text(parseInt(response.nf_dietary_fiber) + "g");
                    $("#proteinAmt").text(parseInt(response.nf_protein) + "g");
                } else {
                    $("#fatAmt").text(parseInt(response.usda_fields.FAT.value) + response.usda_fields.FAT.uom);
                    $("#cholesterolAmt").text(parseInt(response.usda_fields.CHOLE.value) + response.usda_fields.CHOLE.uom);
                    $("#sodiumAmt").text(parseInt(response.usda_fields.NA.value) + response.usda_fields.NA.uom);
                    $("#carbohydrateAmt").text(parseInt(response.usda_fields.CHOCDF.value) + response.usda_fields.CHOCDF.uom);
                    $("#fiberAmt").text(parseInt(response.usda_fields.FIBTG.value) + response.usda_fields.FIBTG.uom);
                    $("#proteinAmt").text(parseInt(response.usda_fields.PROCNT.value) + response.usda_fields.PROCNT.uom);
                }
            })
    })
}

// end of nutrition query
//----------------------------------------------------------

function getGif(foodInput) {
    $("#gifDiv").empty() <<

        $("#gifDivHolder").show();
    //object containing parameters 
    const gifQueryParams = {
        "api_key": "CbRv29mIUSwkTAVauYUvcQ8lOGyxCop2",
        q: foodInput,
        "limit": 1,
        "offset": gifOffset,
        "rating": "G",
        "lang": "en"
    };

    //set parameters from object
    let gifParamString = $.param(gifQueryParams);
    let gifQueryURL = "https://api.giphy.com/v1/gifs/search?" + gifParamString;

    $.ajax({
        //calls giphy search
        url: gifQueryURL,
        Method: "GET"
    }).then(function(response) {
        console.log(response);
        //creates image div and appends to DOM
        const gifContent = "<img src=" + response.data[0].images.fixed_width.url + "/>";
        $("#gifDiv").append(gifContent);

        //creates refresh button
        const refreshGifBtn = "<p class='refresh' id='refreshGif'>&#8635;</p>";
        $("#gifDiv").prepend(refreshGifBtn);
    })
}

function getPic(foodInput) {
    $("#imgDiv").empty();
    $("#imgDivHolder").show();

    const imgQueryParams = {
        query: foodInput,
        per_page: 3,
        page: imgPage
    };

    let imgParamString = $.param(imgQueryParams);
    let imgQueryUrl = "https://api.pexels.com/v1/search?" + imgParamString;

    $.ajax({
        //calls pexel url search
        url: imgQueryUrl,
        Method: "GET",
        beforeSend: function(request) {
            request.setRequestHeader(
                "Authorization",
                "563492ad6f91700001000001a0e4738780644fac9acefdba362470d6"
            );
        }
    }).then(function(response) {
        console.log(response);
        for (let i = 0; i < response.photos.length; i++) {
            //adds image to the DOM
            const imgContent = `<div class='col-12 col-md-6 col-lg-4'><div class='text-center'><a href="${response.photos[i].url}"><img class='hvr-glow' src="${response.photos[i].src.tiny}"/></a></div></div>`;
            $("#imgDiv").append(imgContent);
        }
        //creates refresh button
        const refreshImgBtn = "<p class='refresh' id='refreshImg'>&#8635;</p>";
        $("#imgDivHolder").prepend(refreshImgBtn);
    })

}

function recipe(foodInput) {
    //variable for input
    let foodrecipe = foodInput;

    //object containing parameters
    const queryPara = {
        key: "7982d935e15cd8e88f053be3be874c94",
        q: foodrecipe
    };

    //call parameters from object
    let paraString = $.param(queryPara);
    let recipeQueryURL = "https://www.food2fork.com/api/search?" + paraString;

    $.ajax({
        //calls giphy search
        url: recipeQueryURL,
        Method: "GET"
    }).then(function(response) {
        response = JSON.parse(response);

        console.log(response);

        // console.log("Recipe: " + response.recipes[1].source_url);
        // console.log("Title: " + response.recipes[1].title);

        const title = $("<p>").text("Title: " + response.recipes[1].title);
        const recipe = $("<a>")
            .text("Link to Recipe")
            .attr("href", response.recipes[1].source_url)
            .attr("target", "_blank");
        $("#recipeDiv").append(title, recipe);
    });
}

let lat;
let long;

navigator.geolocation.getCurrentPosition(function(position) {
    // console.log(position.coords.latitude);
    // console.log(position.coords.longitude);

    lat = position.coords.latitude;
    long = position.coords.longitude;

    cuisineAPICall();
    // restaurantAPICall();

    // const location = position;
});

function cuisineAPICall() {
    const ApiKey = "de972d173dd44d03623092703cd67ba8";

    const cuisineQueryURL =
        "https://developers.zomato.com/api/v2.1/cuisines?lat=" +
        lat +
        "&lon=" +
        long;

    $.ajax({
        //calls giphy search
        url: cuisineQueryURL,
        method: "GET",
        headers: {
            "user-key": ApiKey
        }
    }).then(function(response) {
        // response = JSON.parse(response);

        //   console.log(response.cuisines);

        let id;

        const arr = response.cuisines;

        for (let i = 0; i < arr.length; i++) {
            // console.log(arr[i].cuisine);
            const food = foodInput.toLowerCase();
            const cuisine = arr[i].cuisine.cuisine_name.toLowerCase();

            // console.log(food, cuisine);

            if (cuisine === food) {
                id = arr[i].cuisine.cuisine_id;
            }
        }
        //   console.log("id", id);
        restaurantAPICall(id);
    });
}

function restaurantAPICall(cuisineId) {
    const ApiKey = "de972d173dd44d03623092703cd67ba8";

    const restarauntQueryURL =
        "https://developers.zomato.com/api/v2.1/search?lat=" +
        lat +
        "&lon=" +
        long +
        "&cuisines=" +
        cuisineId;

    $.ajax({
        //calls giphy search
        url: restarauntQueryURL,
        method: "GET",
        headers: {
            "user-key": ApiKey
        }
    }).then(function(response) {
        // response = JSON.parse(response);

        for (let i = 0; i < response.restaurants.length; i++) {
            console.log(response.restaurants[i].restaurant.name);
            console.log(response.restaurants[i].restaurant.phone_numbers);

            const restname = $("<p>").text(
                "Restaraunt Name:" + response.restaurants[i].restaurant.name
            );
            const restnumber = $("<p>").text(
                "Restaraunt Number:" + response.restaurants[i].restaurant.phone_numbers
            );

            $("#restdiv").append(restname, restnumber);
        }
    });
}

function getHeadline(foodInput) {

    $("#headlines").empty();
    $("#headlines").show();

    const queryParams = {
        q: foodInput,
        fq: 'document_type:("recipe")',
        "api-key": "4T4JAn6PPSJW7c7RpRNUgAK4qSQQxGio"
    };

    const paramString = $.param(queryParams);

    const queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?" + paramString;

    console.log(queryURL);

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {

        console.log(response);
        nytResponse = response;

        articleLink = `<h3>RECIPE: <a href="${response.response.docs[nyti].web_url}">${response.response.docs[nyti].headline.main}</a></h3>`
        $("#headlines").append(articleLink);
        //creates refresh button
        const refreshNewsBtn = "<p class='refresh' id='refreshArticle'>&#8635;</p>";
        $("#headlines").prepend(refreshNewsBtn);

    })


}

function refreshHeadline() {

    //runs through response array
    if (nyti < 9) {
        nyti++;
    } else {
        nyti = 0;
    }

    //empties div and adds new headline
    $("#refreshArticle").remove();
    $("#headlines").empty();
    articleLink = `<h3>RECIPE: <a href="${nytResponse.response.docs[nyti].web_url}">${nytResponse.response.docs[nyti].headline.main}</a></h3>`
    $("#headlines").append(articleLink);

    //creates refresh button
    const refreshNewsBtn = "<p class='refresh' id='refreshArticle'>&#8635;</p>";
    $("#headlines").prepend(refreshNewsBtn);


}

function stopStartGif() {
    //grabs image source attribute
    let imageURL = $(this).attr("src");
    //amends image url to either still or active version
    if (imageURL.includes("200w_s")) {
        imageURL = imageURL.replace(/200w_s/g, "200w");
    } else {
        imageURL = imageURL.replace(/200w/g, "200w_s")
    }
    //changes attribute in the DOM
    $(this).attr("src", imageURL)

}


$(document).ready(function() {

    $("#gifDivHolder").hide();
    $("#headlines").hide();
    $("#imgDivHolder").hide();

    //preset food input
    $(".preset").on("click", function() {
        event.preventDefault();
        foodInput = this.id;
        getGif(foodInput);
        getPic(foodInput);
        getNutrition(foodInput);
        getHeadline(foodInput);
        //recipe(foodInput);

        //resets values
        gifOffset = 0;
        imgPage = 1;
        nyti = 0;

        //deletes refresh buttons
        $(".refresh").remove();
    });

    //search input function
    $("#foodButton").on("click", function() {
        event.preventDefault();
        foodInput = $("#foodInput").val().trim();
        if (foodInput) {
            getGif(foodInput);
            getPic(foodInput);
            getNutrition(foodInput);
            getHeadline(foodInput);
            recipe(foodInput);

            //resets values
            gifOffset = 0;
            imgPage = 1;

            //deletes refresh buttons
            $(".refresh").remove();
        }
        //clears food input
        $("#foodInput").val("");

    })

    //refresh gif function
    $(document).on("click", "#refreshGif", function() {
        gifOffset++;
        getGif(foodInput);
    });

    //refresh images function
    $(document).on("click", "#refreshImg", function() {
        imgPage++;
        $("#refreshImg").remove();
        getPic(foodInput);

    })

    //refresh article function
    $(document).on("click", "#refreshArticle", function() {
        refreshHeadline();
    })

    //runs stops and starts gif on user click
    $(document).on("click", "#gifDiv img", stopStartGif)

})