"use client";
import type { Content } from "@tiptap/react";
import { MinimalTiptapEditor } from "@/components/ui/minimal-tiptap";

export const Tiptap = ({
  value,
  onChange,
}: {
  value: Content;
  onChange: (value: Content) => void;
}) => {
  return (
    <MinimalTiptapEditor
      autofocus={true}
      className="w-full"
      editable={true}
      editorClassName="focus:outline-hidden"
      editorContentClassName="p-5"
      onChange={onChange}
      output="html"
      placeholder="Enter your description..."
      value={value ?? ""}
    />
  );
};
