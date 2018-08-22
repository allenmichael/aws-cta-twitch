// because who wants to type this every time?
var twitch = window.Twitch.ext;
var app = new Vue({
    el: '#app',
    data() {
        return {
            message: 'Hello Vue!',
            ctaText: '',
            isBroadcaster: false,
            token: '',
            tuid: '',
            messages: []
        }
    },
    mounted: function () {
        // `this` points to the vm instance
        console.log("mounted");
        twitch.listen('broadcast', (target, contentType, message) => {
            twitch.rig.log('Received broadcast message');
            console.log(target);
            console.log(contentType);
            console.log(message);
            if (message === 'rm') {
                this.messages = [];
            } else {
                this.messages.push(message);
            }
        });
        twitch.onAuthorized((auth) => {
            // save our credentials
            this.token = auth.token;
            this.tuid = auth.userId;
            axios({
                url: 'https://localhost:8081/whoami',
                headers: { 'Authorization': 'Bearer ' + auth.token },
            })
                .then((response) => {
                    console.log(response);
                    console.log(response.data.you);
                    this.isBroadcaster = response.data.you === 'broadcaster'
                })
                .catch((error) => {
                    console.log(error);
                });
        });
    },
    methods: {
        clearCTA: function () {
            axios({
                method: 'DELETE',
                url: 'https://localhost:8081/cta',
                headers: { 'Authorization': 'Bearer ' + this.token },
            })
                .then((response) => {
                    console.log(response);
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        sendCTA: function () {
            console.log(this.ctaText);
            if (!this.ctaText) {
                return;
            }
            axios({
                method: 'POST',
                url: 'https://localhost:8081/cta',
                headers: { 'Authorization': 'Bearer ' + this.token },
                data: { message: this.ctaText }
            })
                .then((response) => {
                    console.log(response);
                    console.log(response.data.you);
                    this.ctaText = response.data.you;
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }
});

twitch.listen('broadcast', function (target, contentType, message) {
    twitch.rig.log('Received broadcast message');
    console.log(target);
    console.log(contentType);
    console.log(message);
});

// create the request options for our Twitch API calls
var requests = {
    set: createRequest('POST', 'cycle'),
    get: createRequest('GET', 'query')
};

function createRequest(type, method) {

    return {
        type: type,
        url: 'https://localhost:8081/color/' + method,
        success: updateBlock,
        error: logError
    }
}

function setAuth(token) {
    Object.keys(requests).forEach((req) => {
        twitch.rig.log('Setting auth headers');
        requests[req].headers = { 'Authorization': 'Bearer ' + token }
    });
}

twitch.onContext(function (context) {
    twitch.rig.log(context);
});

function updateBlock(hex) {
    twitch.rig.log('Updating block color');
    $('#color').css('background-color', hex);
}

function logError(_, error, status) {
    twitch.rig.log('EBS request returned ' + status + ' (' + error + ')');
}

function logSuccess(hex, status) {
    // we could also use the output to update the block synchronously here,
    // but we want all views to get the same broadcast response at the same time.
    twitch.rig.log('EBS request returned ' + hex + ' (' + status + ')');
}

$(function () {

    // when we click the cycle button
    $('#cycle').click(function () {
        if (!token) { return twitch.rig.log('Not authorized'); }
        twitch.rig.log('Requesting a color cycle');
        $.ajax(requests.set);
    });

    // listen for incoming broadcast message from our EBS
});
