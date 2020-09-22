import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { throwError } from 'rxjs';
import { PostModel } from 'src/app/shared/post-model';
import { PostService } from 'src/app/shared/post.service';
import { CommentPayload } from 'src/app/comment/comment-payload';
import { CommentService } from 'src/app/comment/comment.service';
import { AuthService } from 'src/app/auth/shared/auth.service';

@Component({
  selector: 'app-view-post',
  templateUrl: './view-post.component.html',
  styleUrls: ['./view-post.component.css']
})
export class ViewPostComponent implements OnInit {

  postId: number;
  post: PostModel;
  commentForm: FormGroup;
  commentPayload: CommentPayload;
  comments: CommentPayload[];

  constructor(private postService: PostService,
            private activateRoute: ActivatedRoute,
            private commentService: CommentService,
            private authService: AuthService,
            private router: Router) 
  { 
    this.postId = this.activateRoute.snapshot.params.id;

    this.commentForm = new FormGroup({
      text: new FormControl('', Validators.required)
    });

    this.commentPayload = {
      text: '',
      postId: this.postId,
      userName: ''
    };

  }

  ngOnInit(): void {
    this.getPostById();
    this.getCommentsForPost();
  }

  postComment() {
    this.commentPayload.text = this.commentForm.get('text').value;

    if(this.authService.isLoggedIn) {
      this.commentPayload.userName = this.authService.getUserName();
    }
 
    this.commentService.postComment(this.commentPayload).subscribe(
      data => {
        this.commentForm.get('text').setValue('');
        this.getCommentsForPost();
      }, error => {
        throwError(error);
      });
    
  }

  getPostById() {
    this.postService.getPost(this.postId).subscribe(
      data =>{
        this.post = data;
      }, error => {
        throwError(error);
      }
    )
  }

  getCommentsForPost() {
    this.commentService.getCommentsForPost(this.postId).subscribe(
      data => {
        this.comments = data;
      }, error => {
        throwError(error);
      }
    );
  }

}
