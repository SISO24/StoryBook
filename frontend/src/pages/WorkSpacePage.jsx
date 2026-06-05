// import { useState, useEffect, useRef } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import { useStories, useStory } from "../hooks/useStories";
// import { useAutoSave } from "../hooks/useAutoSave";
// import useAuthStore from "../store/AuthStore";
// import { addBlockService } from "../service/StoryService";
// import { useQueryClient } from "@tanstack/react-query";

// export default function WorkspacePage() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();

//   const {
//     stories,
//     sharedStories,
//     createStory,
//     deleteStory,
//     isLoading: isLoadingList,
//   } = useStories();
//   const { story, isLoading: isLoadingStory } = useStory(id);
//   const user = useAuthStore((state) => state.user);

//   const [savingStatus, setSavingStatus] = useState(false);
//   const { saveTitle, saveBlock } = useAutoSave(id, setSavingStatus);

//   const [localTitle, setLocalTitle] = useState("");
//   const [localContent, setLocalContent] = useState("");
//   const creatingBlock = useRef(false);

//   // Sync title and text content safely when the route ID modifications trigger
//   useEffect(() => {
//     if (story && id === story.id) {
//       setLocalTitle(story.title || "");
//       // Gather the text content if a block exists, otherwise keep it blank
//       if (story.blocks && story.blocks.length > 0) {
//         setLocalContent(story.blocks[0].content || "");
//       } else {
//         setLocalContent("");
//       }

//       // Auto-resize the text content area on load
//       setTimeout(() => {
//         const el = document.getElementById("main-story-textarea");
//         if (el) autoResize(el);
//       }, 50);
//     } else if (!id) {
//       setLocalTitle("");
//       setLocalContent("");
//     }
//   }, [story, id]);

//   const handleCreateNewStory = () => {
//     createStory("Untitled Story");
//   };

//   const handleTitleChange = (e) => {
//     const val = e.target.value;
//     setLocalTitle(val);
//     if (id && id !== "undefined") {
//       saveTitle(val);
//     }
//   };

//   const autoResize = (el) => {
//     if (el) {
//       el.style.height = "auto";
//       el.style.height = el.scrollHeight + "px";
//     }
//   };

//   // Handles the standard background auto-saving operations
//   const handleContentChange = (e) => {
//     const val = e.target.value;
//     setLocalContent(val);
//     autoResize(e.target);

//     if (!id || id === "undefined") return;
//     const safeBackendPayload = val === "" ? " " : val;
//     // Check if a block already exists to update it, or add an initial block row if empty
//     if (story?.blocks && story.blocks.length > 0) {
//       const activeBlockId = story.blocks[0].id;
//       saveBlock(activeBlockId, val); // Debounced save to update existing text content block
//     } else {
//       // Create the initial text content row placeholder block safely if typing into an entirely fresh layout
//       debouncedInitialCreate(safeBackendPayload);
//     }
//   };

//   // Debounce wrapper to prevent multiple creations while typing into an empty canvas
//   const initialCreateTimeout = useRef(null);
//   const debouncedInitialCreate = (val) => {
//     if (initialCreateTimeout.current)
//       clearTimeout(initialCreateTimeout.current);
//     initialCreateTimeout.current = setTimeout(async () => {
//       if (creatingBlock.current || !val.trim()) return;
//       creatingBlock.current = true;
//       try {
//         setSavingStatus(true);
//         await addBlockService(id, "TEXT", val);
//         await queryClient.invalidateQueries({ queryKey: ["story", id] });
//       } catch (err) {
//         console.error("Failed to create initial block text segment", err);
//       } finally {
//         setSavingStatus(false);
//         creatingBlock.current = false;
//       }
//     }, 800);
//   };

