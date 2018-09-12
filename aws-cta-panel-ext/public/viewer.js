// // because who wants to type this every time?
// var twitch = window.Twitch.ext;
// new Vue({
//     el: '#app',
//     data: {
//         message: 'Hello Vue!',
//         ctaText: '',
//         isBroadcaster: false,
//         token: '',
//         tuid: '',
//         messages: [],
//         userId: ''
//     },
//     mounted: () => {
//         console.log('mounted');
//         this.userId = '123';
//     }
// });
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
            messages: [],
            userId: ''
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
        clickedCTA: function () {
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
                data: { message: {text: this.ctaText} }
            })
                .then((response) => {
                    console.log(response);
                    console.log(response.data.you);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }
});

twitch.onContext(function (context) {
    console.log(context);
    twitch.rig.log(context);
});
