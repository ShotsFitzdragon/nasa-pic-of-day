//return date string in YYYY-MM-DD format
const getDateString = date => 
    `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

const displayPicture = data => {
    let html = "";
    if(data.error) {      // error - display message
        html += `<span class="error">${data.error.message}e/span>`;
    }
    else if (data.code) {  // problem - display message
        html += `<span class="error">${data.msg}</span`;
    }
    else {                  // sucesss display image/video data
        html += `<h3>${data.title}</h3>`;
        const width = 700;
        switch (data.media_type) {
            case "image":
                html += `<img src="${data.url}" width=${width} alt="NASA photo.jpg">`;
                break;
            case "video":
                html += `<iframe src=${data.url} frameborder="0" allowfullscreen></iframe>`;
                break;
            default:
                html += `<img src="images/notavailable.png" width="$(width)" alt="NASA photo.jpg">`;
    }

    // date and copyright
    html += `<div>${data.date}`;
    if (data.copyright) {
        html += `<span class="right">&copy; ${data.copyright}</span>`;
    }
    html += "</div>";

    // explanation
    html += `<p>${data.explanation}</p>`;

  }

  // display HTML
  $("#display").html(html);

};

const displayError = error => {
    let html = `<span class="error">${error.message}</span>`;
    $("#display").html(html);
};


$(document).ready( () => {
    const today = new Date();
    let dateStr = getDateString(today);

    const dateTextbox = $("#date");
    dateTextbox.val(dateStr);
    dateTextbox.focus();

    $("#view_button").click( () => {
        dateStr = $("#date").val();
        const dateObj = new Date(dateStr);

        if(dateObj == "Invalid Date") {
            const msg = "Please enter valid date in YYYY-MM-DD format."
            $("#display").html(`<span class="error">${msg}</span>`);
        }
        else {
            dateStr = getDateString(dateObj);

            // build URL for API request
            const domain = `https://api.nasa.gov/planetary/apod`;
            const request = `?api_key=DEMO_KEY&date=${dateStr}`;
            const url = domain + request;
            console.log(url)
            fetch(url)
                .then(response => response.json())
                .then( json => displayPicture(json))
                .catch( e => displayError(e) );
        }
        $("#date").focus();
    });

    $("#link_button").click( () => {
        dateStr = $("#date").val();
        const dateObj = new Date(dateStr);

        if(dateObj == "Invalid Date") {
            const msg = "Please enter valid date above in YYYY-MM-DD format."
            $("#link").html(`<span class="error">${msg}</span>`);
        }
        else {
            dateStr = getDateString(dateObj);

            const domain = `https://api.nasa.gov/planetary/apod`;
            const request = `?api_key=DEMO_KEY&date=${dateStr}`;
            const url = domain + request;
            console.log(url)
            $.ajax({
                url:url,
                type:"GET",
                datatype:"json",
                success: function(data) {
                    $("#link").html(`<a href="url">${data.hdurl}</a>`)
                },
                error: function(data) {
                    console.log(data);
                    $("#link").append(`<br>${data.statusText}`); 
                }
            })

        }
    })
});