//   return (
//     <div className="h-screen w-full flex bg-[#191919] text-[#e8e8e8] font-sans antialiased overflow-hidden">
//       {/* SIDEBAR PANEL */}
//       <aside className="w-[260px] h-full bg-[#111111] flex flex-col border-r border-[#222222] select-none flex-shrink-0">
//         <div className="p-4 flex items-center justify-between border-b border-[#1a1a1a]">
//           <div className="flex items-center gap-2 overflow-hidden w-full">
//             <div className="w-5 h-5 bg-[#2d2d2d] rounded text-gray-300 flex items-center justify-center font-bold text-xs flex-shrink-0">
//               {user?.email ? user.email.charAt(0).toUpperCase() : "U"}
//             </div>
//             <span className="font-medium text-xs truncate text-gray-400">
//               {user?.email || "guest@storybook.com"}
//             </span>
//           </div>
//         </div>

//         <div className="flex-1 overflow-y-auto px-2 py-4 space-y-6">
//           <div>
//             <div className="px-2.5 mb-2 flex items-center justify-between text-xs font-bold text-[#555555] uppercase tracking-wider">
//               <span>Stories</span>
//               <button
//                 onClick={handleCreateNewStory}
//                 className="hover:text-white text-[#666] transition-colors p-0.5 rounded hover:bg-[#1c1c1c]"
//                 title="New story"
//               >
//                 <svg
//                   className="w-4 h-4"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2.5}
//                     d="M12 4v16m8-8H4"
//                   />
//                 </svg>
//               </button>
//             </div>

//             <div className="space-y-0.5">
//               {isLoadingList ? (
//                 <div className="px-2.5 py-1 text-xs text-[#333] animate-pulse">
//                   Loading list...
//                 </div>
//               ) : (
//                 stories?.map((item) => (
//                   <div
//                     key={item.id}
//                     className={`group flex items-center justify-between px-2.5 py-1.5 rounded-md text-sm transition-all ${
//                       item.id === id
//                         ? "bg-[#222222] text-white font-medium"
//                         : "text-[#8a8a8a] hover:text-[#e8e8e8] hover:bg-[#141414]"
//                     }`}
//                   >
//                     <Link
//                       to={`/stories/${item.id}`}
//                       className="flex items-center gap-2 truncate flex-1"
//                     >
//                       <svg
//                         className="w-3.5 h-3.5 text-[#555] flex-shrink-0"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                         />
//                       </svg>
//                       <span className="truncate">
//                         {item.title || "Untitled Story"}
//                       </span>
//                     </Link>
//                     <button
//                       onClick={(e) => {
//                         e.preventDefault();
//                         if (confirm("Delete permanently?"))
//                           deleteStory(item.id);
//                       }}
//                       className="opacity-0 group-hover:opacity-100 text-[#444] hover:text-red-400 p-0.5 transition-all"
//                     >
//                       <svg
//                         className="w-3.5 h-3.5"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
//                         />
//                       </svg>
//                     </button>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//         </div>
//       </aside>

//       {/* CANVAS MAIN WRITER SECTION */}
//       <main className="flex-1 h-full flex flex-col overflow-y-auto bg-[#191919]">
//         <div className="h-11 w-full flex items-center justify-end px-6 text-xs text-[#444] font-mono select-none">
//           {savingStatus ? (
//             <span className="text-emerald-500 flex items-center gap-1.5 animate-pulse">
//               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
//               Saving modification logs...
//             </span>
//           ) : (
//             id && <span>Synced to cloud</span>
//           )}
//         </div>

//         <div className="w-full max-w-2xl mx-auto px-16 pt-16 pb-32 space-y-8">
//           {id ? (
//             isLoadingStory ? (
//               <div className="py-24 text-center text-xs tracking-widest text-[#444] animate-pulse uppercase">
//                 Syncing workspace...
//               </div>
//             ) : (
//               <div className="space-y-6">
//                 <input
//                   type="text"
//                   value={localTitle}
//                   onChange={handleTitleChange}
//                   placeholder="Untitled"
//                   className="w-full bg-transparent border-none text-white text-4xl font-bold tracking-tight outline-none placeholder-[#2a2a2a] focus:ring-0 p-0"
//                 />

