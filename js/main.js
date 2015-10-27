var news_count = 1;
var current_page = 1;
var pages_count = 1;
var index = 1;
var NEWS_AT_PAGE = 6;

function add_news(title, news_text)
{
    var obj = document.getElementById('news_div');
    var buffer = "";

        buffer += '<div class="col-md-4" id="news_block'+news_count + '"';

    if((pages_count > 2) && (current_page+1 != pages_count)) {
        buffer += 'style="display: none;"';
    }
        buffer += '><h2 id="news_title">' + title + '</h2>';
        buffer += '<div id="news_body" style="word-wrap: break-word; max-height: 60px; overflow: hidden; text-overflow: ellipsis;">' + news_text + '</div>';
        buffer += '<a class="btn btn-default btn_news" href="#" role="button" data-toggle="modal" data-target="#myModal">';
        buffer += 'Полная статья &raquo;</a></div>';

    if((news_count % NEWS_AT_PAGE == 0) || (news_count == 1)){
        var pg_obj = document.getElementById('news_pages');
        pg_obj.innerHTML += '<a class="pages-buttons btn btn-default">'+ pages_count + '</a> ';
        pages_count++;
    }
    news_count += 1;

    obj.innerHTML += buffer;

    $(".btn_news").click(function()
    {
        if($(this).parents('.col-md-4').find('#news_title').html() !== undefined)
            $('.modal-title').html($(this).parents('.col-md-4').find('#news_title').html());
        if($(this).parents('.col-md-4').find('#news_body').html() !== undefined)
            $('.modal-body').html($(this).parents('.col-md-4').find('#news_body').html());
    });

    $('.pages-buttons').click(function()
    {
        index = +$(this).html();
        if (current_page == index) return;
        for (var i = 1 + (NEWS_AT_PAGE*index) - NEWS_AT_PAGE; i <= NEWS_AT_PAGE*index; i++)
        {
            $('#news_block'+i).show();
        }
        for(var j = 1 + (NEWS_AT_PAGE*current_page) - NEWS_AT_PAGE; j <= NEWS_AT_PAGE*current_page; j++)
        {
            $('#news_block'+j).hide();
        }
        current_page = index;
    });

    $('#preload_pctr').hide();
    $('#news_pages').show();
}

function read_news()
{
    var myBase;
    myBase = new Firebase('https://fiery-heat-4880.firebaseio.com/news/');
    myBase.on('child_added', function(snapshot) {
        var article = snapshot.val();
        add_news(article.name, article.text);
    }, function (errorObject) {
        alert("The read failed: " + errorObject.code)
    });
}

$(document).ready(function(){
    read_news();
    $('.btn-success').click(function()
    {
        var login = $("#Login").val();
        var password = $('#Password').val();
        if ((login.length >= 4) && (password.length >= 4)) {
            myBase = new Firebase('https://fiery-heat-4880.firebaseio.com/');
            myBase.child('users').set({user_name: login, pass: password});
            document.location = "admin.html";
        } else alert("Логин и пароль должны быть больше или равно 4 символам.")
    })
});