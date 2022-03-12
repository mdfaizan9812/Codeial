{
    // method to submit the form data for new post using AJAX
    let createPost = function(){
        // targetting the post form
        let newPostForm = $('#new-post-form');
        // when we submit the post
        newPostForm.submit(function(e){
            e.preventDefault();
            $.ajax({
                type: "post",
                url: "/posts/create",
                data: newPostForm.serialize(), // serialize make the coming data from form into json
                success: function (data) {
                    let newPost = newPostDom(data.data.post);
                    $('#posts-list-container>ul').prepend(newPost);

                    // delete post
                    deletePost($(' .delete-post-button',newPost));
                },
                error: function(error){
                    console.log(error.responseText);
                }
            });
        });
    }

    // method to create a post in DOM
    let newPostDom = function(post){
        return $(`<li id="post-${post._id}">
            <p>
                <small>
                    <a class="delete-post-button" href="/posts/destroy/${post._id}">X</a>
                </small>
                ${post.content}
                <br>
                <small>
                    ${post.user.name}
                </small>
            </p>
            <div class="post-comments">                
                <form action="/comments/create" method="post">
                    <input type="text" name="content"  placeholder="Type Here to add comment..." required>
                    <input type="hidden" name="post" value="${post._id}">
                    <input type="submit" value="Add Comment">
                </form>
               
                <!-- showing comments of this post -->
                <div class="post-comments-list">
                    <ul id="post-comments-${post._id}">
                    </ul>
                </div>
            </div>
        </li>`)
    }

    // method to delete a post from Dom
    let deletePost = function(deleteLink){ // deleteLink refer to entire <a> tag in post deletion
        $(deleteLink).click(function (e) { 
            e.preventDefault();
            console.log('deleteLink',deleteLink);
            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    $(`#post-${data.data.post_id}`).remove();
                },
                error: function(data){
                    console.log(data.responseText)
                }
            })
            
        });
    }

    // method to make all post ajax while loading first time
    let convertPostToAjax = function(){
        $('#posts-list-container>ul>li').each(function(){
            let self = $(this);  // shows current post
            // delete a post
            let deleteButton = $(" .delete-post-button", self);
            deletePost(deleteButton);
            
            let postId = self.prop("id").split("-")[1]; // get id of each post so that in future we can target comment form of current post
            let commentObject = new PostComments(postId) // make object of each post so that we can target comment form of respective post
            commentObject.convertCommentToAjax(postId);
        })
    }

    convertPostToAjax()
    createPost();
}