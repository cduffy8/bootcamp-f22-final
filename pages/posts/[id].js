import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import PostPage from "../../components/postPage";
import { useState } from "react";
import styles from "../../styles/Home.module.css";
import PostEditor from "../../components/postEditor";

const Post = (props) => {
  console.log(props);
  const { posts } = props;
  const [postData, setPostData] = useState(posts[0]);
  const router = useRouter();
  const [clicks, addClick] = useState(0);
  const [edit, setEdit] = useState(0);

  if (!postData["_id"]) {
    return (
      <div>
        <Link href="/">
          <h3>Return Home</h3>
        </Link>
        <p>No post was found with this id.</p>
      </div>
    );
  }
  return (
    <div>
      <div className = {styles.header}
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <div className={styles.homeButton}>
          <Link href="/">
            <h3>{"Return Home"}</h3>
          </Link>
        </div>
        <div className={styles.buttons}>
          {clicks == 0 && (
            <button
              className={styles.delete}
              onClick={() => {
                if (clicks == 2) {
                  addClick(0);
                  deletePost(postData["_id"], router);
                }
                if (clicks < 1) {
                  addClick(clicks + 1);
                }
                console.log(clicks);
              }}
            >
              Delete
            </button>
          )}

          {clicks == 1 && (
            <div>
              <button
                className={styles.delete}
                onClick={() => {
                  addClick(0), deletePost(postData["_id"], router);
                }}
              >
                Press to Confirm Delete
              </button>
              <button
                className={styles.delete}
                onClick={() => {
                  addClick(0);
                }}
              >
                Cancel
              </button>
            </div>
          )}

          <button
            className={styles.delete}
            onClick={() => {
              setEdit(1);
            }}
          >
            Edit Post
          </button>
        </div>
      </div>

      {edit == 0 && (
        <div>
          <PostPage
            title={postData.title}
            body={postData.body}
            date={postData.date}
            image={postData.image}
            comments={postData.comments}
            postid={postData._id}
          />
        </div>
      )}

      {edit == 1 && (
        <div>
          <PostEditor
            postId={postData._id}
            setEdit={setEdit}
            setPostData = {setPostData}
            postData = {postData}
          />
        </div>
      )}
    </div>
  );
};

function deletePost(id, router) {
  const params = { _id: id };

  fetch("/api/posts/delete", {
    method: "DELETE",
    body: JSON.stringify(params),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      router.push("/");
    });
}

export async function getServerSideProps(context) {
  const { id } = context.params;
  const res = await fetch(`http://localhost:3000/api/posts/${id}`);
  const data = await res.json();
  return {
    props: {
      posts: data,
    },
  };
}

export default Post;
