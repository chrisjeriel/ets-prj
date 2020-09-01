import { Injectable, Component } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

	webSocketEndPoint: string = 'http://localhost:8888/api/socket';
    topic: string = "/chat";
    stompClient: any;
    messageReceived: string = '';

  	constructor() {	}

  	_connect() {
        console.log("Initialize WebSocket Connection");
        let ws = new SockJS(this.webSocketEndPoint);
        this.stompClient = Stomp.over(ws);
        const _this = this;
        _this.stompClient.connect({}, function (frame) {
            _this.stompClient.subscribe(_this.topic, function (sdkEvent) {
                _this.onMessageReceived(sdkEvent);
                _this.messageReceived = sdkEvent.body;
            });
        }, this.errorCallBack);
    };

    _disconnect() {
        if (this.stompClient !== null) {
            this.stompClient.disconnect();
        }
        console.log("Disconnected from socket");
    }

    errorCallBack(error) {
        console.log("errorCallBack -> " + error)
        setTimeout(() => {
            this._connect();
        }, 5000);
    }

    _send(message) {
        console.log("calling logout api via web socket");
        this.stompClient.send("/app/send/message", {}, message);
    }

    onMessageReceived(message) {
        // console.log("Message Recieved from Server :: " + message);
        // this.component.appendLog(message.body);
    }

}
