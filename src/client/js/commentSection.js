import regeneratorRuntime from "regenerator-runtime";

const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const deleteBtns = document.querySelectorAll(".delete__comment");

const addComment = (text, newCommentId) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.className = "video__comment";
  newComment.dataset.id = newCommentId;
  const span = document.createElement("span");
  span.innerText = ` ${text}`;
  newComment.appendChild(span);
  videoComments.prepend(newComment);
  const del = document.createElement("span");
  del.className = "delete__comment";
  del.innerText = "삭제";
  newComment.appendChild(del);
  const newDeleteCommentBtn = document.querySelector(".delete__comment");
  newDeleteCommentBtn.addEventListener("click", handleDelete);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = `${textarea.value}`;
  const videoId = videoContainer.dataset.id;
  if (text === "" || text.trim() === "") {
    return;
  }
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  textarea.value = "";
  if (response.status === 201) {
    textarea.value = "";
    const json = await response.json();
    const newCommentId = json[0].newCommentId;
    const { newText } = json[1];
    addComment(newText, newCommentId);
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}

const handleDelete = async (event) => {
  const {
    target: { parentElement: deleteComment },
  } = event;
  const {
    dataset: { id },
  } = deleteComment;
  deleteComment.remove();
  await fetch(`/api/comments/${id}/delete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

if (deleteBtns) {
  deleteBtns.forEach((btn) => {
    btn.addEventListener("click", handleDelete);
  });
}
