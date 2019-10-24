function formatDate(date) {
    let year = date.slice(0,4);
    let month = date.slice(5,7);
    let day = date.slice(8,10);
    return `${day}/${month}/${year}`;
}

function showMovieInfos(movieInfo, movieCategories, movieCountries) {
    let movieInfoElem = $('.pop-up-content').find('.movie-info').find('.movie-dl-list');
    
    let directorsElem = "";

    movieInfo.directors.forEach(function(director) {
        directorsElem +=  `<a href="#">${director}</a>,`;
    });

    let countriesElem = "";

    movieCountries.forEach(function(country) {
        countriesElem +=  `<a href="#">${country.country}</a>,`;
    });

    let categoriesElem = "";

    movieCategories.forEach(function(category) {
        categoriesElem +=  `<a href="#">${category.title}</a>,`;
    });
    
    movieInfoElem.html(`
    <p class="movie-dl-item">
        <span class="dl-title"> Trạng thái: </span>
        <span class="dl-value">${movieInfo.status}</span>
    </p>
    <p class="movie-dl-item">
        <span class="dl-title"> Thời lượng: </span>
        <span class="dl-value">${movieInfo.time}</span>
    </p>
    <p class="movie-dl-item">
        <span class="dl-title"> IMDb: </span>
        <span class="dl-value">${movieInfo.IMDb}</span>
    </p>
    <p class="movie-dl-item">
        <span class="dl-title"> Đạo diễn: </span>
        <span class="dl-value">${directorsElem}</span>
    </p>
    <p class="movie-dl-item">
        <span class="dl-title"> Ngày khởi chiếu: </span>
        <span class="dl-value">${formatDate(movieInfo.release_date)}</span>
    </p>
    <p class="movie-dl-item">
        <span class="dl-title"> Quốc gia: </span>
        <span class="dl-value">${countriesElem}</span>
    </p>
    <p class="movie-dl-item">
        <span class="dl-title"> Thể loại: </span>
        <span class="dl-value">${categoriesElem}</span>
    </p>
    `);
}

/**
 * Send ajax request to get movie's infomations
 * @param {String} movieId 
 */
function requestForMovieInfos(movieId) {
    $.get(`/movie/info/${movieId}`,
        function (data) {
            let movieInfo = data.movieInfo;
            let movieCategories = data.movieCategories;
            let movieCountries = data.movieCountries;

            let movieThumbnailBig = $('.pop-up-content').find('.thumb .thumb-bg');
            let movieThumbnailSm = $('.pop-up-content').find('.thumb-sm .thumb-bg');
            movieThumbnailBig.attr('src', movieInfo.thumbnail);
            movieThumbnailSm.attr('src', movieInfo.thumbnail);

            let movieTitle = $('.pop-up-content').find('.movie-info');
            movieTitle.find('.movie-title-vn').text(movieInfo.title_vn);
            movieTitle.find('.movie-title-en').text(movieInfo.title_en);

            showMovieInfos(movieInfo, movieCategories, movieCountries);

            let movieDescriptions = $('.pop-up-content').find('.summary-content');
            movieDescriptions.html(movieInfo.descriptions);

            let movieTags =  $('.pop-up-content').find('.tag-box');
            movieTags.empty();

            let keywords = movieInfo.keywords;
            keywords.forEach(function(keyword) {
                movieTags.append(`<li class="tag-item">
                    <a href="">${keyword}</a>
                </li>`);
            });

            //add Listener for Watch Movie and Trailer Buttons
            watchAndTrailerButton(movieInfo.trailer_link, movieInfo.watch_link);
        }
    );
}

function getMovieDetails() {
    $('.movie-link').parent().on('click', function (e) {
        e.preventDefault();
        let target = $(this).data('target');
        requestForMovieInfos(target);
        $('.pop-up-window').show();
        $('.movie-details').hide();
        $('.movie-summary').show();
    });
}

$(document).ready(function () {
    getMovieDetails();
});