//                 <div className="text-xs text-[#444] border-b border-[#222]/40 pb-6 select-none">
//                   <span className="w-24 inline-block uppercase tracking-wider">
//                     Created
//                   </span>
//                   <span className="text-[#777] font-mono">
//                     {story?.createdAt
//                       ? new Date(story.createdAt).toLocaleDateString()
//                       : "June 4, 2026"}
//                   </span>
//                 </div>

//                 <div className="w-full">
//                   {/* CLEAN SIMPLIFIED UNIFIED TEXTAREA FILE LAYER */}
//                   <textarea
//                     id="main-story-textarea"
//                     value={localContent}
//                     placeholder="Start writing your story notes here..."
//                     onChange={handleContentChange}
//                     onBlur={() => {
//                       // Fallback protection: ensure changes save if user leaves tab quickly
//                       if (story?.blocks && story.blocks.length > 0) {
//                         saveBlock(story.blocks[0].id, localContent);
//                       }
//                     }}
//                     className="w-full bg-transparent border-none resize-none outline-none focus:ring-0 p-0 text-[#dcdcdc] text-base font-light leading-relaxed tracking-wide font-sans"
//                     rows={10}
//                   />
//                 </div>
//               </div>
//             )
//           ) : (
//             <div className="py-40 text-center max-w-xs mx-auto space-y-4 select-none">
//               <div className="text-2xl">📝</div>
//               <h3 className="text-white font-medium text-sm">
//                 Personal Workspace Dashboard
//               </h3>
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }

//down is working second code,but audio import is just returning url

// import { useState, useEffect, useRef } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import { useStories, useStory } from "../hooks/useStories";
// import { useAutoSave } from "../hooks/useAutoSave";
// import useAuthStore from "../store/AuthStore";
// import { addBlockService } from "../service/StoryService";
// import { uploadAudioService } from "../service/UploadService"; // Ensure this is imported correctly
// import { useQueryClient } from "@tanstack/react-query";

// export default function WorkspacePage() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();

//   const {
//     stories,
//     sharedStories,
//     createStory,
//     deleteStory,
//     isLoading: isLoadingList,
//   } = useStories();
//   const { story, isLoading: isLoadingStory } = useStory(id);
//   const user = useAuthStore((state) => state.user);

//   const [savingStatus, setSavingStatus] = useState(false);
//   const { saveTitle, saveBlock } = useAutoSave(id, setSavingStatus);

//   const [localTitle, setLocalTitle] = useState("");
//   const [localContent, setLocalContent] = useState("");
//   const creatingBlock = useRef(false);

//   // File Upload Trackers
//   const fileInputRef = useRef(null);
//   const textareaRef = useRef(null);

//   // Sync title and text content safely when the route ID modifications trigger
//   useEffect(() => {
//     if (story && id === story.id) {
//       setLocalTitle(story.title || "");
//       if (story.blocks && story.blocks.length > 0) {
//         setLocalContent(story.blocks[0].content || "");
//       } else {
//         setLocalContent("");
//       }

//       // Auto-resize the text content area on load
//       setTimeout(() => {
//         if (textareaRef.current) autoResize(textareaRef.current);
//       }, 50);
//     } else if (!id) {
//       setLocalTitle("");
//       setLocalContent("");
//     }
//   }, [story, id]);

//   const handleCreateNewStory = () => {
//     createStory("Untitled Story");
//   };

//   const handleTitleChange = (e) => {
//     const val = e.target.value;
//     setLocalTitle(val);
//     if (id && id !== "undefined") {
//       saveTitle(val);
//     }
//   };

//   const autoResize = (el) => {
//     if (el) {
//       el.style.height = "auto";
//       el.style.height = el.scrollHeight + "px";
//     }
//   };

//   // Handles the standard background auto-saving operations
//   const handleContentChange = (e) => {
//     const val = e.target.value;
//     setLocalContent(val);
//     autoResize(e.target);

