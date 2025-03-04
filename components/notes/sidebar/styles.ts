export const sidebarStyles = {
  wrapper: "w-64 h-screen border-r flex flex-col bg-background",
  header: "p-4 border-b",
  list: "flex-1 overflow-y-auto",
  item: {
    base: "group flex items-center justify-between p-2 rounded-md hover:bg-accent cursor-pointer",
    active: "bg-accent",
    title: "text-sm font-medium truncate",
    actions: "opacity-0 group-hover:opacity-100 transition-opacity"
  }
}; 