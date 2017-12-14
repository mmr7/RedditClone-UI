import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { PostService } from '../services/post-service'
import { Post } from '../postsInterface/posts';
import { Router } from '@angular/router';
import { UserService } from '../services/user-service';
import { CommentService } from '../services/comment-service';
import { User } from '../users/users';
@Component({
    selector: 'app-posts-component',
    templateUrl: 'posts.component.html',
    styleUrls: ['posts.component.css']
})
export class PostsComponent implements OnInit, OnChanges {
    posts: { post: Post }[];

    private postTitle: string;
    private postLink: string;
    private postDescription: string;
    private upVotes: number;
    private downVotes: number;
    private commnetsIDs: number[];
    private author: string;
    loggedInUser: User;
    currentPost: Post;

    constructor(private postService: PostService, private router: Router, private userService: UserService, private commentService: CommentService) {
        this.commnetsIDs = new Array();
        this.posts = new Array();
        this.loggedInUser = this.userService.loggedInUser;
    }

    ngOnInit() {
        //call service to get posts and populate posts variable
        this.postService.getAllPosts().then(list => {
            this.posts = list;
        });
    }

    ngOnChanges() {
        this.postService.getAllPosts().then(list => {
            this.posts = list;
        });
    }

    addPostClick(): void {

        this.postTitle = '';
        this.postLink = '';
        this.postDescription = '';
        console.log(this.loggedInUser.username);
    }

    createPostClick() {

        this.postService.getAllPosts().then(data => {
            if (data.length != null) {
                const newId = data[data.length - 1]['postId'] + 1;

                this.postService.createPost(
                    newId,
                    this.postTitle,
                    this.postLink,
                    this.postDescription,
                    this.upVotes,
                    this.downVotes,
                    this.commnetsIDs,
                    this.loggedInUser.username
                ).subscribe(response => {
                    this.postService.getAllPosts().then(list => {
                        this.posts = list;
                    });
                });
            }
            else {
                this.postService.createPost(
                    1,
                    this.postTitle,
                    this.postLink,
                    this.postDescription,
                    this.upVotes,
                    this.downVotes,
                    this.commnetsIDs,
                    this.loggedInUser.username
                ).subscribe(response => {
                    this.postService.getAllPosts().then(list => {
                        this.posts = list;
                    });
                });
            }
        });

    }

    viewCommentsClick(input: number) {
        this.router.navigate(['comments/' + input]);
    }

    upVotePost(input: number) {
        this.postService.getPostById(input).subscribe(post => {
            console.log(input);
            console.log(post.postId);
            this.currentPost = post;
            this.postService.updatePost(
                this.currentPost.postId,
                this.currentPost.title,
                this.currentPost.link,
                this.currentPost.body,
                this.currentPost.upvotes + 1,
                this.currentPost.downvotes,
                this.currentPost.commentsIds,
                this.currentPost.author
            ).subscribe(response => {
                this.postService.getAllPosts().then(list => {
                    this.posts = list;
                });
            });

        });
    }

    downVotePost(input: number) {
        this.postService.getPostById(input).subscribe(post => {
            this.currentPost = post;
            console.log("DownVoted");
            console.log(this.currentPost.downvotes);
            console.log(this.currentPost.downvotes - 1);
            this.postService.updatePost(
                this.currentPost.postId,
                this.currentPost.title,
                this.currentPost.link,
                this.currentPost.body,
                this.currentPost.upvotes,
                this.currentPost.downvotes - 1,
                this.currentPost.commentsIds,
                this.currentPost.author
            ).subscribe(response => {
                this.postService.getAllPosts().then(list => {
                    this.posts = list;
                });
            });

        });

    }
    
    deletePost(input: number)
    {
        if(confirm("Are you sure to delete this post?")) {
            this.postService.deletePost(input).subscribe(response => {
                this.commentService.deleteAllPostComments(input).subscribe(secondResponse => {
                    this.postService.getAllPosts().then(list => {
                        this.posts = list;
                    });
                });
            });
        }
    }

    logOut() {
        this.userService.loggedInUser = null;
        this.loggedInUser = null;
        this.router.navigate(['login/']);
    }
}
