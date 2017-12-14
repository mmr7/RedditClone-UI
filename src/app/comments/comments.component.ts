import { Component, OnInit, OnChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Comment } from '../commentsInterface/comments';
import { CommentService } from '../services/comment-service';
import { PostService } from '../services/post-service';
import { UserService } from '../services/user-service';
import { User } from '../users/users';
import { Post } from '../postsInterface/posts';

@Component({
  selector: 'app-comments-controller',
  templateUrl: 'comments.component.html',
  styleUrls: ['comments.component.css']
})
export class CommentsComponent implements OnInit, OnChanges {

  comments: { comment: Comment }[];
  private postIdCurrent: number;
  loggedInUser: User;
  currentPost: Post;
  currentComment: Comment;
  private body: string;
  private author: string;
  private upVotes: number;
  private downVotes: number;

  constructor(private commentService: CommentService, private postService: PostService , private router: ActivatedRoute, private userService: UserService, private redirectRouter: Router) {
    this.loggedInUser = this.userService.loggedInUser;
  }

  ngOnInit() {
    this.router.params.subscribe(params => {
      this.postIdCurrent = Number.parseInt(params['postId']);
      console.log("THIS IS THE CURRENT POST ID")
      console.log(this.postIdCurrent);
      console.log("USERNAME ::: ")
    });
    this.commentService.getAllComments(this.postIdCurrent).then(list => {
      this.comments = list;
    });

    this.postService.getPostById(this.postIdCurrent).subscribe(post => {
      this.currentPost = post;
    });
  }

  ngOnChanges() {
    this.commentService.getAllComments(this.postIdCurrent).then(list => {
      this.comments = list;
    });
  }

  addCommentClick() {
    this.body = '';
    console.log("USERNAME ::: ")
    console.log(this.loggedInUser.username);
  }

  createCommentClick() {

    this.commentService.getAllComments(this.postIdCurrent).then(data => {
      if (data.length === 0) {
        this.commentService.createComment(
          1,
          this.body,
          this.loggedInUser.username,
          this.upVotes,
          this.downVotes,
          this.postIdCurrent
        ).subscribe(response => {
          this.commentService.getAllComments(this.postIdCurrent).then(list => {
            this.comments = list;
          });
        });
      }
      else {
        const newId = data[data.length - 1]['commentId'] + 1;
        console.log(newId);
        this.commentService.createComment(
          newId,
          this.body,
          this.loggedInUser.username,
          this.upVotes,
          this.downVotes,
          this.postIdCurrent
        ).subscribe(response => {
          this.commentService.getAllComments(this.postIdCurrent).then(list => {
            this.comments = list;
          });
        });
      }
    });

  }

upVoteComment(input: number) {
    this.commentService.getCommentById(input).subscribe(comment => {
        this.currentComment = comment;
        this.commentService.updateComment(
            this.currentComment.commentId,
            this.currentComment.body,
            this.currentComment.author,
            this.currentComment.upvotes + 1,
            this.currentComment.downvotes,
            this.currentComment.postId
        ).subscribe(response => {
          this.commentService.getAllComments(this.postIdCurrent).then(list => {
            this.comments = list;
          });
        });

    });
}

downVoteComment(input: number) {
  this.commentService.getCommentById(input).subscribe(comment => {
    this.currentComment = comment;
    this.commentService.updateComment(
        this.currentComment.commentId,
        this.currentComment.body,
        this.currentComment.author,
        this.currentComment.upvotes,
        this.currentComment.downvotes - 1,
        this.currentComment.postId
    ).subscribe(response => {
      this.commentService.getAllComments(this.postIdCurrent).then(list => {
        this.comments = list;
      });
    });

});

}

deleteComment(input: number)
  {
      if(confirm("Are you sure to delete this comment?")) {
          this.commentService.deleteSingle(input).subscribe(response => {
              this.commentService.getAllComments(this.postIdCurrent).then(list => {
                this.comments = list;
              });
          });
      }
  }

}
