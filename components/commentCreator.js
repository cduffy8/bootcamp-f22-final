import styles from "../styles/Home.module.css";
import { useState } from 'react';
import { useRouter } from 'next/router';

function CommentCreator(props) {

  const { postid, setComments, comments } = props;

  const [prompt, setPrompt] = useState('');
  const [npComment, setNPComment] = useState('');
  const [commentList, setCommentList] = useState(props.comments);
  console.log(props.comments);

  const router = useRouter();

  const createComment = event => {
    event.preventDefault(); // prevent page refresh

    if (npComment === '') {
      setPrompt('The comment must have text!');
    } else {

      let params = { body:npComment };

      fetch("/api/comments/create", {
        method: "POST",
        body: JSON.stringify(params),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          let params = { 
            query: { _id: postid },
            update: { $push: { comments: data["_id"] }}
          };
          linkPost(params);
          // since it is server side rendered we must reroute to the page to refresh the render
          //router.push('/posts/' + data["_id"]);
          {setComments([...comments, data])}
      });

      
      setNPComment('');
      setPrompt('');
    }
  };

  return (
    <div className={styles.makePostUI}>
      <form onSubmit={createComment}>

        

        <div className={styles.createPost}>
        <h1>Add Comment</h1>
          <div className={styles.textField} id='image'>
            <label>Title: </label>
            <input
              id="comment"
              type="text"
              onChange={event => setNPComment(event.target.value)}
              value={npComment}
            />
          </div>
            <button className={styles.delete} type="submit">{"Post Comment"}</button>
        </div>
        <h3>{prompt}</h3>

      </form>
    </div>
  );
}

function linkPost(params, router) {
  fetch("/api/posts/linkcomment", {
    method: "POST",
    body: JSON.stringify(params),
  })
    .then((res) => res.json())
    .then((data) => console.log(data));
}

export default CommentCreator;