"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useAuthStore } from "@/stores/auth-store";
import api from "@/lib/api";
import { initEcho } from "@/lib/echo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Paperclip, Users, User as UserIcon, ArrowLeft, Search, Smile } from "lucide-react";

interface User {
  id: number;
  name: string;
  avatar_path?: string;
}

interface Message {
  id: number;
  conversation_id: number;
  sender_id: number;
  content: string | null;
  attachment_path: string | null;
  created_at: string;
  sender: User;
  media?: { file_type?: string };
}

interface Conversation {
  id: number;
  type: "group" | "dm";
  name: string | null;
  participants: { user: User }[];
  messages: Message[];
}

export function ChatInterface() {
  const { user, token } = useAuthStore();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");
  const [teamMembers, setTeamMembers] = useState<User[]>([]);
  const [activeSidebarTab, setActiveSidebarTab] = useState<"chats" | "contacts">("chats");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const echoRef = useRef<any>(null);

  useEffect(() => {
    if (user?.team_id && token) {
      fetchConversations();
      fetchTeamMembers();
      setupEcho();
    }
    return () => {
      if (echoRef.current) echoRef.current.disconnect();
    };
  }, [user, token]);

  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation.id);
      if (echoRef.current) {
        const ch = `private-conversation.${activeConversation.id}`;
        echoRef.current.private(ch)
          .listen('.message.sent', (e: { message: Message }) => {
            setMessages(prev => {
              if (prev.find(m => m.id === e.message.id)) return prev;
              return [...prev, e.message];
            });
            setTimeout(scrollToBottom, 100);
          });
        return () => { echoRef.current?.leave(ch); };
      }
    }
  }, [activeConversation?.id]);

  const setupEcho = () => {
    echoRef.current = initEcho(token as string);
  };

  const fetchConversations = async () => {
    try {
      const { data } = await api.get(`/teams/${user?.team_id}/conversations`);
      setConversations(data);
    } catch (error) {
      console.error("Gagal mengambil percakapan:", error);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const { data } = await api.get(`/teams/${user?.team_id}/members`);
      setTeamMembers(data.data || data);
    } catch (error) {
      console.error("Gagal mengambil anggota tim:", error);
    }
  };

  const fetchMessages = async (conversationId: number) => {
    try {
      const { data } = await api.get(`/conversations/${conversationId}/messages`);
      setMessages(data);
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error("Gagal mengambil pesan:", error);
    }
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!newMessage.trim() && !file) || !activeConversation || loading) return;
    setLoading(true);
    const formData = new FormData();
    if (newMessage.trim()) formData.append("content", newMessage);
    if (file) formData.append("file", file);
    try {
      const { data } = await api.post(`/conversations/${activeConversation.id}/messages`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessages(prev => [...prev, data]);
      setNewMessage("");
      setFile(null);
      setTimeout(scrollToBottom, 100);
      fetchConversations();
    } catch (error) {
      console.error("Gagal mengirim pesan:", error);
    } finally {
      setLoading(false);
    }
  };

  const selectConversation = useCallback((conv: Conversation) => {
    setActiveConversation(conv);
    setMobileView("chat");
    setTimeout(() => {
      inputRef.current?.focus();
      scrollToBottom();
    }, 100);
  }, []);

  const startDm = async (targetUserId: number) => {
    try {
      const { data } = await api.post(`/teams/${user?.team_id}/start-dm`, { target_user_id: targetUserId });
      setConversations(prev => {
        if (!prev.find(c => c.id === data.id)) return [data, ...prev];
        return prev;
      });
      selectConversation(data);
    } catch (error) {
      console.error("Gagal memulai DM:", error);
    }
  };

  const goBackToList = useCallback(() => {
    setMobileView("list");
    fetchConversations();
  }, []);

  const getOtherUser = (conv: Conversation) => {
    if (conv.type === "dm") {
      return conv.participants.find(p => p.user.id !== user?.id)?.user;
    }
    return null;
  };

  const getConversationName = (conv: Conversation) => {
    if (conv.type === "group") return conv.name || "Grup Tim";
    const otherUser = getOtherUser(conv);
    return otherUser?.name || "Pesan Langsung";
  };

  const getConversationAvatar = (conv: Conversation) => {
    if (conv.type === "dm") {
      const otherUser = getOtherUser(conv);
      if (otherUser?.avatar_path) {
        return (
          <Avatar className="h-12 w-12">
            <AvatarImage src={`${process.env.NEXT_PUBLIC_R2_URL}/${otherUser.avatar_path}`} />
            <AvatarFallback className="text-sm bg-green-500/10 text-green-600">
              {otherUser.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        );
      }
      return (
        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-500/20 to-green-600/10 flex items-center justify-center text-green-600 font-semibold">
          {otherUser?.name?.charAt(0) || "?"}
        </div>
      );
    }
    return (
      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-500/20 to-green-600/10 flex items-center justify-center text-green-600">
        <Users className="h-5 w-5" />
      </div>
    );
  };

  const getLastMessage = (conv: Conversation) => {
    if (conv.messages?.[0]) {
      return conv.messages[0].content || "Lampiran";
    }
    return "Belum ada pesan";
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) return "Hari ini";
    if (d.toDateString() === yesterday.toDateString()) return "Kemarin";
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const filteredConversations = conversations.filter(conv =>
    getConversationName(conv).toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group messages by date
  const groupedMessages = messages.reduce<{ date: string; messages: Message[] }[]>((groups, msg) => {
    const date = new Date(msg.created_at).toDateString();
    const lastGroup = groups[groups.length - 1];
    if (lastGroup && lastGroup.date === date) {
      lastGroup.messages.push(msg);
    } else {
      groups.push({ date, messages: [msg] });
    }
    return groups;
  }, []);

  return (
    <div className="flex h-[calc(100vh-8rem)] md:h-[calc(100vh-6rem)] border rounded-xl overflow-hidden bg-background shadow-sm">
      {/* ==================== SIDEBAR / DAFTAR PERCAKAPAN ==================== */}
      <div className={`
        w-full md:w-80 lg:w-96 border-r flex flex-col bg-background
        ${mobileView === "chat" ? "hidden md:flex" : "flex"}
      `}>
        {/* Header Sidebar */}
        <div className="p-4 border-b bg-background">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold">Tim Chat</h2>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span className="text-xs text-muted-foreground">Online</span>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex bg-muted/50 p-1 rounded-lg mb-3">
            <button 
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${activeSidebarTab === "chats" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              onClick={() => setActiveSidebarTab("chats")}
            >
              Percakapan
            </button>
            <button 
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${activeSidebarTab === "contacts" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              onClick={() => setActiveSidebarTab("contacts")}
            >
              Anggota Tim
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={activeSidebarTab === "chats" ? "Cari percakapan..." : "Cari anggota..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full bg-muted/50 pl-9 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500/30 transition-all"
            />
          </div>
        </div>

        {/* Daftar Percakapan / Kontak */}
        <ScrollArea className="flex-1">
          {activeSidebarTab === "chats" ? (
            filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                <Users className="h-8 w-8 mb-2 opacity-50" />
                <p className="text-sm">Belum ada percakapan</p>
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isActive = activeConversation?.id === conv.id && mobileView === "chat";
                return (
                  <div
                    key={conv.id}
                    onClick={() => selectConversation(conv)}
                    className={`
                      px-4 py-3 cursor-pointer transition-all duration-150 flex items-center gap-3 border-b border-border/30
                      hover:bg-muted/40 active:bg-muted/60
                      ${isActive ? "bg-green-500/5 border-l-2 border-l-green-500" : ""}
                    `}
                  >
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      {getConversationAvatar(conv)}
                      <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></div>
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm truncate">{getConversationName(conv)}</p>
                        <span className="text-[10px] text-muted-foreground flex-shrink-0 ml-2">
                          {conv.messages?.[0] ? formatTime(conv.messages[0].created_at) : ""}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {getLastMessage(conv)}
                      </p>
                    </div>
                  </div>
                );
              })
            )
          ) : (
            // Contacts List
            teamMembers
              .filter(m => m.id !== user?.id && m.name.toLowerCase().includes(searchQuery.toLowerCase()))
              .map(member => (
                <div 
                  key={member.id} 
                  onClick={() => startDm(member.id)} 
                  className="px-4 py-3 cursor-pointer transition-all duration-150 flex items-center gap-3 border-b border-border/30 hover:bg-muted/40"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={`${process.env.NEXT_PUBLIC_R2_URL}/${member.avatar_path}`} />
                    <AvatarFallback className="text-sm bg-green-500/10 text-green-600">{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{member.name}</p>
                    <p className="text-xs text-muted-foreground truncate">Mulai obrolan</p>
                  </div>
                </div>
            ))
          )}
        </ScrollArea>
      </div>

      {/* ==================== AREA CHAT ==================== */}
      <div className={`
        flex-1 flex flex-col bg-muted/5
        ${mobileView === "list" ? "hidden md:flex" : "flex"}
      `}>
        {activeConversation ? (
          <>
            {/* Header Chat */}
            <div className="px-4 py-3 border-b bg-background flex items-center gap-3 shadow-sm z-10">
              {/* Tombol Kembali (mobile) */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden h-9 w-9 rounded-full hover:bg-muted"
                onClick={goBackToList}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              {/* Avatar & Info */}
              {activeConversation.type === "dm" ? (
                (() => {
                  const other = getOtherUser(activeConversation);
                  return (
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        {other?.avatar_path ? (
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={`${process.env.NEXT_PUBLIC_R2_URL}/${other.avatar_path}`} />
                            <AvatarFallback className="text-sm bg-green-500/10 text-green-600">
                              {other.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500/20 to-green-600/10 flex items-center justify-center text-green-600 font-semibold">
                            {other?.name?.charAt(0) || "?"}
                          </div>
                        )}
                        <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{getConversationName(activeConversation)}</p>
                        <p className="text-xs text-green-600">Online</p>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500/20 to-green-600/10 flex items-center justify-center text-green-600">
                    <Users className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{getConversationName(activeConversation)}</p>
                    <p className="text-xs text-green-600">
                      {activeConversation.participants?.length || 0} anggota
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Pesan */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-4 py-4 space-y-1"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            >
              {groupedMessages.map((group, gi) => (
                <React.Fragment key={gi}>
                  {/* Label Tanggal */}
                  <div className="flex justify-center my-4">
                    <span className="px-3 py-1 rounded-full bg-background/80 backdrop-blur text-[10px] text-muted-foreground font-medium shadow-sm border border-border/30">
                      {formatDate(group.date)}
                    </span>
                  </div>
                  {/* Pesan */}
                  {group.messages.map((msg) => {
                    const isMe = msg.sender_id === user?.id;
                    const showAvatar = !isMe && (gi === 0 || group.messages.indexOf(msg) === 0 ||
                      group.messages[group.messages.indexOf(msg) - 1]?.sender_id !== msg.sender_id);
                    return (
                      <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"} mb-1`}>
                        <div className={`flex items-end gap-2 max-w-[85%] md:max-w-[65%] ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                          {/* Avatar */}
                          {!isMe && (
                            <div className="w-7 h-7 flex-shrink-0">
                              {showAvatar ? (
                                <Avatar className="h-7 w-7">
                                  <AvatarImage src={msg.sender.avatar_path ? `${process.env.NEXT_PUBLIC_R2_URL}/${msg.sender.avatar_path}` : undefined} />
                                  <AvatarFallback className="text-[10px] bg-green-500/10 text-green-600">
                                    {msg.sender.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                              ) : <div className="w-7" />}
                            </div>
                          )}
                          {/* Bubble */}
                          <div className={`
                            rounded-xl px-3 py-2 shadow-sm
                            ${isMe
                              ? "bg-green-500 text-white rounded-br-sm"
                              : "bg-background border border-border/50 rounded-bl-sm"
                            }
                          `}>
                            {!isMe && showAvatar && (
                              <p className="text-[10px] font-bold text-green-600 mb-0.5">{msg.sender.name}</p>
                            )}
                            {msg.content && (
                              <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.content}</p>
                            )}
                            {msg.attachment_path && (
                              <div className="mt-1.5">
                                {msg.media?.file_type?.startsWith('image/') ? (
                                  <img
                                    src={`${process.env.NEXT_PUBLIC_R2_URL}/${msg.attachment_path}`}
                                    alt="lampiran"
                                    className="max-w-full rounded-lg max-h-60 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                  />
                                ) : (
                                  <a
                                    href={`${process.env.NEXT_PUBLIC_R2_URL}/${msg.attachment_path}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={`flex items-center gap-2 text-xs underline ${isMe ? "text-white/80" : "text-green-600"}`}
                                  >
                                    <Paperclip className="h-3 w-3" />
                                    Unduh File
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        {/* Waktu */}
                        <span className={`text-[9px] mt-0.5 mx-10 ${isMe ? "text-muted-foreground" : "text-muted-foreground"}`}>
                          {formatTime(msg.created_at)}
                          {isMe && <span className="ml-1 text-green-500">✓✓</span>}
                        </span>
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>

            {/* Input Area */}
            <div className="px-4 py-3 border-t bg-background">
              {file && (
                <div className="mb-2 flex items-center gap-2 text-xs bg-green-500/10 text-green-700 p-2 rounded-lg w-max border border-green-500/20">
                  <Paperclip className="h-3.5 w-3.5" />
                  <span className="truncate max-w-[180px]">{file.name}</span>
                  <button onClick={() => setFile(null)} className="text-red-500 hover:text-red-700 ml-1 font-bold">&times;</button>
                </div>
              )}
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <input
                  type="file"
                  id="file-upload-chat"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full hover:bg-muted flex-shrink-0"
                  onClick={() => document.getElementById("file-upload-chat")?.click()}
                >
                  <Paperclip className="h-5 w-5 text-muted-foreground" />
                </Button>
                <div className="flex-1 relative">
                  <Input
                    ref={inputRef}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Ketik pesan..."
                    className="rounded-full bg-muted/50 border-0 py-5 px-4 pr-10 focus-visible:ring-2 focus-visible:ring-green-500/30"
                    disabled={loading}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full"
                  >
                    <Smile className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
                <Button
                  type="submit"
                  size="icon"
                  className="h-10 w-10 rounded-full bg-green-500 hover:bg-green-600 text-white flex-shrink-0 shadow-md shadow-green-500/20"
                  disabled={loading || (!newMessage.trim() && !file)}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          /* Kosong */
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground bg-muted/5">
            <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
              <Send className="h-8 w-8 text-green-500/50" />
            </div>
            <p className="text-lg font-semibold text-foreground/70">TeamVora Chat</p>
            <p className="text-sm mt-1">Pilih percakapan untuk mulai mengobrol</p>
          </div>
        )}
      </div>
    </div>
  );
}
