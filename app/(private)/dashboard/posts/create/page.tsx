"use client";
import type { Content } from "@tiptap/react";
import { useState } from "react";
import { Tiptap } from "./tiptap";
export default function CreatePostPage() {
  const [value, setValue] = useState<Content>("");
  const handleCreatePost = () => {
    window.alert(value);
  };
  return (
    <div>
      <h1>Create post</h1>
      <Tiptap onChange={setValue} value={value} />
      <button onClick={handleCreatePost} type="button">
        create post
      </button>
    </div>
  );
}
