import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable()
export class JTodoService {
  constructor(private http: HttpClient) {}
  baseUrl = "https://jsonplaceholder.typicode.com/todos";

  getTodos(limit: number = 5) {
    return this.http.get(this.baseUrl + `?_limit=${limit}`);
  }

  addTodo(todo: any) {
    return this.http.post(this.baseUrl, todo);
  }

  updateTodo(todo: any) {
    return this.http.put(this.baseUrl + `/${todo.id}`, todo);
  }

  deleteTodo(id) {
    return this.http.delete(this.baseUrl + `/${id}`);
  }
}
