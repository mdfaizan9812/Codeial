class PostComments{
    constructor(postId){
        this.postId = postId;
        // targetting one post
        this.postContainer = $(`post-${postId}`);
        // targetting comment form
        this.newCommentForm = $(`#post-comment-${postId}`);
        // calling creating
        this.createComment(postId);
    }

    createComment(postId){
        let pSelf = this; // post container that post's li
        this.newCommentForm.submit(function (e) { 
            e.preventDefault();
            let self = this;  // self represend comment form

            $.ajax({
                type:'post',
                url:"/comments/create",
                data:$(self).serialize(),
                success:function(data){
                    let newComment = pSelf.newCommentDom(data.data.comment);
                    $(`#post-comments-${postId}`).prepend(newComment); 
                    pSelf.deleteComment($(" .delete-comment-button", newComment));
                },
                error:function(error){
                    console.log(error.responseText);
                }
            });
        });
    }
    newCommentDom(comment) {
        // CHANGE :: show the count of zero likes on this comment
    
        return $(`<li id="comment-${comment._id}">
                            <p>
                                <small>
                                    <a class="delete-comment-button" href="/comments/destroy/${comment._id}">X</a>
                                </small>
                                
                                ${comment.content}
                                <br>
                                <small>
                                    ${comment.user.name}
                                </small>
                            </p>    
                    </li>`);
    }

    // Method to delete a comment from DOM
    deleteComment = function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type:'get',
                url: $(deleteLink).prop('href'),
                success:function(data){
                    $(`#comment-${data.data.comment_id}`).remove();
                },
                error: function(error){
                    console.log(error.responseText)
                }
            })
        })
    }

    // method to make all post ajax while loading first time
    convertCommentToAjax = function(){
        let pself = this;
        $('#comments-list-container>ul>li').each(function(){
            let self = $(this);  // shows current post
            // delete a post
            let deleteButton = $(" .delete-comment-button", self);
            pself.deleteComment(deleteButton);
        })
    }

}