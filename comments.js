function docReady(fn) {
    // see if DOM is already available
    if (document.readyState === "complete" || document.readyState === "interactive") {
        // call on next available tick
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

docReady(function () {
    var is_sticky = false;
    let buttonSticky = 'Sticky Comments';
    let buttonUnSticky = 'UnSticky';
    var intervalComments = null;
    var stickyButton = null;
    var comments = null;
    var commentholder = false;
    chrome.storage.local.get('sticky', function (data) {
        is_sticky = data.sticky === true ? true : false;

        intervalComments = setInterval(waitForComments, 300);

    });

    function makeSticky() {
        stickyButton.setAttribute('data-sticky', 1);
        stickyButton.classList.add('tfu-active');
        stickyButton.textContent = buttonUnSticky;
        document.querySelector("body").classList.add('tfu-sticky-comments');
        window.dispatchEvent(new Event('resize'));//let youtube adjust player height/width

    }
    function makeUnSticky() {
        stickyButton.setAttribute('data-sticky', 0);
        stickyButton.classList.remove('tfu-active');
        stickyButton.textContent = buttonSticky;
        document.querySelector("body").classList.remove('tfu-sticky-comments');
        window.dispatchEvent(new Event('resize'));//let youtube adjust player height/width
    }
    function waitForComments() {
        comments = document.querySelector('#comments');
        if (comments !== null && comments !== undefined) {
            clearInterval(intervalComments);
            comments = document.querySelector('#comments');

            //check if sticky or not

            comments.insertAdjacentHTML('beforebegin', '<div id="tfu-comments-holder"></div>');
            commentholder = document.querySelector('#tfu-comments-holder');
            commentholder.appendChild(comments);
            comments.insertAdjacentHTML('beforebegin', '<div id="tfu-comments-message"><a href="#" id="tfu-sticky-unsticky-comments" data-sticky="' + (is_sticky ? 1 : 0) + '">' + (is_sticky ? buttonUnSticky : buttonSticky) + '</a></div>');
            stickyButton = document.querySelector('#tfu-sticky-unsticky-comments');
            if (is_sticky) {
                makeSticky();
            }
            stickyButton.addEventListener('click', function (e) {
                e.preventDefault();
                if (stickyButton.getAttribute('data-sticky') == 0) {
                    makeSticky();
                } else {
                    makeUnSticky();
                }
            });


            //attach scroll event to comments.
            commentholder.addEventListener('scroll', function (e) {
                //grace distance before reaching the end 
                const grace = 50;
                const bottom = e.target.scrollHeight - e.target.scrollTop - grace <= e.target.clientHeight;
                if (bottom) {
                    //trigger scroll on the player so the youtube loads the comments.
                    document.getElementsByTagName("ytd-watch-flexy")[0].dispatchEvent(new CustomEvent('scroll'));

                }
            });


        }

    }
});