//     if (!id || id === "undefined") return;
//     const safeBackendPayload = val === "" ? " " : val;
//     if (story?.blocks && story.blocks.length > 0) {
//       const activeBlockId = story.blocks[0].id;
//       saveBlock(activeBlockId, val);
//     } else {
//       debouncedInitialCreate(safeBackendPayload);
//     }
//   };

//   // Debounce wrapper to prevent multiple creations while typing into an empty canvas
//   const initialCreateTimeout = useRef(null);
//   const debouncedInitialCreate = (val) => {
//     if (initialCreateTimeout.current)
//       clearTimeout(initialCreateTimeout.current);
//     initialCreateTimeout.current = setTimeout(async () => {
//       if (creatingBlock.current || !val.trim()) return;
//       creatingBlock.current = true;
//       try {
//         setSavingStatus(true);
//         await addBlockService(id, "TEXT", val);
//         await queryClient.invalidateQueries({ queryKey: ["story", id] });
//       } catch (err) {
//         console.error("Failed to create initial block text segment", err);
//       } finally {
//         setSavingStatus(false);
//         creatingBlock.current = false;
//       }
//     }, 800);
//   };

//   // Trigger Local Computer File Search System Window
//   const triggerAudioUpload = () => {
//     if (fileInputRef.current) {
//       fileInputRef.current.click();
//     }
//   };

//   // Handles actual binary streaming data transfers from your computer and appends tag at cursor position
//   const handleAudioFileSelection = async (e) => {
//     const file = e.target.files?.[0];
//     if (!file || !id || !textareaRef.current) return;

//     try {
//       setSavingStatus(true);

//       // Upload file to get cloud URL from backend storage
//       const mediaUrl = await uploadAudioService(file);

//       if (mediaUrl) {
//         const el = textareaRef.current;
//         const cursorPosition = el.selectionStart;

//         // Split text content to place the audio tag exactly where the blinking cursor is
//         const textBeforeCursor = localContent.substring(0, cursorPosition);
//         const textAfterCursor = localContent.substring(cursorPosition);

//         // Append a cleaner layout token label tag with audio filename or generic display
//         const audioTokenTag = `\n[Audio: ${file.name || "Manuscript Track"}](${mediaUrl})\n`;
//         const updatedFullContent =
//           textBeforeCursor + audioTokenTag + textAfterCursor;

//         setLocalContent(updatedFullContent);

//         // Resize text field to comfortably fit the new block insertion height
//         setTimeout(() => autoResize(el), 10);

//         // Instantly sync variations down to your PostgreSQL DB block row layers
//         if (story?.blocks && story.blocks.length > 0) {
//           saveBlock(story.blocks[0].id, updatedFullContent);
//         } else {
//           await addBlockService(id, "TEXT", updatedFullContent);
//           await queryClient.invalidateQueries({ queryKey: ["story", id] });
//         }
//       }
//     } catch (err) {
//       console.error("Audio insertion processing fail:", err);
//     } finally {
//       setSavingStatus(false);
//       e.target.value = ""; // Reset file selector hook
//     }
//   };

//   // Custom regex layout transformer to map custom audio tokens to visible native dashboard HTML player nodes
//   const renderContentWithMedia = () => {
//     if (!localContent) return null;

//     const lines = localContent.split("\n");
//     return lines.map((line, i) => {
//       // Find audio markdown patterns: [Audio: custom_name.mp3](url)
//       const audioMatch = line.match(/^\[Audio:\s*(.*?)\]\((.*?)\)$/);

//       if (audioMatch) {
//         const audioName = audioMatch[1];
//         const audioUrl = audioMatch[2];
//         return (
//           <div
//             key={i}
//             className="w-full my-4 max-w-xl bg-[#202020] border border-[#2d2d2d] rounded-xl p-3 flex flex-col gap-2 shadow-xl select-none"
//           >
//             <div className="text-xs text-[#8a8a8a] font-mono flex items-center gap-1.5 truncate">
//               <span>🎵</span> {audioName}
//             </div>
//             <audio controls className="w-full h-8 accent-[#fff] mt-1">
//               <source src={audioUrl} type="audio/mpeg" />
//             </audio>
//           </div>
//         );
//       }

