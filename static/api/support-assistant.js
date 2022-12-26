function startAssistant(config) {
    const assistantBody = document.getElementsByClassName("assistant-body")[0];
    const sendMsg = document.getElementsByClassName("send-msg")[0];
    const list = document.getElementById("chats");
    const inputMsg = document.getElementsByClassName("input-msg")[0];
    const assistantTyping = document.getElementById("assistant-typing");
    const recommends = document.getElementsByClassName("recommend");
    const assistantHead = document.getElementsByClassName("assistant-head")[0];
    const supportAssistant = document.getElementById('support-assistant');

    Array.from(recommends).forEach(function (element) {
        element.addEventListener('click', function (event) {
            chat(element.innerText);
        });
    });

    let currentDate = null;
    sendMsg.onclick = chat(inputMsg.value.trim());
    inputMsg.onkeypress = function (e) {
        if (!e) e = window.event;
        var keyCode = e.code || e.key;
        if (keyCode == 'Enter') {
            chat(inputMsg.value.trim());
        }
    }
    assistantHead.onclick = function () {
        if (supportAssistant.classList.contains('min')) {
            supportAssistant.classList.remove('min');
        } else {
            supportAssistant.classList.add('min');
        }
    }

    function chat(userMsg) {
        if (userMsg.length > 0) {
            setChattingDate();
            userChat(userMsg);
            scrollTOBottom();
            setTimeout(function () {
                startTyping();
                scrollTOBottom();
            }, 200);
            async function fetchResponse() {
                let response = await fetch(config.url + '/get', {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: `msg=${userMsg}`,
                });
                let data = '';
                if (response.status === 200) {
                    data = await response.text();
                    data = JSON.parse(data);
                } else {
                    data = 'Please try another keyword.';
                }
                setChattingDate();
                setTimeout(function () {
                    endTyping();
                    assistantChat(data);
                    scrollTOBottom();
                }, 500);
            }
            fetchResponse();
        }
    }
    function getTime() {
        var time = new Date();
        return time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    }
    function scrollTOBottom() {
        assistantBody.scrollTop = assistantBody.scrollHeight
    }
    function userChat(msg) {
        appendChat(msg, false);
        inputMsg.value = '';
    }
    function assistantChat(data) {
        const chat = document.createElement("li");
        chat.setAttribute("class", `chat  assistant`);

        let formattedAns = '';
        for (key in data) {
            if (key === 'images') {
                let imageView = `<div class="image-view">`;
                data[key].forEach(function (image) {
                    imageView += `<img onclick="generateImagePreview(this)" src="${config.url + image}">`
                });
                imageView += '</div>';
                formattedAns += imageView;
            }
            if (key === 'links') {
                let linkView = `<div class="links-view">`;
                data[key].forEach(function (link) {
                    linkView += `<a href="${link.url}">Go to ${link.name.replace(/-/g, ' ')}</a>`
                });
                linkView += '</div>';
                formattedAns += linkView;
            }
            if (key === 'msg') {
                let msgView = `<div class="msg-view">${data[key]}</div>`;
                formattedAns += msgView;
            }
        }

        chat.innerHTML =
            `
          <div class="chat-corner"></div>
          ${formattedAns}
          <span class="time">${getTime()} <div class="msg-status recieved">&#10003;</div></span>
        `;
        list.insertBefore(chat, assistantTyping);
    }

    function appendChat(msg, isAssistant) {
        const chat = document.createElement("li");
        chat.setAttribute("class", `chat ${isAssistant ? 'assistant' : 'user'}`);
        chat.innerHTML = `
           <div class="chat-corner"></div>
           ${msg}
            <span class="time">${getTime()} <div class="msg-status recieved">&#10003;</div></span>
        `;
        list.insertBefore(chat, assistantTyping);
    }

    function startTyping() {
        assistantTyping.style.display = "block";
    }
    function endTyping() {
        assistantTyping.style.display = "none";
    }

    function setChattingDate() {
        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var d = new Date();
        var dayName = days[d.getDay()];
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        const dateObj = new Date();
        const month = monthNames[dateObj.getMonth()];
        const day = String(dateObj.getDate()).padStart(2, '0');
        const newDate = `${dayName}, ${month} ${day}`;

        if (currentDate === null || currentDate !== newDate) {
            currentDate = newDate;
            const dayAndDate = document.createElement("li");
            dayAndDate.setAttribute("class", `chat-time`);
            dayAndDate.innerHTML = newDate;
            list.insertBefore(dayAndDate, assistantTyping);
        }
    }

    setChattingDate();

};

