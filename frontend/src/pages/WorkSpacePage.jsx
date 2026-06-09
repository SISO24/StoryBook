import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useStories, useStory } from "../hooks/useStories";
import { useAutoSave } from "../hooks/useAutoSave";
import useAuthStore from "../store/AuthStore";
import { addBlockService } from "../service/StoryService";
import { uploadAudioService } from "../service/UploadService";
import { useQueryClient } from "@tanstack/react-query";
import ShareModal from "../modals/ShareModal";
import { useAuth } from "../hooks/useAuth";
import { LogOut, ChevronLeft, Edit2, Check } from "lucide-react";

export default function WorkspacePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const lastLoadedStoryId = useRef(null);

  const { logout } = useAuth();

  const {
    stories,
    sharedStories,
    createStory,
    deleteStory,
    revokeShare,
    isLoading: isLoadingList,
  } = useStories();

  const { story, isLoading: isLoadingStory } = useStory(id);
  const user = useAuthStore((state) => state.user);

  const [savingStatus, setSavingStatus] = useState(false);
  const { saveTitle, saveBlock } = useAutoSave(setSavingStatus);

  const [localTitle, setLocalTitle] = useState("");
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const creatingBlock = useRef(false);
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const titleInputRef = useRef(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingContent, setIsEditingContent] = useState(false);

  const sharedStoryMeta = sharedStories?.find((s) => s.storyId === id);
  const isReadOnly = !!sharedStoryMeta;

  useEffect(() => {
    if (story && id === story.id) {
      if (lastLoadedStoryId.current !== id) {
        setLocalTitle(story.title || "");
        setIsEditingTitle(false);
        setIsEditingContent(false);

        if (story.blocks && story.blocks.length > 0) {
          const rawContent = story.blocks[0].content || "";
          if (editorRef.current) {
            editorRef.current.innerHTML =
              decodeMarkdownTokensToHtml(rawContent);
          }
        } else {
          if (editorRef.current) editorRef.current.innerHTML = "";
        }

        lastLoadedStoryId.current = id;
      }
    } else if (!id) {
      setLocalTitle("");
      setIsEditingTitle(false);
      setIsEditingContent(false);
      lastLoadedStoryId.current = null;
      if (editorRef.current) editorRef.current.innerHTML = "";
    }
  }, [story, id]);

  const handleCreateNewStory = () => {
    createStory("Untitled Story");
  };

  const focusElementAtEnd = (element) => {
    if (!element) return;
    element.focus();
    if (typeof element.selectionStart === "number") {
      element.selectionStart = element.selectionEnd = element.value.length;
    } else if (window.getSelection && document.createRange) {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(element);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  const handleTitleButtonClick = () => {
    if (isReadOnly) return;

    if (!isEditingTitle) {
      setIsEditingTitle(true);
      setTimeout(() => focusElementAtEnd(titleInputRef.current), 50);
    } else {
      if (id && id !== "undefined") {
        setSavingStatus(true);
        saveTitle(id, localTitle);
      }
      setIsEditingTitle(false);
    }
  };

  const handleContentButtonClick = async () => {
    if (isReadOnly) return;

    if (!isEditingContent) {
      setIsEditingContent(true);
      setTimeout(() => focusElementAtEnd(editorRef.current), 50);
    } else {
      if (id && id !== "undefined" && editorRef.current) {
        setSavingStatus(true);
        const currentHtmlValue = editorRef.current.innerHTML;
        const encodedMarkdownText =
          encodeHtmlToMarkdownTokens(currentHtmlValue);

        if (story?.blocks && story.blocks.length > 0) {
          saveBlock(id, story.blocks[0].id, encodedMarkdownText);
        } else {
          await addBlockService(id, "TEXT", encodedMarkdownText);
          await queryClient.invalidateQueries({ queryKey: ["story", id] });
          setSavingStatus(false);
        }
      }
      setIsEditingContent(false);
    }
  };

  const decodeMarkdownTokensToHtml = (text) => {
    if (!text) return "";
    return text
      .split("\n")
      .map((line) => {
        const audioMatch = line.match(/^\[Audio:\s*(.*?)\]\((.*?)\)$/);
        if (audioMatch) {
          return `
            <div class="inline-audio-node my-3 max-w-lg bg-[#222222] border border-[#2d2d2d] rounded-xl p-2.5 px-4 flex items-center gap-3 shadow-md" contenteditable="false" data-audio-name="${audioMatch[1]}" data-audio-url="${audioMatch[2]}">
              <span class="text-sm select-none">🎵</span>
              <div class="flex-1 min-w-0 select-none">
                <div class="text-[11px] text-gray-400 font-mono truncate mb-0.5">${audioMatch[1]}</div>
                <audio controls class="w-full h-7 accent-white select-none" src="${audioMatch[2]}"></audio>
              </div>
            </div>
          `;
        }
        return `<div>${line.trim() === "" ? "<br>" : line}</div>`;
      })
      .join("");
  };

  const encodeHtmlToMarkdownTokens = (html) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const lines = [];

    if (!tempDiv.hasChildNodes() || tempDiv.innerText.trim() === "") {
      return " ";
    }

    tempDiv.childNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.classList.contains("inline-audio-node")) {
          const name = node.getAttribute("data-audio-name");
          const url = node.getAttribute("data-audio-url");
          lines.push(`[Audio: ${name}](${url})`);
        } else if (node.nodeName === "BR") {
          lines.push(" ");
        } else {
          const text = node.innerText || node.textContent || "";
          lines.push(text.trim() === "" ? " " : text.replace(/\n/g, ""));
        }
      } else if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent || "";
        if (text.replace(/\n/g, "").trim() !== "") {
          lines.push(text.replace(/\n/g, ""));
        }
      }
    });

    return lines.length === 0 ? " " : lines.join("\n");
  };
  const handleEditorInput = () => {};

  const handleAudioFileSelection = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !id || !editorRef.current || isReadOnly) return;

    try {
      setSavingStatus(true);
      const mediaUrl = await uploadAudioService(file);

      if (mediaUrl) {
        const originalEditableState = editorRef.current.isContentEditable;
        editorRef.current.contentEditable = "true";
        editorRef.current.focus();

        const selection = window.getSelection();
        let range;
        if (selection.rangeCount > 0) {
          range = selection.getRangeAt(0);
        } else {
          range = document.createRange();
          range.selectNodeContents(editorRef.current);
          range.collapse(false);
        }

        const audioNodeWrapper = document.createElement("div");
        audioNodeWrapper.className =
          "inline-audio-node my-4 max-w-lg bg-[#222222] border border-[#2d2d2d] rounded-xl p-2.5 px-4 flex items-center gap-3 shadow-xl select-none";
        audioNodeWrapper.setAttribute("contenteditable", "false");
        audioNodeWrapper.setAttribute(
          "data-audio-name",
          file.name || "Manuscript Track",
        );
        audioNodeWrapper.setAttribute("data-audio-url", mediaUrl);

        audioNodeWrapper.innerHTML = `
          <span class="text-sm select-none">🎵</span>
          <div class="flex-1 min-w-0 select-none">
            <div class="text-[11px] text-gray-400 font-mono truncate mb-0.5">${file.name || "Audio Track"}</div>
            <audio controls class="w-full h-7 accent-white" src="${mediaUrl}"></audio>
          </div>
        `;

        range.insertNode(audioNodeWrapper);

        const trailingSpacingBlock = document.createElement("div");
        trailingSpacingBlock.innerHTML = "<br>";
        audioNodeWrapper.parentNode.insertBefore(
          trailingSpacingBlock,
          audioNodeWrapper.nextSibling,
        );

        range.setStartAfter(trailingSpacingBlock);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);

        editorRef.current.contentEditable = originalEditableState;

        const currentHtmlValue = editorRef.current.innerHTML;
        const encodedMarkdownText =
          encodeHtmlToMarkdownTokens(currentHtmlValue);

        if (story?.blocks && story.blocks.length > 0) {
          saveBlock(story.blocks[0].id, encodedMarkdownText);
        }
      }
    } catch (err) {
      console.error("Audio block injection failed:", err);
    } finally {
      setSavingStatus(false);
      e.target.value = "";
    }
  };

  const triggerAudioUpload = () => {
    if (isReadOnly) return;
    if (fileInputRef.current) fileInputRef.current.click();
  };

  return (
    <div className="h-screen w-full flex bg-[#191919] text-[#e8e8e8] font-sans antialiased overflow-hidden">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleAudioFileSelection}
        accept="audio/*"
        className="hidden"
      />

      <aside
        className={`w-full md:w-[260px] h-full bg-[#111111] flex flex-col border-r border-[#222222] select-none flex-shrink-0 relative ${id ? "hidden md:flex" : "flex"}`}
      >
        <div className="p-4 flex items-center justify-between border-b border-[#1a1a1a]">
          <div className="flex items-center gap-2 overflow-hidden w-full">
            <div className="w-5 h-5 bg-[#2d2d2d] rounded text-gray-300 flex items-center justify-center font-bold text-xs flex-shrink-0">
              {user?.email ? user.email.charAt(0).toUpperCase() : "U"}
            </div>
            <span className="font-medium text-xs truncate text-gray-400">
              {user?.email || "guest@storybook.com"}
            </span>
          </div>
        </div>

        {id && !isReadOnly && (
          <div className="p-3 bg-[#111111] border-b border-[#1a1a1a] sticky top-0 z-30">
            <button
              onClick={triggerAudioUpload}
              className="w-full bg-white hover:bg-gray-200 text-black text-xs font-semibold py-2.5 px-3 rounded-md shadow transition-all flex items-center justify-center gap-2"
            >
              <span>🔊</span> Import Audio
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-2 py-4 space-y-6">
          <div>
            <div className="px-2.5 mb-2 flex items-center justify-between text-xs font-bold text-[#555555] uppercase tracking-wider">
              <span>Stories</span>
              <button
                onClick={handleCreateNewStory}
                className="hover:text-white text-[#666] transition-colors p-0.5 rounded hover:bg-[#1c1c1c]"
                title="New story"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
            </div>
            <div className="space-y-0.5">
              {stories?.map((item) => (
                <div
                  key={item.id}
                  className={`group flex items-center justify-between px-2.5 py-1.5 rounded-md text-sm transition-all ${item.id === id && !isReadOnly ? "bg-[#222222] text-white font-medium" : "text-[#8a8a8a] hover:text-[#e8e8e8] hover:bg-[#141414]"}`}
                >
                  <Link
                    to={`/stories/${item.id}`}
                    className="flex items-center gap-2 truncate flex-1"
                  >
                    <svg
                      className="w-3.5 h-3.5 text-[#555] flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <span className="truncate">
                      {item.title || "Untitled Story"}
                    </span>
                  </Link>
                  {!isReadOnly && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        if (confirm("Delete permanently?"))
                          deleteStory(item.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-[#444] hover:text-red-400 p-0.5 transition-all cursor-pointer"
                      title="Delete story"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          {sharedStories?.length > 0 && (
            <div className="pt-4 border-t border-[#222]/60">
              <div className="px-2.5 mb-2 text-xs font-bold text-[#555555] uppercase tracking-wider select-none">
                Shared With Me
              </div>
              <div className="space-y-0.5">
                {sharedStories.map((item) => (
                  <div
                    key={item.shareId}
                    className={`group flex items-center justify-between px-2.5 py-1.5 rounded-md text-sm transition-all ${item.storyId === id && isReadOnly ? "bg-[#222222] text-white font-medium" : "text-gray-400 hover:text-white hover:bg-[#141414]"}`}
                  >
                    <Link
                      to={`/stories/${item.storyId}`}
                      onClick={() => {
                        lastLoadedStoryId.current = null;
                      }}
                      className="flex items-center gap-1.5 truncate flex-1"
                    >
                      <span className="text-xs text-gray-500 flex-shrink-0 select-none">
                        👥
                      </span>
                      <div className="flex flex-col truncate">
                        <span className="truncate text-gray-200 group-hover:text-white font-medium">
                          {item.storyTitle || "Untitled Shared Story"}
                        </span>
                        <span className="text-xs text-gray-400 font-medium truncate mt-0.5 transition-colors group-hover:text-gray-300">
                          by {item.sharedByEmail?.split("@")[0]}
                        </span>
                      </div>
                    </Link>

                    {/* NEW: Safe Revoke Button for Shared Readers */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        if (
                          confirm(
                            "Remove this shared story from your dashboard view?",
                          )
                        ) {
                          revokeShare(item.storyId, item.shareId);

                          if (item.storyId === id) {
                            navigate("/");
                          }
                        }
                      }}
                      className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 p-0.5 transition-all cursor-pointer flex-shrink-0 ml-1.5"
                      title="Remove from my view"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="p-3 bg-[#0d0d0d] border-t border-[#1a1a1a] mt-auto">
          <button
            onClick={logout}
            className="w-full bg-transparent hover:bg-red-500/10 text-gray-500 hover:text-red-400 text-xs font-medium py-2 px-3 rounded-md transition-all flex items-center justify-center gap-2 group border border-transparent hover:border-red-500/20"
          >
            <LogOut className="w-3.5 h-3.5 text-gray-500 group-hover:text-red-400 transition-colors" />
            <span>Logout Account</span>
          </button>
        </div>
      </aside>

      <main
        className={`flex-1 h-full flex flex-col overflow-y-auto bg-[#191919] ${id ? "flex" : "hidden md:flex"}`}
      >
        {/* HEADER PANEL REGION */}
        <div className="h-11 w-full flex items-center justify-between px-4 sm:px-6 text-xs text-[#444] font-mono select-none flex-shrink-0 border-b border-[#222]/30">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/")}
              className="flex md:hidden items-center gap-1 text-gray-400 hover:text-white transition-colors bg-transparent border-none outline-none p-0 cursor-pointer font-sans text-sm font-medium"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Stories</span>
            </button>
            {isReadOnly && (
              <span className="inline-flex items-center gap-1 bg-[#222] border border-amber-500/20 rounded px-2 py-0.5 text-[10px] text-amber-500/80 font-medium font-sans">
                👁️ View Only
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            {id && !isReadOnly && (
              <button
                onClick={() => setShareModalOpen(true)}
                className="bg-[#222222] hover:bg-[#2a2a2a] text-gray-300 hover:text-white text-xs font-light tracking-wide px-3 py-1 rounded border border-[#333333] hover:border-[#444444] shadow-sm transition-all flex items-center gap-1.5"
              >
                <svg
                  className="w-3.5 h-3.5 text-gray-400 group-hover:text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
                <span className="hidden sm:inline">Share</span>
              </button>
            )}
            {savingStatus ? (
              <span className="text-emerald-500 flex items-center gap-1.5 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />{" "}
                <span className="hidden sm:inline">Saving changes...</span>
              </span>
            ) : (
              id && <span className="hidden sm:inline">Synced to cloud</span>
            )}
          </div>
        </div>

        <div className="w-full max-w-4xl mx-auto px-6 sm:px-16 pt-8 sm:pt-16 pb-32 space-y-8">
          {id ? (
            isLoadingStory ? (
              <div className="py-24 text-center text-xs tracking-widest text-[#444] animate-pulse uppercase">
                Syncing workspace...
              </div>
            ) : (
              <div className="space-y-12 flex flex-col">
                {/* SECTION GRID 1: TITLE BLOCK COMPONENT ROW */}
                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-start">
                  <input
                    type="text"
                    ref={titleInputRef}
                    value={localTitle}
                    onChange={(e) => setLocalTitle(e.target.value)}
                    disabled={isReadOnly || !isEditingTitle}
                    placeholder="Untitled"
                    className={`w-full bg-transparent border-none text-white text-2xl sm:text-4xl font-bold tracking-tight outline-none placeholder-[#2a2a2a] focus:ring-0 p-0 
    antialiased subpixel-antialiased transform-gpu [transform:translateZ(0)] select-text
    ${isReadOnly ? "cursor-default select-none text-gray-400" : ""} 
    ${!isEditingTitle ? "cursor-default" : "border-b border-[#333] focus:border-white"}`}
                  />

                  {!isReadOnly && (
                    <div className="sticky top-4 z-20 flex-shrink-0">
                      <button
                        onClick={handleTitleButtonClick}
                        className={`text-xs font-semibold py-1.5 px-3 rounded-md shadow transition-all flex items-center gap-2 ${isEditingTitle ? "bg-emerald-600 text-white hover:bg-emerald-500" : "bg-white text-black hover:bg-gray-200"}`}
                      >
                        {isEditingTitle ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          <Edit2 className="w-3.5 h-3.5" />
                        )}
                        <span>
                          {isEditingTitle ? "Save Title" : "Edit Title"}
                        </span>
                      </button>
                    </div>
                  )}
                </div>

                {/* CREATION TIMESTAMPS */}
                <div className="text-xs text-[#444] border-b border-[#222]/40 pb-4 select-none flex justify-between gap-4 -mt-6">
                  <div>
                    <span className="w-16 sm:w-24 inline-block uppercase tracking-wider">
                      Created
                    </span>
                    <span className="text-[#777] font-mono">
                      {story?.createdAt
                        ? new Date(story.createdAt).toLocaleDateString()
                        : "June 5, 2026"}
                    </span>
                  </div>
                </div>

                {/* SECTION GRID 2: SCRIPT WORKSPACE CANVAS COMPONENT ROW */}
                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-start relative">
                  <div
                    ref={editorRef}
                    contentEditable={!isReadOnly && isEditingContent}
                    onInput={handleEditorInput}
                    data-placeholder={
                      isReadOnly
                        ? "No text contents available..."
                        : "Click 'Edit Content' on the right sidebar to unlock script formatting..."
                    }
                    className={`w-full min-h-[500px] bg-transparent outline-none text-[#dcdcdc] text-sm sm:text-base font-light leading-loose tracking-wide font-sans focus:ring-0 carets-white relative before:content-[attr(data-placeholder)] before:text-[#3a3a3a] before:absolute before:inset-0 before:pointer-events-none empty:before:block before:hidden [&_div:empty]:min-h-[1.5rem] ${!isEditingContent ? "cursor-default opacity-80" : "cursor-text opacity-100"}`}
                  />

                  {!isReadOnly && (
                    <div className="sticky top-4 z-20 flex-shrink-0">
                      <button
                        onClick={handleContentButtonClick}
                        className={`text-xs font-semibold py-1.5 px-3 rounded-md shadow transition-all flex items-center gap-2 ${isEditingContent ? "bg-emerald-600 text-white hover:bg-emerald-500" : "bg-white text-black hover:bg-gray-200"}`}
                      >
                        {isEditingContent ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          <Edit2 className="w-3.5 h-3.5" />
                        )}
                        <span>
                          {isEditingContent ? "Save Content" : "Edit Content"}
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          ) : (
            <div className="py-40 text-center max-w-xs mx-auto space-y-4 select-none">
              <div className="text-2xl">📝</div>
              <h3 className="text-white font-medium text-sm">
                Personal Workspace Dashboard
              </h3>
            </div>
          )}
        </div>
      </main>

      {shareModalOpen && (
        <ShareModal storyId={id} onClose={() => setShareModalOpen(false)} />
      )}
    </div>
  );
}