//       // If it's a standard dialogue line, just render it as native paragraph elements underneath
//       return (
//         <p
//           key={i}
//           className="text-[#dcdcdc] text-base font-light leading-relaxed tracking-wide min-h-[1.5rem]"
//         >
//           {line}
//         </p>
//       );
//     });
//   };

//   return (
//     <div className="h-screen w-full flex bg-[#191919] text-[#e8e8e8] font-sans antialiased overflow-hidden">
//       {/* HIDDEN SYSTEM INPUT FOR LOCAL FILES DISK CHANNEL SEARCH */}
//       <input
//         type="file"
//         ref={fileInputRef}
//         onChange={handleAudioFileSelection}
//         accept="audio/*"
//         className="hidden"
//       />

//       {/* SIDEBAR PANEL */}
//       <aside className="w-[260px] h-full bg-[#111111] flex flex-col border-r border-[#222222] select-none flex-shrink-0 relative">
//         <div className="p-4 flex items-center justify-between border-b border-[#1a1a1a]">
//           <div className="flex items-center gap-2 overflow-hidden w-full">
//             <div className="w-5 h-5 bg-[#2d2d2d] rounded text-gray-300 flex items-center justify-center font-bold text-xs flex-shrink-0">
//               {user?.email ? user.email.charAt(0).toUpperCase() : "U"}
//             </div>
//             <span className="font-medium text-xs truncate text-gray-400">
//               {user?.email || "guest@storybook.com"}
//             </span>
//           </div>
//         </div>

//         {/* STICKY AUDIO IMPORT BUTTON CONTAINER - EXACTLY IN THE RED BOX SPACE */}
//         {id && (
//           <div className="p-3 bg-[#111111] border-b border-[#1a1a1a] sticky top-0 z-30">
//             <button
//               onClick={triggerAudioUpload}
//               className="w-full bg-white hover:bg-gray-200 text-black text-xs font-semibold py-2 px-3 rounded-md shadow transition-all flex items-center justify-center gap-2"
//             >
//               <span>🔊</span> Import Audio
//             </button>
//           </div>
//         )}

//         <div className="flex-1 overflow-y-auto px-2 py-4 space-y-6">
//           <div>
//             <div className="px-2.5 mb-2 flex items-center justify-between text-xs font-bold text-[#555555] uppercase tracking-wider">
//               <span>Stories</span>
//               <button
//                 onClick={handleCreateNewStory}
//                 className="hover:text-white text-[#666] transition-colors p-0.5 rounded hover:bg-[#1c1c1c]"
//                 title="New story"
//               >
//                 <svg
//                   className="w-4 h-4"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2.5}
//                     d="M12 4v16m8-8H4"
//                   />
//                 </svg>
//               </button>
//             </div>

//             <div className="space-y-0.5">
//               {isLoadingList ? (
//                 <div className="px-2.5 py-1 text-xs text-[#333] animate-pulse">
//                   Loading list...
//                 </div>
//               ) : (
//                 stories?.map((item) => (
//                   <div
//                     key={item.id}
//                     className={`group flex items-center justify-between px-2.5 py-1.5 rounded-md text-sm transition-all ${
//                       item.id === id
//                         ? "bg-[#222222] text-white font-medium"
//                         : "text-[#8a8a8a] hover:text-[#e8e8e8] hover:bg-[#141414]"
//                     }`}
//                   >
//                     <Link
//                       to={`/stories/${item.id}`}
//                       className="flex items-center gap-2 truncate flex-1"
//                     >
//                       <svg
//                         className="w-3.5 h-3.5 text-[#555] flex-shrink-0"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                         />
//                       </svg>
//                       <span className="truncate">
//                         {item.title || "Untitled Story"}
//                       </span>
//                     </Link>
//                     <button
//                       onClick={(e) => {
//                         e.preventDefault();
//                         if (confirm("Delete permanently?"))
//                           deleteStory(item.id);
//                       }}
//                       className="opacity-0 group-hover:opacity-100 text-[#444] hover:text-red-400 p-0.5 transition-all"
//                     >
//                       <svg
//                         className="w-3.5 h-3.5"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
//                         />
//                       </svg>
//                     </button>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//         </div>
//       </aside>

