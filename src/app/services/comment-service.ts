import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { Comment } from '../commentsInterface/comments';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { of } from 'rxjs/observable/of';

import { Router } from '@angular/router';

@Injectable()
export class CommentService {

    private apiURL = 'http://localhost:3000/comment/';
    private headers = new Headers({
        'Content-Type': 'application/json',
    });

    currentComment: Comment;
    currentPostId: number;

    constructor(private http: Http, private router: Router) { }

    createComment( commentId: number, body: string, author: string, upvotes: number, downvotes: number, postId: number): Observable<any> {
        const finalURL = this.apiURL + 'comments';
        return this.http.post(finalURL,
            {commentId: commentId, body: body, author: author, upvotes: upvotes, downVotes: downvotes, postId: postId },
            { headers: this.headers })
            .map(comment => {
                //this.currentComment = comment.json().comment;
                this.currentPostId = postId;
                this.router.navigate(['comments/' + this.currentPostId]);
            });
    }

    deleteAllPostComments(id: number): Observable<any> {
        const finalURL = this.apiURL + 'comments/post/' + id;
        return this.http.delete(finalURL, { headers: this.headers});
    }

    deleteSingle(id: number): Observable<any> {
        const finalURL = this.apiURL + 'comments/' + id;
        return this.http.delete(finalURL, { headers: this.headers});
    }

    getCommentById(id: number): Observable<any> {
        const finalURL = this.apiURL + 'comments/comment/' + id;

        return this.http.get(finalURL, { headers: this.headers}).map(data => {
            return data.json();
        });
    }

    updateComment(commentId: number, body: string, author: string, upvotes: number, downvotes: number, postId: number): Observable<any> {
        const finalURL = this.apiURL + 'comments/' + commentId;
        return this.http.put(finalURL,
            {commentId: commentId, body: body, author: author, upvotes: upvotes, downvotes: downvotes, postId: postId },
            { headers: this.headers })
            .map(event => {
                console.log(event.json());
            });
    }

    getAllComments(postId: number){
        const finalURL = this.apiURL + 'comments/' + postId;
        this.currentPostId = postId;
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