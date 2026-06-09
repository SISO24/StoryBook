import { useRef, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  updateStoryService,
  updateBlockService,
} from "../service/StoryService";
import { debounce } from "../utils/debounce";

export const useAutoSave = (onSaving) => {
  const queryClient = useQueryClient();

  // Create a single debounced instance for title modifications that accepts the ID dynamically
  const debouncedSaveTitle = useRef(
    debounce(async (activeId, title) => {
      if (!activeId || activeId === "undefined") return;
      onSaving(true);
      try {
        await updateStoryService(activeId, title);
        await queryClient.invalidateQueries({ queryKey: ["stories"] });
        await queryClient.invalidateQueries({ queryKey: ["story", activeId] });
      } catch (err) {
        console.error("Title sync failed:", err);
      } finally {
        onSaving(false);
      }
    }, 800),
  ).current;

  // Create a single debounced instance for body text modifications that accepts parameters dynamically
  const debouncedSaveBlock = useRef(
    debounce(async (activeId, blockId, content) => {
      if (!activeId || activeId === "undefined") return;
      onSaving(true);
      try {
        await updateBlockService(activeId, blockId, content);
        await queryClient.invalidateQueries({ queryKey: ["story", activeId] });
      } catch (err) {
        console.error("Block content sync failed:", err);
      } finally {
        onSaving(false);
      }
    }, 800),
  ).current;

  // Clean up any pending debounced timers if the component unmounts
  useEffect(() => {
    return () => {
      if (debouncedSaveTitle.cancel) debouncedSaveTitle.cancel();
      if (debouncedSaveBlock.cancel) debouncedSaveBlock.cancel();
    };
  }, [debouncedSaveTitle, debouncedSaveBlock]);

  // Expose clean runner wrappers that capture parameters explicitly at the millisecond of call execution
  return {
    saveTitle: (currentId, title) => debouncedSaveTitle(currentId, title),
    saveBlock: (currentId, blockId, content) =>
      debouncedSaveBlock(currentId, blockId, content),
  };
};
