import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions, Response} from '@angular/http';
import {Message} from './message';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {Auth0Service} from '../auth0/auth0.service';

@Injectable()
export class MessageService {

  constructor (private http: Http,
               private authentication: Auth0Service) { }

  // GET /privateMessages
  getAllMessages(): Observable<Message[]> {
    return this.http.get(`${environment.API}/privateMessages`)
      .map((res: Response) => res.json()._embedded.privateMessages)
      .catch((error: any) => Observable.throw(error.json()));
  }

  // GET /privateMessages
  getAllMessagesNotRead(): Observable<Message[]> {
    return this.http.get(`${environment.API}/privateMessages`)
      .map((res: Response) => res.json()._embedded.privateMessages.filter(p => p.isRead ===  false).count())
      .catch((error: any) => Observable.throw(error.json()));
  }

  // GET /privateMessages/:id
  getMessageByUri(uri: string): Observable<Message> {
    return this.http.get(`${environment.API}/privateMessages/${uri}`)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json()));
  }

  // GET
  getMessageByTitle(): Observable<Message> {
    return this.http.get(`${environment.API}/privateMessages`)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json()));
  }

  // Update TODO
  setAsRead(message: Message): Observable<Message> {
    if (!message.uri) {
      throw new Error('Message URI is required.');
    }

    let body = JSON.stringify({
      title: message.title,
      body: message.body,
      destination : message.destination,
      sender: message.sender,
      isRead: true,
    });

    // let body = JSON.stringify(message);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization', this.authentication.getCurrentUser().authorization);
    let options = new RequestOptions({ headers: headers });

    return this.http.put(`${environment.API}${message.uri}`, body, options)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json()));
  }

  // POST /privateMessages
  addMessage(message: Message): Observable<Message> {
    if (!(message.title && message.body && message.destination)) {
      throw 'Missing message parameters. Required: title, body, destination.';
    }

    let body = JSON.stringify(message);

    let headers = new Headers({'Content-Type': 'application/json'});
    headers.append('Authorization', this.authentication.getCurrentUser().authorization);
    let options = new RequestOptions({headers: headers});

    return this.http.post(`${environment.API}/privateMessages`, body, options)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json()));
  }

  // DELETE /privateMessages/:id
  deleteMessageByUri(uri: string) {
    let headers = new Headers({ 'Authorization': this.authentication.getCurrentUser().authorization });
    let options = new RequestOptions({ headers: headers });

    return this.http.delete(`${environment.API}${uri}`, options)
      .map((res: Response) => res.ok)
      .catch((error: any) => Observable.throw(error.json()));
  }

  // Message filters
  filterMessages(messages: Message[], fun): Message[] {
    return messages.filter(fun);
  }

  filterUnread(messages: Message[]): Message[] {
    return this.filterMessages(messages.filter(p => p.destination ===  this.authentication.getCurrentUser().username), p => !p.isRead);
  }

  filterBySender(messages: Message[], sender): Message[] {
    return this.filterMessages(messages, p => p.sender === sender);
  }

  filterByDestination(messages: Message[], destination): Message[] {
    return this.filterMessages(messages, p => p.destination === destination);
  }

}
