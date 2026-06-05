import { create } from "zustand";

export const useUIStore=create(
    (set)=>({
        isSideBarOpen:true,
        toggleSideBar:()=>set((state)=>({isSideBarOpen:!state.isSideBarOpen})),
        setSideBarOpen:(value)=>set({isSideBarOpen:value})
    })
)