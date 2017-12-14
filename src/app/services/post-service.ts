import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { Post } from '../postsInterface/posts';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { of } from 'rxjs/observable/of';

import { Router } from '@angular/router';

@Injectable()
export class PostService {

    private apiURL = 'http://localhost:3000/post/';
    private headers = new Headers({
        'Content-Type': 'application/json',
    });

    currentPost: Post;

    constructor(private http: Http, private router: Router) { }

    createPost( postId: number, title: string, link: string, body: string, upvotes: number, 
        downvotes: number, commentsIds: number[], author: string): Observable<any> {
        const finalURL = this.apiURL + 'posts';
        return this.http.post(finalURL,
            {postId: postId, title: title, link: link, body: body, upvotes: upvotes, downvotes: downvotes,commentsIds: commentsIds, author: author  },
            { headers: this.headers })
            .map(post => {
                this.currentPost = post.json().post;
                this.router.navigate(['posts']);
            });
    }

    deletePost(id: number): Observable<any> {
        const finalURL = this.apiURL + '/posts/' + id;
        return this.http.delete(finalURL, { headers: this.headers});
    }

    getPostById(id: number): Observable<any> {
        const finalURL = this.apiURL + 'posts/' + id;

        return this.http.get(finalURL, { headers: this.headers}).map(data => {
            return data.json();
        });
    }

    updatePost(postId: number, title: string, link: string, body: string, upvotes: number, 
        downvotes: number, commentsIds: number[], author: string): Observable<any> {
        const finalURL = this.apiURL + 'posts/' + postId;
        return this.http.put(finalURL,
            {postId: postId, title: title, link: link, body: body, upvotes: upvotes, downvotes: downvotes,commentsIds: commentsIds, author: author  },            
            { headers: this.headers })
            .map(event => {
                console.log(event.json());
            });
    }

    getAllPosts(){
        const finalURL = this.apiURL + 'posts';
        return this.http.get(finalURL, {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

    
}