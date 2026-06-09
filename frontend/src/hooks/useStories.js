import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getStoriesService,
  getStoryService,
  createStoryService,
  updateStoryService,
  deleteStoryService,
  getSharedStoriesService,
  revokeShareService,
} from "../service/StoryService";

import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useUIStore } from "../store/UiStore";

export const useStories = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: stories = [], isLoading } = useQuery({
    queryKey: ["stories"],
    queryFn: getStoriesService,
  });

  const { data: sharedStories = [] } = useQuery({
    queryKey: ["shared-stories"],
    queryFn: getSharedStoriesService,
  });

  const createStory = useMutation({
    mutationFn: (title) => createStoryService(title),
    onSuccess: (newStory) => {
      queryClient.invalidateQueries({ queryKey: ["stories"] });
      navigate(`/stories/${newStory.id}`);
    },
    onError: () => toast.error("Failed to create story"),
  });

  const deleteStory = useMutation({
    mutationFn: (id) => deleteStoryService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stories"] });
      toast.success("Story deleted");
      navigate("/");
    },
    onError: () => toast.error("Failed to delete story"),
  });

  const revokeShareMutation = useMutation({
    mutationFn: ({ storyId, shareId }) => revokeShareService(storyId, shareId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shared-stories"] });
      toast.success("Removed from your workspace view");
      navigate("/");
    },
    onError: () => toast.error("Failed to remove shared connection"),
  });

  return {
    stories,
    sharedStories,
    isLoading,
    createStory: (title) => createStory.mutate(title),
    deleteStory: (id) => deleteStory.mutate(id),
    revokeShare: (storyId, shareId) =>
      revokeShareMutation.mutate({ storyId, shareId }),
    isCreating: createStory.isPending,
  };
};

export const useStory = (id) => {
  const { data: story, isLoading } = useQuery({
    queryKey: ["story", id],
    queryFn: () => getStoryService(id),
    enabled: !!id,
  });

  return { story, isLoading };
};