//       {/* CANVAS MAIN WRITER SECTION */}
//       <main className="flex-1 h-full flex flex-col overflow-y-auto bg-[#191919]">
//         <div className="h-11 w-full flex items-center justify-end px-6 text-xs text-[#444] font-mono select-none">
//           {savingStatus ? (
//             <span className="text-emerald-500 flex items-center gap-1.5 animate-pulse">
//               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
//               Saving modification logs...
//             </span>
//           ) : (
//             id && <span>Synced to cloud</span>
//           )}
//         </div>

//         <div className="w-full max-w-2xl mx-auto px-16 pt-16 pb-32 space-y-8">
//           {id ? (
//             isLoadingStory ? (
//               <div className="py-24 text-center text-xs tracking-widest text-[#444] animate-pulse uppercase">
//                 Syncing workspace...
//               </div>
//             ) : (
//               <div className="space-y-6 flex flex-col">
//                 <input
//                   type="text"
//                   value={localTitle}
//                   onChange={handleTitleChange}
//                   placeholder="Untitled"
//                   className="w-full bg-transparent border-none text-white text-4xl font-bold tracking-tight outline-none placeholder-[#2a2a2a] focus:ring-0 p-0"
//                 />

//                 <div className="text-xs text-[#444] border-b border-[#222]/40 pb-6 select-none">
//                   <span className="w-24 inline-block uppercase tracking-wider">
//                     Created
//                   </span>
//                   <span className="text-[#777] font-mono">
//                     {story?.createdAt
//                       ? new Date(story.createdAt).toLocaleDateString()
//                       : "June 4, 2026"}
//                   </span>
//                 </div>

//                 {/* THE UNIFIED COMBINED FEED WORKSPACE BLOCK */}
//                 <div className="w-full flex flex-col space-y-6">
//                   {/* CLEAN SIMPLIFIED UNIFIED TEXTAREA FILE LAYER */}
//                   <textarea
//                     id="main-story-textarea"
//                     ref={textareaRef}
//                     value={localContent}
//                     placeholder="Start writing your story notes here..."
//                     onChange={handleContentChange}
//                     onBlur={() => {
//                       if (story?.blocks && story.blocks.length > 0) {
//                         saveBlock(story.blocks[0].id, localContent);
//                       }
//                     }}
//                     className="w-full bg-transparent border-none resize-none outline-none focus:ring-0 p-0 text-[#dcdcdc] text-base font-light leading-relaxed tracking-wide font-sans mb-4"
//                     rows={12}
//                   />

//                   {/* PARSED INTEGRATED PREVIEW MEDIA VIEW (Renders players beautifully below text fields) */}
//                   {localContent.includes("[Audio:") && (
//                     <div className="w-full border-t border-[#222]/50 pt-6 mt-4 space-y-2">
//                       <div className="text-[10px] uppercase tracking-wider text-gray-600 font-bold font-mono mb-2 select-none">
//                         Media Render Output
//                       </div>
//                       {renderContentWithMedia()}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )
//           ) : (
//             <div className="py-40 text-center max-w-xs mx-auto space-y-4 select-none">
//               <div className="text-2xl">📝</div>
//               <h3 className="text-white font-medium text-sm">
//                 Personal Workspace Dashboard
//               </h3>
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useStories, useStory } from "../hooks/useStories";
import { useAutoSave } from "../hooks/useAutoSave";
import useAuthStore from "../store/AuthStore";
import { addBlockService } from "../service/StoryService";
import { uploadAudioService } from "../service/UploadService";
import { useQueryClient } from "@tanstack/react-query";

