import { Component, OnInit } from '@angular/core';
import { Message } from './message';
import { MessageService } from './message.service';
import { Auth0Service } from '../auth0/auth0.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css'],
  providers: [MessageService, Auth0Service]
})
export class MessageComponent implements OnInit {

  DivSendMessage;
  DivSentMessage;
  DivFindMessage;
  DivAllMessage;
  DivReceivedMessage;


  messages: Message[] = [];
  mySentMessages: Message[] = [];
  myReceivedMessages: Message[] = [];
  myAllMessages: Message[] = [];
  unreadMessages: Message[] = [];

  messagesUri: Message[] = [];
  messagesTitle: Message[] = [];

  errorMessage: string;
  newMessage: Message;
  searchInput = '';

  constructor(private messageService: MessageService,
               private authentication: Auth0Service) { }

  ngOnInit() {
    this.getMessages();
  }

  getMessages() {
    const username = this.authentication.getCurrentUser().username;
    this.messageService.getAllMessages()
      .subscribe(
        messages => {
          this.messages = messages;
          this.mySentMessages = this.messageService.filterBySender(messages, username);
          this.myReceivedMessages = this.messageService.filterByDestination(messages, username);
          this.unreadMessages = this.messageService.filterUnread(messages.filter(p => p.destination === username));
        },
        error =>  this.errorMessage = <any>error.message);
  }

  getMessageByUri() {
    this.messageService.getMessageByUri(this.searchInput)
      .subscribe(
        message => this.messagesUri = [message],
        error =>  this.errorMessage = <any>error.message);
  }

  getMessageByTitle () {

    this.messageService.getAllMessages()
      .subscribe(
        message => this.messagesTitle = this.messages.filter(p => p.title === this.searchInput),
        error =>  this.errorMessage = <any>error.message);
  }

  addMessage() {
    this.messageService.addMessage(this.newMessage)
      .subscribe(
        message => {
          this.messages.push(message);
          this.toggleSendMessage();
        },
        error =>  this.errorMessage = <any>error.message);
  }

  // TODO
  setAsRead(message) {
    this.messageService.setAsRead(message)
      .subscribe(
        newMessage  => this.newMessage = newMessage,
        error =>  this.errorMessage = <any>error.message);
  }

  removeMessage(message) {
    this.messageService.deleteMessageByUri(message.uri)
      .subscribe(
        deleted => this.messages = this.messages.filter(p => p.uri !== message.uri),
        error =>  this.errorMessage = <any>error.message);
  }

  toggleSendMessage() {
    this.DivSendMessage = !this.DivSendMessage;
    this.newMessage = new Message({
      sender: this.authentication.getCurrentUser().username,
    });
  }

}
