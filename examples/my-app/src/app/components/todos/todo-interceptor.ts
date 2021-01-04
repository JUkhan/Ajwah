import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpEvent,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse
} from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";
import { delay, flatMap } from "rxjs/operators";
import * as faker from "faker";

@Injectable()
export class TodoInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log(req);
    if (req.url.startsWith("/todos")) {
      let response:any;
      if (req.method === "GET") {
        response = new HttpResponse({
          body: [
            {
              id: ++id,
              description: "Learn Reactive Programming",
              completed: false
            },
            ...generateTodosData()
          ]
        });
      } else if (req.method === "POST") {
        response = new HttpResponse({
          body: { ...req.body, id: ++id }
        });
      } else if (req.method === "PUT") {
        if (
          req.body.completed &&
          req.body.description.startsWith("Learn Reactive")
        ) {
          throw new HttpErrorResponse({
            error:
              "Please take your time. Learning reactive programming is not so easy 💔",
            headers: req.headers,
            status: 500,
            statusText: "Warning",
            url: req.url
          });
        }
        response = new HttpResponse({
          body: { ...req.body }
        });
      } else if (req.method === "DELETE") {
        response = new HttpResponse({
          body: +req.url.substr(7)
        });
      }
      return of(response).pipe(delay(1000));
    } else {
      return next.handle(req);
    }
  }
}
export function generateRandomData() {
  return Array.from({ length: 20 }, generateRandomDataItem);
}
let id = 1;
export function generateTodosData() {
  return Array.from({ length: 5 }, () => ({
    id: ++id,
    description: faker.hacker.adjective() + " " + faker.hacker.noun(),
    completed: false
  }));
}

export function generateRandomDataItem() {
  return {
    author: faker.name.findName(),
    date: faker.date.recent(),
    title: capitalizeTitle(
      faker.hacker.adjective() +
        " " +
        faker.hacker.noun() +
        " " +
        faker.hacker.ingverb() +
        " " +
        faker.hacker.noun()
    ),
    contentSample: faker.lorem.paragraph(3)
  };
}

function capitalizeTitle(str: string): string {
  return str.replace(
    /\w\S*/g,
    (txt: string) => txt[0].toUpperCase() + txt.substr(1)
  );
}