function initAssistant(config) {
    const assistant = `
    <div id="support-assistant" class="min">
    <div class="assistant-head">
        <h4 class="assistant-info"><span class="assistant-status online"></span>Support Assistant 
        <img src="${config.url + '/static/images/down-arrow.png'}" class="right-down" />
        <img src="${config.url + '/static/images/up-arrow.png'}" class="right-up" />
        </h4>
    </div>
    <div class="assistant-body">
        <div class="assitant-recommendation">
            <span class="recommend">What is Web communicator?</span>
            <span class="recommend">How to backup system?</span>
            <span class="recommend">How to change time format?</span>
            <span class="recommend">How to change theme?</span>
            <span class="recommend">How to create macros?</span>
        </div>
        <ul id="chats">
            <li id="assistant-typing" class="chat assistant" style="display: none;">
                <div class="chat-corner"></div>
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                    style="margin: auto;display: block;shape-rendering: auto;width: 43px;height: 20px;"
                    viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
                    <circle cx="0" cy="44.1678" r="15" fill="#ffffff">
                        <animate attributeName="cy" calcMode="spline"
                            keySplines="0 0.5 0.5 1;0.5 0 1 0.5;0.5 0.5 0.5 0.5" repeatCount="indefinite"
                            values="57.5;42.5;57.5;57.5" keyTimes="0;0.3;0.6;1" dur="1s" begin="-0.6s"></animate>
                    </circle>
                    <circle cx="45" cy="43.0965" r="15" fill="#ffffff">
                        <animate attributeName="cy" calcMode="spline"
                            keySplines="0 0.5 0.5 1;0.5 0 1 0.5;0.5 0.5 0.5 0.5" repeatCount="indefinite"
                            values="57.5;42.5;57.5;57.5" keyTimes="0;0.3;0.6;1" dur="1s"
                            begin="-0.39999999999999997s"></animate>
                    </circle>
                    <circle cx="90" cy="52.0442" r="15" fill="#ffffff">
                        <animate attributeName="cy" calcMode="spline"
                            keySplines="0 0.5 0.5 1;0.5 0 1 0.5;0.5 0.5 0.5 0.5" repeatCount="indefinite"
                            values="57.5;42.5;57.5;57.5" keyTimes="0;0.3;0.6;1" dur="1s"
                            begin="-0.19999999999999998s"></animate>
                    </circle>
                </svg>
            </li>
        </ul>
    </div>
    <div class="assistant-actions">
        <input class="input-msg" type="text" placeholder="Type a message..." />
        <a class="send-msg" href="javascript: void(0)">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="feather feather-send">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
        </a>
    </div>
    </div>
    `;
    document.getElementsByTagName("body")[0].insertAdjacentHTML('beforeend', assistant);
    startAssistant(config);
}

function generateImagePreview(element) {
    const overlay = document.createElement('div');
    const parent = element.parentElement;
    const allImages = parent.querySelectorAll("img");

    overlay.setAttribute('id', 'slider-overlay');
    allImages.forEach(function (imgage) {
        const img = document.createElement('img');
        img.setAttribute('src', imgage.getAttribute('src'));
        img.setAttribute('class', 'img-slides');
        if (imgage.getAttribute('src') === element.getAttribute('src')) {
            img.classList += ' active-img';
        }
        overlay.appendChild(img);
    });

    overlay.innerHTML += `
    <a class="close-slider" onclick="closeOverlay();" href="javascript:void(0)">&#10006;</a>
    <a class="previ-slide" onclick="prevSlide(this);" href="javascript:void(0)">&#10094;</a>
    <a class="next-slide" onclick="nextSlide(this);" href="javascript:void(0)">&#10095;</a>
    `;
    document.body.appendChild(overlay);
}

function closeOverlay() {
    const overlay = document.getElementById('slider-overlay');
    overlay.remove();
}

function prevSlide(elm) {
    const slides = document.getElementsByClassName('img-slides');
    for (let i = 0; i < slides.length; i++) {
        if (slides[i].classList.contains('active-img')) {
            if (i > 0) {
                slides[i].classList = 'img-slides';
                slides[i - 1].classList += ' active-img';
                break;
            }
        }
    }
}

function nextSlide(elm) {
    const slides = document.getElementsByClassName('img-slides');
    for (let i = 0; i < slides.length; i++) {
        if (slides[i].classList.contains('active-img')) {
            if ((i + 1) < slides.length) {
                slides[i].classList = 'img-slides';
                slides[i + 1].classList += ' active-img';
                break
            }
        }
    }
}