export default function WorkspacePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    stories,
    createStory,
    deleteStory,
    isLoading: isLoadingList,
  } = useStories();
  const { story, isLoading: isLoadingStory } = useStory(id);
  const user = useAuthStore((state) => state.user);

  const [savingStatus, setSavingStatus] = useState(false);
  const { saveTitle, saveBlock } = useAutoSave(id, setSavingStatus);

  const [localTitle, setLocalTitle] = useState("");
  const creatingBlock = useRef(false);
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  // Sync title and decode content string tokens when switching story instances
  useEffect(() => {
    if (story && id === story.id) {
      setLocalTitle(story.title || "");

      if (story.blocks && story.blocks.length > 0) {
        const rawContent = story.blocks[0].content || "";
        if (editorRef.current) {
          editorRef.current.innerHTML = decodeMarkdownTokensToHtml(rawContent);
        }
      } else {
        if (editorRef.current) editorRef.current.innerHTML = "";
      }
    } else if (!id) {
      setLocalTitle("");
      if (editorRef.current) editorRef.current.innerHTML = "";
    }
  }, [story, id]);

  const handleCreateNewStory = () => {
    createStory("Untitled Story");
  };

  const handleTitleChange = (e) => {
    const val = e.target.value;
    setLocalTitle(val);
    if (id && id !== "undefined") {
      saveTitle(val);
    }
  };

  // Convert raw text strings stored in database into inline rich element nodes
  const decodeMarkdownTokensToHtml = (text) => {
    if (!text) return "";
    return text
      .split("\n")
      .map((line) => {
        const audioMatch = line.match(/^\[Audio:\s*(.*?)\]\((.*?)\)$/);
        if (audioMatch) {
          // RESTORED: Full audio player markup engine block template
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

  // Convert rich element node strings back into standard text layout structures before database transmission
  const encodeHtmlToMarkdownTokens = (html) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const lines = [];

    tempDiv.childNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.classList.contains("inline-audio-node")) {
          const name = node.getAttribute("data-audio-name");
          const url = node.getAttribute("data-audio-url");
          lines.push(`[Audio: ${name}](${url})`);
        } else {
          const text = node.innerText.replace(/\n/g, "");
          lines.push(text === "" ? " " : text);
        }
      } else if (
        node.nodeType === Node.TEXT_NODE &&
        node.textContent.trim() !== ""
      ) {
        lines.push(node.textContent.replace(/\n/g, ""));
      }
    });

    const parsedOutput = lines.join("\n");
    return parsedOutput === "" ? " " : parsedOutput;
  };

  // Fires debounced save operations immediately on key input
  const handleEditorInput = () => {
    if (!id || id === "undefined" || !editorRef.current) return;

    const currentHtmlValue = editorRef.current.innerHTML;
    const encodedMarkdownText = encodeHtmlToMarkdownTokens(currentHtmlValue);

    if (story?.blocks && story.blocks.length > 0) {
      saveBlock(story.blocks[0].id, encodedMarkdownText);
    } else {
      debouncedInitialCreate(encodedMarkdownText);
    }
  };

  const initialCreateTimeout = useRef(null);
  const debouncedInitialCreate = (val) => {
    if (initialCreateTimeout.current)
      clearTimeout(initialCreateTimeout.current);
    initialCreateTimeout.current = setTimeout(async () => {
      if (creatingBlock.current || !val.trim()) return;
      creatingBlock.current = true;
      try {
        setSavingStatus(true);
        await addBlockService(id, "TEXT", val);
        await queryClient.invalidateQueries({ queryKey: ["story", id] });
      } catch (err) {
        console.error("Initial creation layer crash:", err);
      } finally {
        setSavingStatus(false);
        creatingBlock.current = false;
      }
    }, 800);
  };

  const triggerAudioUpload = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  // Injects live media blocks cleanly at your current layout cursor caret selection position
  const handleAudioFileSelection = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !id || !editorRef.current) return;

    try {
      setSavingStatus(true);
      const mediaUrl = await uploadAudioService(file);

      if (mediaUrl) {
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

        // Dynamically build and style the visual layout player node container element
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

        // Add a clean spacing block node underneath the newly inserted element
        const trailingSpacingBlock = document.createElement("div");
        trailingSpacingBlock.innerHTML = "<br>";
        audioNodeWrapper.parentNode.insertBefore(
          trailingSpacingBlock,
          audioNodeWrapper.nextSibling,
        );

        // Reposition selection bounds focus safely
        range.setStartAfter(trailingSpacingBlock);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);

        // Fire synchronization logic loop to store changes in the database
        const updatedHtmlValue = editorRef.current.innerHTML;
        const encodedMarkdownText =
          encodeHtmlToMarkdownTokens(updatedHtmlValue);

        if (story?.blocks && story.blocks.length > 0) {
          saveBlock(story.blocks[0].id, encodedMarkdownText);
        } else {
          await addBlockService(id, "TEXT", encodedMarkdownText);
          await queryClient.invalidateQueries({ queryKey: ["story", id] });
        }
      }
    } catch (err) {
      console.error("Audio block injection failed:", err);
    } finally {
      setSavingStatus(false);
      e.target.value = "";
    }
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

      {/* SIDEBAR PANEL */}
      <aside className="w-[260px] h-full bg-[#111111] flex flex-col border-r border-[#222222] select-none flex-shrink-0 relative">
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

        {/* STICKY SIDEBAR IMPORT AUDIO BUTTON */}
        {id && (
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
                  className={`group flex items-center justify-between px-2.5 py-1.5 rounded-md text-sm transition-all ${item.id === id ? "bg-[#222222] text-white font-medium" : "text-[#8a8a8a] hover:text-[#e8e8e8] hover:bg-[#141414]"}`}
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
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (confirm("Delete permanently?")) deleteStory(item.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-[#444] hover:text-red-400 p-0.5 transition-all"
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
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* CANVAS CONTENT EDITOR VIEWER AREA */}
      <main className="flex-1 h-full flex flex-col overflow-y-auto bg-[#191919]">
        <div className="h-11 w-full flex items-center justify-end px-6 text-xs text-[#444] font-mono select-none flex-shrink-0">
          {savingStatus ? (
            <span className="text-emerald-500 flex items-center gap-1.5 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />{" "}
              Saving logs...
            </span>
          ) : (
            id && <span>Synced to cloud</span>
          )}
        </div>

        <div className="w-full max-w-4xl mx-auto px-16 pt-16 pb-32 space-y-6">
          {id ? (
            isLoadingStory ? (
              <div className="py-24 text-center text-xs tracking-widest text-[#444] animate-pulse uppercase">
                Syncing workspace...
              </div>
            ) : (
              <div className="space-y-6 flex flex-col">
                <input
                  type="text"
                  value={localTitle}
                  onChange={handleTitleChange}
                  placeholder="Untitled"
                  className="w-full bg-transparent border-none text-white text-4xl font-bold tracking-tight outline-none placeholder-[#2a2a2a] focus:ring-0 p-0"
                />

                <div className="text-xs text-[#444] border-b border-[#222]/40 pb-4 select-none">
                  <span className="w-24 inline-block uppercase tracking-wider">
                    Created
                  </span>
                  <span className="text-[#777] font-mono">
                    {story?.createdAt
                      ? new Date(story.createdAt).toLocaleDateString()
                      : "June 5, 2026"}
                  </span>
                </div>

                {/* THE UNIFIED INLINE RICH CONTENTEDITABLE CANVAS SURFACE */}
                <div
                  ref={editorRef}
                  contentEditable
                  onInput={handleEditorInput}
                  data-placeholder="Start writing dialogue lines here... Click Import Audio to embed tracks inline."
                  className="w-full min-h-[500px] bg-transparent outline-none text-[#dcdcdc] text-base font-light leading-loose tracking-wide font-sans focus:ring-0 carets-white relative before:content-[attr(data-placeholder)] before:text-[#3a3a3a] before:absolute before:inset-0 before:pointer-events-none empty:before:block before:hidden [&_div:empty]:min-h-[1.5rem]"
                />
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
    </div>
  );
}
