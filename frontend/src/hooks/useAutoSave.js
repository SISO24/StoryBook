//
import { useRef } from "react";
import {
  updateStoryService,
  updateBlockService,
} from "../service/StoryService";
import { debounce } from "../utils/debounce";

export const useAutoSave = (storyId, onSaving) => {
  const saveTitle = useRef(
    debounce(async (title) => {
      if (!storyId || storyId === "undefined") return;
      onSaving(true);
      try {
        await updateStoryService(storyId, title);
      } finally {
        onSaving(false);
      }
    }, 800),
  ).current;

  const saveBlock = useRef(
    debounce(async (blockId, content) => {
      if (!storyId || storyId === "undefined") return;

      onSaving(true);
      try {
        await updateBlockService(storyId, blockId, content);
      } finally {
        onSaving(false);
      }
    }, 800),
  ).current;

  return { saveTitle, saveBlock };
};
