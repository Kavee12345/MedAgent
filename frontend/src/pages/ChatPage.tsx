// // import { useState, useEffect, useRef } from 'react'
// // import { useParams, useNavigate } from 'react-router-dom'
// // import {
// //   Send, Plus, Trash2, AlertTriangle, AlertCircle, Info, CheckCircle,
// //   ChevronDown, Bot, User
// // } from 'lucide-react'
// // import { chatApi } from '../api/chat'
// // import type { Conversation, ConversationDetail, MedicalResponse, Message } from '../types'
// // import { format } from 'date-fns'
// // import clsx from 'clsx'
// // import ReactMarkdown from 'react-markdown'

// // const ESCALATION_CONFIG = {
// //   none: { color: 'bg-green-50 border-green-200 text-green-800', icon: CheckCircle, label: 'No concern' },
// //   mild: { color: 'bg-blue-50 border-blue-200 text-blue-800', icon: Info, label: 'Mild concern' },
// //   urgent: { color: 'bg-orange-50 border-orange-200 text-orange-800', icon: AlertCircle, label: 'See a doctor soon' },
// //   emergency: { color: 'bg-red-50 border-red-200 text-red-800', icon: AlertTriangle, label: 'SEEK EMERGENCY CARE' },
// // }

// // export default function ChatPage() {
// //   const { conversationId } = useParams<{ conversationId: string }>()
// //   const navigate = useNavigate()
// //   const [conversations, setConversations] = useState<Conversation[]>([])
// //   const [activeConv, setActiveConv] = useState<ConversationDetail | null>(null)
// //   const [input, setInput] = useState('')
// //   const [streaming, setStreaming] = useState(false)
// //   const [streamingText, setStreamingText] = useState('')
// //   const [finalResponse, setFinalResponse] = useState<MedicalResponse | null>(null)
// //   const messagesEndRef = useRef<HTMLDivElement>(null)
// //   const textareaRef = useRef<HTMLTextAreaElement>(null)

// //   useEffect(() => {
// //     loadConversations()
// //   }, [])

// //   useEffect(() => {
// //     if (conversationId) loadConversation(conversationId)
// //   }, [conversationId])

// //   useEffect(() => {
// //     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
// //   }, [activeConv?.messages, streamingText])

// //   const loadConversations = async () => {
// //     const { data } = await chatApi.listConversations()
// //     setConversations(data.items)
// //   }

// //   const loadConversation = async (id: string) => {
// //     const { data } = await chatApi.getConversation(id)
// //     setActiveConv(data)
// //   }

// //   const newConversation = async () => {
// //     const { data } = await chatApi.createConversation()
// //     setConversations((prev) => [data, ...prev])
// //     navigate(`/chat/${data.id}`)
// //   }

// //   const deleteConversation = async (id: string, e: React.MouseEvent) => {
// //     e.preventDefault()
// //     e.stopPropagation()
// //     await chatApi.deleteConversation(id)
// //     setConversations((prev) => prev.filter((c) => c.id !== id))
// //     if (conversationId === id) {
// //       setActiveConv(null)
// //       navigate('/chat')
// //     }
// //   }

// //   const sendMessage = async () => {
// //     if (!input.trim() || streaming || !conversationId) return

// //     const msg = input.trim()
// //     setInput('')
// //     setStreaming(true)
// //     setStreamingText('')
// //     setFinalResponse(null)

// //     // Optimistically add user message
// //     const userMsg: Message = {
// //       id: Date.now().toString(),
// //       role: 'user',
// //       content: msg,
// //       escalation_level: null,
// //       confidence_score: null,
// //       recommendations: null,
// //       follow_up_questions: null,
// //       disclaimer: null,
// //       created_at: new Date().toISOString(),
// //     }
// //     setActiveConv((prev) => prev ? { ...prev, messages: [...prev.messages, userMsg] } : prev)

// //     await chatApi.sendMessage(
// //       conversationId,
// //       msg,
// //       (chunk) => setStreamingText((prev) => prev + chunk),
// //       (data) => {
// //         setFinalResponse(data as unknown as MedicalResponse)
// //         setStreaming(false)
// //         setStreamingText('')
// //         loadConversation(conversationId)
// //         loadConversations()
// //       },
// //       (err) => {
// //         console.error(err)
// //         setStreaming(false)
// //         setStreamingText('')
// //       }
// //     )
// //   }

// //   const handleKeyDown = (e: React.KeyboardEvent) => {
// //     if (e.key === 'Enter' && !e.shiftKey) {
// //       e.preventDefault()
// //       sendMessage()
// //     }
// //   }

// //   return (
// //     <div className="flex h-full">
// //       {/* Conversation list */}
// //       <aside className="w-60 border-r border-gray-200 bg-white flex flex-col">
// //         <div className="p-3 border-b border-gray-200">
// //           <button onClick={newConversation} className="btn-primary w-full flex items-center justify-center gap-2 text-sm py-2">
// //             <Plus className="w-4 h-4" /> New chat
// //           </button>
// //         </div>
// //         <div className="flex-1 overflow-y-auto p-2 space-y-1">
// //           {conversations.map((conv) => (
// //             <div
// //               key={conv.id}
// //               onClick={() => navigate(`/chat/${conv.id}`)}
// //               className={clsx(
// //                 'group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors',
// //                 conv.id === conversationId
// //                   ? 'bg-primary-50 text-primary-700'
// //                   : 'hover:bg-gray-100 text-gray-700'
// //               )}
// //             >
// //               <span className="truncate flex-1">{conv.title || 'New conversation'}</span>
// //               <button
// //                 onClick={(e) => deleteConversation(conv.id, e)}
// //                 className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-red-500 transition-all"
// //               >
// //                 <Trash2 className="w-3 h-3" />
// //               </button>
// //             </div>
// //           ))}
// //         </div>
// //       </aside>

// //       {/* Chat area */}
// //       <div className="flex-1 flex flex-col">
// //         {!conversationId ? (
// //           <EmptyState onNew={newConversation} />
// //         ) : (
// //           <>
// //             {/* Messages */}
// //             <div className="flex-1 overflow-y-auto p-6 space-y-6">
// //               {activeConv?.messages.map((msg) => (
// //                 <MessageBubble key={msg.id} message={msg} />
// //               ))}

// //               {/* Streaming indicator */}
// //               {streaming && (
// //                 <div className="flex gap-3">
// //                   <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
// //                     <Bot className="w-4 h-4 text-primary-600" />
// //                   </div>
// //                   <div className="flex-1 bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 max-w-2xl">
// //                     {streamingText ? (
// //                       <p className="text-sm text-gray-800 whitespace-pre-wrap">{streamingText}</p>
// //                     ) : (
// //                       <div className="flex gap-1 py-1">
// //                         {[0, 1, 2].map((i) => (
// //                           <div key={i} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
// //                         ))}
// //                       </div>
// //                     )}
// //                   </div>
// //                 </div>
// //               )}
// //               <div ref={messagesEndRef} />
// //             </div>

// //             {/* Input */}
// //             <div className="border-t border-gray-200 bg-white p-4">
// //               <div className="max-w-3xl mx-auto">
// //                 <div className="flex gap-3 items-end">
// //                   <textarea
// //                     ref={textareaRef}
// //                     className="input flex-1 resize-none min-h-[44px] max-h-32"
// //                     placeholder="Describe your symptoms, ask about lab results, medications..."
// //                     value={input}
// //                     onChange={(e) => setInput(e.target.value)}
// //                     onKeyDown={handleKeyDown}
// //                     rows={1}
// //                     disabled={streaming}
// //                   />
// //                   <button
// //                     onClick={sendMessage}
// //                     className="btn-primary px-4 py-2.5 flex items-center gap-2"
// //                     disabled={!input.trim() || streaming}
// //                   >
// //                     <Send className="w-4 h-4" />
// //                   </button>
// //                 </div>
// //                 <p className="text-xs text-gray-400 mt-2 text-center">
// //                   For emergencies, call 911. MedAgent is not a substitute for professional medical care.
// //                 </p>
// //               </div>
// //             </div>
// //           </>
// //         )}
// //       </div>
// //     </div>
// //   )
// // }

// // function MessageBubble({ message }: { message: Message }) {
// //   const isUser = message.role === 'user'
// //   const [showDetails, setShowDetails] = useState(false)
// //   const escalation = message.escalation_level
// //   const cfg = escalation ? ESCALATION_CONFIG[escalation] : null

// //   return (
// //     <div className={clsx('flex gap-3', isUser && 'flex-row-reverse')}>
// //       {/* Avatar */}
// //       <div className={clsx(
// //         'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
// //         isUser ? 'bg-primary-600' : 'bg-primary-100'
// //       )}>
// //         {isUser
// //           ? <User className="w-4 h-4 text-white" />
// //           : <Bot className="w-4 h-4 text-primary-600" />
// //         }
// //       </div>

// //       <div className={clsx('flex flex-col gap-2 max-w-2xl', isUser && 'items-end')}>
// //         {/* Main bubble */}
// //         <div className={clsx(
// //           'px-4 py-3 rounded-2xl',
// //           isUser
// //             ? 'bg-primary-600 text-white rounded-tr-sm'
// //             : 'bg-white border border-gray-200 rounded-tl-sm text-gray-800'
// //         )}>
// //           <div className={clsx('text-sm prose prose-sm max-w-none', isUser && 'prose-invert')}>
// //             <ReactMarkdown>{message.content}</ReactMarkdown>
// //           </div>
// //         </div>

// //         {/* Escalation banner */}
// //         {!isUser && escalation && escalation !== 'none' && cfg && (
// //           <div className={clsx('flex items-center gap-2 px-3 py-2 rounded-lg border text-sm', cfg.color)}>
// //             <cfg.icon className="w-4 h-4 flex-shrink-0" />
// //             <span className="font-medium">{cfg.label}</span>
// //           </div>
// //         )}

// //         {/* Details toggle */}
// //         {!isUser && (message.recommendations?.length || message.disclaimer) && (
// //           <button
// //             onClick={() => setShowDetails(!showDetails)}
// //             className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
// //           >
// //             Details
// //             <ChevronDown className={clsx('w-3 h-3 transition-transform', showDetails && 'rotate-180')} />
// //           </button>
// //         )}

// //         {!isUser && showDetails && (
// //           <div className="card p-3 text-sm space-y-2 w-full">
// //             {message.recommendations && message.recommendations.length > 0 && (
// //               <div>
// //                 <p className="font-medium text-gray-700 mb-1">Recommendations</p>
// //                 <ul className="space-y-1">
// //                   {message.recommendations.map((r, i) => (
// //                     <li key={i} className="flex items-start gap-2 text-gray-600">
// //                       <span className="text-primary-500 mt-0.5">•</span> {r}
// //                     </li>
// //                   ))}
// //                 </ul>
// //               </div>
// //             )}
// //             {message.confidence_score && (
// //               <p className="text-gray-500 text-xs">
// //                 Confidence: {Math.round(message.confidence_score * 100)}%
// //               </p>
// //             )}
// //             {message.disclaimer && (
// //               <p className="text-gray-400 text-xs italic border-t border-gray-100 pt-2">
// //                 {message.disclaimer}
// //               </p>
// //             )}
// //           </div>
// //         )}

// //         <p className="text-xs text-gray-400 px-1">
// //           {format(new Date(message.created_at), 'HH:mm')}
// //         </p>
// //       </div>
// //     </div>
// //   )
// // }

// // function EmptyState({ onNew }: { onNew: () => void }) {
// //   const suggestions = [
// //     'My blood pressure has been high lately, what does it mean?',
// //     'Explain my HbA1c result of 6.8%',
// //     'Is it safe to take ibuprofen with my current medications?',
// //     'I have a headache and mild fever for 2 days. Should I see a doctor?',
// //   ]
// //   return (
// //     <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
// //       <Bot className="w-12 h-12 text-primary-300 mb-4" />
// //       <h2 className="text-xl font-semibold text-gray-900 mb-2">Your personal health AI</h2>
// //       <p className="text-gray-500 mb-8 max-w-md">
// //         Ask about your symptoms, understand lab results, track medications, and get guidance on when to see a doctor.
// //       </p>
// //       <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl w-full mb-6">
// //         {suggestions.map((s) => (
// //           <button
// //             key={s}
// //             onClick={onNew}
// //             className="text-left text-sm bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-primary-300 hover:bg-primary-50 transition-colors text-gray-700"
// //           >
// //             {s}
// //           </button>
// //         ))}
// //       </div>
// //       <button onClick={onNew} className="btn-primary">Start chatting</button>
// //     </div>
// //   )
// // }
// import { useState, useEffect, useRef } from 'react'
// import { useParams, useNavigate } from 'react-router-dom'
// import {
//   Send, Plus, Trash2, AlertTriangle, AlertCircle, Info, CheckCircle,
//   ChevronDown, Bot, User
// } from 'lucide-react'
// import { chatApi } from '../api/chat'
// import type { Conversation, ConversationDetail, MedicalResponse, Message } from '../types'
// import { format } from 'date-fns'
// import clsx from 'clsx'
// import ReactMarkdown from 'react-markdown'

// const ESCALATION_CONFIG = {
//   none: { color: 'bg-green-50 border-green-200 text-green-800', icon: CheckCircle, label: 'No concern' },
//   mild: { color: 'bg-blue-50 border-blue-200 text-blue-800', icon: Info, label: 'Mild concern' },
//   urgent: { color: 'bg-orange-50 border-orange-200 text-orange-800', icon: AlertCircle, label: 'See a doctor soon' },
//   emergency: { color: 'bg-red-50 border-red-200 text-red-800', icon: AlertTriangle, label: 'SEEK EMERGENCY CARE' },
// }

// export default function ChatPage() {
//   const { conversationId } = useParams<{ conversationId: string }>()
//   const navigate = useNavigate()
//   const [conversations, setConversations] = useState<Conversation[]>([])
//   const [activeConv, setActiveConv] = useState<ConversationDetail | null>(null)
//   const [input, setInput] = useState('')
//   const [streaming, setStreaming] = useState(false)
//   const [streamingText, setStreamingText] = useState('')
//   const [finalResponse, setFinalResponse] = useState<MedicalResponse | null>(null)
//   const messagesEndRef = useRef<HTMLDivElement>(null)
//   const textareaRef = useRef<HTMLTextAreaElement>(null)

//   useEffect(() => {
//     loadConversations()
//   }, [])

//   useEffect(() => {
//     if (conversationId) loadConversation(conversationId)
//   }, [conversationId])

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
//   }, [activeConv?.messages, streamingText])

//   const loadConversations = async () => {
//     const { data } = await chatApi.listConversations()
//     setConversations(data.items)
//   }

//   const loadConversation = async (id: string) => {
//     const { data } = await chatApi.getConversation(id)
//     setActiveConv(data)
//   }

//   const newConversation = async () => {
//     const { data } = await chatApi.createConversation()
//     setConversations((prev) => [data, ...prev])
//     navigate(`/chat/${data.id}`)
//   }

//   const deleteConversation = async (id: string, e: React.MouseEvent) => {
//     e.preventDefault()
//     e.stopPropagation()
//     await chatApi.deleteConversation(id)
//     setConversations((prev) => prev.filter((c) => c.id !== id))
//     if (conversationId === id) {
//       setActiveConv(null)
//       navigate('/chat')
//     }
//   }

//   // Accepts an optional override for when a user clicks a follow-up chip
//   const sendMessage = async (overrideMessage?: string) => {
//     const msgText = overrideMessage || input.trim()
//     if (!msgText || streaming || !conversationId) return

//     setInput('')
//     setStreaming(true)
//     setStreamingText('')
//     setFinalResponse(null)

//     // Optimistically add user message
//     const userMsg: Message = {
//       id: Date.now().toString(),
//       role: 'user',
//       content: msgText,
//       escalation_level: null,
//       confidence_score: null,
//       recommendations: null,
//       follow_up_questions: null,
//       disclaimer: null,
//       created_at: new Date().toISOString(),
//     }
//     setActiveConv((prev) => prev ? { ...prev, messages: [...prev.messages, userMsg] } : prev)

//     await chatApi.sendMessage(
//       conversationId,
//       msgText,
//       (chunk) => setStreamingText((prev) => prev + chunk),
//       (data) => {
//         setFinalResponse(data as unknown as MedicalResponse)
//         setStreaming(false)
//         setStreamingText('')
//         loadConversation(conversationId)
//         loadConversations()
//       },
//       (err) => {
//         console.error(err)
//         setStreaming(false)
//         setStreamingText('')
//       }
//     )
//   }

//   const handleKeyDown = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault()
//       sendMessage()
//     }
//   }

//   return (
//     <div className="flex h-full">
//       {/* Conversation list */}
//       <aside className="w-60 border-r border-gray-200 bg-white flex flex-col">
//         <div className="p-3 border-b border-gray-200">
//           <button onClick={newConversation} className="btn-primary w-full flex items-center justify-center gap-2 text-sm py-2">
//             <Plus className="w-4 h-4" /> New chat
//           </button>
//         </div>
//         <div className="flex-1 overflow-y-auto p-2 space-y-1">
//           {conversations.map((conv) => (
//             <div
//               key={conv.id}
//               onClick={() => navigate(`/chat/${conv.id}`)}
//               className={clsx(
//                 'group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors',
//                 conv.id === conversationId
//                   ? 'bg-primary-50 text-primary-700'
//                   : 'hover:bg-gray-100 text-gray-700'
//               )}
//             >
//               <span className="truncate flex-1">{conv.title || 'New conversation'}</span>
//               <button
//                 onClick={(e) => deleteConversation(conv.id, e)}
//                 className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-red-500 transition-all"
//               >
//                 <Trash2 className="w-3 h-3" />
//               </button>
//             </div>
//           ))}
//         </div>
//       </aside>

//       {/* Chat area */}
//       <div className="flex-1 flex flex-col">
//         {!conversationId ? (
//           <EmptyState onNew={newConversation} />
//         ) : (
//           <>
//             {/* Messages */}
//             <div className="flex-1 overflow-y-auto p-6 space-y-6">
//               {activeConv?.messages.map((msg) => (
//                 <MessageBubble 
//                   key={msg.id} 
//                   message={msg} 
//                   onFollowUpClick={(q) => sendMessage(q)} 
//                 />
//               ))}

//               {/* Streaming indicator */}
//               {streaming && (
//                 <div className="flex gap-3">
//                   <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
//                     <Bot className="w-4 h-4 text-primary-600" />
//                   </div>
//                   <div className="flex-1 bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 max-w-2xl">
//                     {streamingText ? (
//                       <p className="text-sm text-gray-800 whitespace-pre-wrap">{streamingText}</p>
//                     ) : (
//                       <div className="flex gap-1 py-1">
//                         {[0, 1, 2].map((i) => (
//                           <div key={i} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}
//               <div ref={messagesEndRef} />
//             </div>

//             {/* Input */}
//             <div className="border-t border-gray-200 bg-white p-4">
//               <div className="max-w-3xl mx-auto">
//                 <div className="flex gap-3 items-end">
//                   <textarea
//                     ref={textareaRef}
//                     className="input flex-1 resize-none min-h-[44px] max-h-32 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     placeholder="Describe your symptoms, ask about lab results, medications..."
//                     value={input}
//                     onChange={(e) => setInput(e.target.value)}
//                     onKeyDown={handleKeyDown}
//                     rows={1}
//                     disabled={streaming}
//                   />
//                   <button
//                     onClick={() => sendMessage()}
//                     className="btn-primary px-4 py-2.5 flex items-center justify-center gap-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50"
//                     disabled={!input.trim() || streaming}
//                   >
//                     <Send className="w-5 h-5" />
//                   </button>
//                 </div>
//                 <p className="text-xs text-gray-400 mt-2 text-center">
//                   For emergencies, call 911. MedAgent is not a substitute for professional medical care.
//                 </p>
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   )
// }

// function MessageBubble({ 
//   message, 
//   onFollowUpClick 
// }: { 
//   message: Message, 
//   onFollowUpClick?: (q: string) => void 
// }) {
//   const isUser = message.role === 'user'
//   const [showDetails, setShowDetails] = useState(false)
//   const escalation = message.escalation_level
//   const cfg = escalation ? ESCALATION_CONFIG[escalation as keyof typeof ESCALATION_CONFIG] : null

//   return (
//     <div className={clsx('flex gap-3', isUser && 'flex-row-reverse')}>
//       {/* Avatar */}
//       <div className={clsx(
//         'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
//         isUser ? 'bg-primary-600' : 'bg-primary-100'
//       )}>
//         {isUser
//           ? <User className="w-4 h-4 text-white" />
//           : <Bot className="w-4 h-4 text-primary-600" />
//         }
//       </div>

//       <div className={clsx('flex flex-col gap-2 max-w-2xl', isUser && 'items-end')}>
//         {/* Main bubble */}
//         <div className={clsx(
//           'px-4 py-3 rounded-2xl shadow-sm',
//           isUser
//             ? 'bg-primary-600 text-white rounded-tr-sm'
//             : 'bg-white border border-gray-200 rounded-tl-sm text-gray-800'
//         )}>
//           <div className={clsx('text-sm prose prose-sm max-w-none', isUser && 'prose-invert')}>
//             <ReactMarkdown>{message.content}</ReactMarkdown>
//           </div>
//         </div>

//         {/* Escalation banner */}
//         {!isUser && escalation && escalation !== 'none' && cfg && (
//           <div className={clsx('flex items-center gap-2 px-3 py-2 rounded-lg border text-sm mt-1', cfg.color)}>
//             <cfg.icon className="w-4 h-4 flex-shrink-0" />
//             <span className="font-medium">{cfg.label}</span>
//           </div>
//         )}

//         {/* Follow-up Questions (Quick Replies) */}
//         {!isUser && message.follow_up_questions && message.follow_up_questions.length > 0 && (
//           <div className="flex flex-wrap gap-2 mt-1">
//             {message.follow_up_questions.map((q, i) => (
//               <button
//                 key={i}
//                 onClick={() => onFollowUpClick?.(q)}
//                 className="text-xs font-medium bg-white text-primary-600 border border-primary-200 rounded-full px-4 py-2 hover:bg-primary-50 transition-colors shadow-sm text-left leading-tight"
//               >
//                 {q}
//               </button>
//             ))}
//           </div>
//         )}

//         {/* Details toggle */}
//         {!isUser && (message.recommendations?.length || message.disclaimer) && (
//           <button
//             onClick={() => setShowDetails(!showDetails)}
//             className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 mt-1"
//           >
//             Details
//             <ChevronDown className={clsx('w-3 h-3 transition-transform', showDetails && 'rotate-180')} />
//           </button>
//         )}

//         {/* Expanded Details Section */}
//         {!isUser && showDetails && (
//           <div className="bg-white border border-gray-100 shadow-sm rounded-lg p-3 text-sm space-y-2 w-full mt-1">
//             {message.recommendations && message.recommendations.length > 0 && (
//               <div>
//                 <p className="font-medium text-gray-700 mb-1">Recommendations</p>
//                 <ul className="space-y-1">
//                   {message.recommendations.map((r, i) => (
//                     <li key={i} className="flex items-start gap-2 text-gray-600">
//                       <span className="text-primary-500 mt-0.5">•</span> {r}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//             {message.confidence_score && (
//               <p className="text-gray-500 text-xs mt-2">
//                 Confidence: {Math.round(message.confidence_score * 100)}%
//               </p>
//             )}
//             {message.disclaimer && (
//               <p className="text-gray-400 text-xs italic border-t border-gray-100 pt-2 mt-2">
//                 {message.disclaimer}
//               </p>
//             )}
//           </div>
//         )}

//         <p className="text-xs text-gray-400 px-1 mt-0.5">
//           {format(new Date(message.created_at), 'HH:mm')}
//         </p>
//       </div>
//     </div>
//   )
// }

// function EmptyState({ onNew }: { onNew: () => void }) {
//   const suggestions = [
//     'My blood pressure has been high lately, what does it mean?',
//     'Explain my HbA1c result of 6.8%',
//     'Is it safe to take ibuprofen with my current medications?',
//     'I have a headache and mild fever for 2 days. Should I see a doctor?',
//   ]
//   return (
//     <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
//       <Bot className="w-12 h-12 text-primary-300 mb-4" />
//       <h2 className="text-xl font-semibold text-gray-900 mb-2">Your personal health AI</h2>
//       <p className="text-gray-500 mb-8 max-w-md">
//         Ask about your symptoms, understand lab results, track medications, and get guidance on when to see a doctor.
//       </p>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl w-full mb-6">
//         {suggestions.map((s) => (
//           <button
//             key={s}
//             onClick={onNew}
//             className="text-left text-sm bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-primary-300 hover:bg-primary-50 transition-colors text-gray-700 shadow-sm"
//           >
//             {s}
//           </button>
//         ))}
//       </div>
//       <button onClick={onNew} className="btn-primary px-6 py-2 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors shadow-sm">
//         Start chatting
//       </button>
//     </div>
//   )
// }
// import { useState, useEffect, useRef } from 'react'
// import { useParams, useNavigate } from 'react-router-dom'
// import {
//   Send, Plus, Trash2, AlertTriangle, AlertCircle, Info, CheckCircle,
//   ChevronDown, Bot, User, Mic, MicOff, Volume2, Square
// } from 'lucide-react'
// import { chatApi } from '../api/chat'
// import type { Conversation, ConversationDetail, MedicalResponse, Message } from '../types'
// import { format } from 'date-fns'
// import clsx from 'clsx'
// import ReactMarkdown from 'react-markdown'

// declare global {
//   interface Window {
//     SpeechRecognition: any;
//     webkitSpeechRecognition: any;
//   }
// }

// const ESCALATION_CONFIG = {
//   none: { color: 'bg-green-50 border-green-200 text-green-800', icon: CheckCircle, label: 'No concern' },
//   mild: { color: 'bg-blue-50 border-blue-200 text-blue-800', icon: Info, label: 'Mild concern' },
//   urgent: { color: 'bg-orange-50 border-orange-200 text-orange-800', icon: AlertCircle, label: 'See a doctor soon' },
//   emergency: { color: 'bg-red-50 border-red-200 text-red-800', icon: AlertTriangle, label: 'SEEK EMERGENCY CARE' },
// }

// export default function ChatPage() {
//   const { conversationId } = useParams<{ conversationId: string }>()
//   const navigate = useNavigate()
//   const [conversations, setConversations] = useState<Conversation[]>([])
//   const [activeConv, setActiveConv] = useState<ConversationDetail | null>(null)
//   const [input, setInput] = useState('')
//   const [streaming, setStreaming] = useState(false)
//   const [streamingText, setStreamingText] = useState('')
//   const [finalResponse, setFinalResponse] = useState<MedicalResponse | null>(null)
  
//   // Voice State
//   const [isListening, setIsListening] = useState(false)
//   const recognitionRef = useRef<any>(null)

//   const messagesEndRef = useRef<HTMLDivElement>(null)
//   const textareaRef = useRef<HTMLTextAreaElement>(null)

//   useEffect(() => {
//     loadConversations()
//   }, [])

//   useEffect(() => {
//     if (conversationId) loadConversation(conversationId)
//   }, [conversationId])

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
//   }, [activeConv?.messages, streamingText])

//   // Initialize Speech Recognition
//   useEffect(() => {
//     // Check for browser support
//     const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
//     if (SpeechRecognition) {
//       recognitionRef.current = new SpeechRecognition()
//       recognitionRef.current.continuous = true
//       recognitionRef.current.interimResults = true
//       recognitionRef.current.lang = 'en-US' // Can be changed based on user preference

//       recognitionRef.current.onresult = (event: any) => {
//         let finalTranscript = ''
//         for (let i = event.resultIndex; i < event.results.length; ++i) {
//           if (event.results[i].isFinal) {
//             finalTranscript += event.results[i][0].transcript
//           }
//         }
//         if (finalTranscript) {
//           setInput((prev) => prev + (prev ? ' ' : '') + finalTranscript)
//         }
//       }

//       recognitionRef.current.onerror = (event: any) => {
//         console.error("Speech recognition error", event.error)
//         setIsListening(false)
//       }

//       recognitionRef.current.onend = () => {
//         setIsListening(false)
//       }
//     }
//   }, [])

//   const toggleListening = () => {
//     if (isListening) {
//       recognitionRef.current?.stop()
//       setIsListening(false)
//     } else {
//       try {
//         recognitionRef.current?.start()
//         setIsListening(true)
//       } catch (e) {
//         console.error("Microphone access denied or error:", e)
//       }
//     }
//   }

//   const loadConversations = async () => {
//     const { data } = await chatApi.listConversations()
//     setConversations(data.items)
//   }

//   const loadConversation = async (id: string) => {
//     const { data } = await chatApi.getConversation(id)
//     setActiveConv(data)
//   }

//   const newConversation = async () => {
//     const { data } = await chatApi.createConversation()
//     setConversations((prev) => [data, ...prev])
//     navigate(`/chat/${data.id}`)
//   }

//   const deleteConversation = async (id: string, e: React.MouseEvent) => {
//     e.preventDefault()
//     e.stopPropagation()
//     await chatApi.deleteConversation(id)
//     setConversations((prev) => prev.filter((c) => c.id !== id))
//     if (conversationId === id) {
//       setActiveConv(null)
//       navigate('/chat')
//     }
//   }

//   const sendMessage = async (overrideMessage?: string) => {
//     const msgText = overrideMessage || input.trim()
//     if (!msgText || streaming || !conversationId) return

//     // Stop listening if user hits send while mic is open
//     if (isListening) {
//       recognitionRef.current?.stop()
//       setIsListening(false)
//     }

//     setInput('')
//     setStreaming(true)
//     setStreamingText('')
//     setFinalResponse(null)

//     const userMsg: Message = {
//       id: Date.now().toString(),
//       role: 'user',
//       content: msgText,
//       escalation_level: null,
//       confidence_score: null,
//       recommendations: null,
//       follow_up_questions: null,
//       disclaimer: null,
//       created_at: new Date().toISOString(),
//     }
//     setActiveConv((prev) => prev ? { ...prev, messages: [...prev.messages, userMsg] } : prev)

//     await chatApi.sendMessage(
//       conversationId,
//       msgText,
//       (chunk) => setStreamingText((prev) => prev + chunk),
//       (data) => {
//         setFinalResponse(data as unknown as MedicalResponse)
//         setStreaming(false)
//         setStreamingText('')
//         loadConversation(conversationId)
//         loadConversations()
//       },
//       (err) => {
//         console.error(err)
//         setStreaming(false)
//         setStreamingText('')
//       }
//     )
//   }

//   const handleKeyDown = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault()
//       sendMessage()
//     }
//   }

//   return (
//     <div className="flex h-full">
//       {/* Conversation list */}
//       <aside className="w-60 border-r border-gray-200 bg-white flex flex-col">
//         <div className="p-3 border-b border-gray-200">
//           <button onClick={newConversation} className="btn-primary w-full flex items-center justify-center gap-2 text-sm py-2">
//             <Plus className="w-4 h-4" /> New chat
//           </button>
//         </div>
//         <div className="flex-1 overflow-y-auto p-2 space-y-1">
//           {conversations.map((conv) => (
//             <div
//               key={conv.id}
//               onClick={() => navigate(`/chat/${conv.id}`)}
//               className={clsx(
//                 'group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors',
//                 conv.id === conversationId
//                   ? 'bg-primary-50 text-primary-700'
//                   : 'hover:bg-gray-100 text-gray-700'
//               )}
//             >
//               <span className="truncate flex-1">{conv.title || 'New conversation'}</span>
//               <button
//                 onClick={(e) => deleteConversation(conv.id, e)}
//                 className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-red-500 transition-all"
//               >
//                 <Trash2 className="w-3 h-3" />
//               </button>
//             </div>
//           ))}
//         </div>
//       </aside>

//       {/* Chat area */}
//       <div className="flex-1 flex flex-col">
//         {!conversationId ? (
//           <EmptyState onNew={newConversation} />
//         ) : (
//           <>
//             {/* Messages */}
//             <div className="flex-1 overflow-y-auto p-6 space-y-6">
//               {activeConv?.messages.map((msg) => (
//                 <MessageBubble 
//                   key={msg.id} 
//                   message={msg} 
//                   onFollowUpClick={(q) => sendMessage(q)} 
//                 />
//               ))}

//               {/* Streaming indicator */}
//               {streaming && (
//                 <div className="flex gap-3">
//                   <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
//                     <Bot className="w-4 h-4 text-primary-600" />
//                   </div>
//                   <div className="flex-1 bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 max-w-2xl">
//                     {streamingText ? (
//                       <p className="text-sm text-gray-800 whitespace-pre-wrap">{streamingText}</p>
//                     ) : (
//                       <div className="flex gap-1 py-1">
//                         {[0, 1, 2].map((i) => (
//                           <div key={i} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}
//               <div ref={messagesEndRef} />
//             </div>

//             {/* Input Container */}
//             <div className="border-t border-gray-200 bg-white p-4">
//               <div className="max-w-3xl mx-auto">
//                 <div className="flex gap-2 items-end">
//                   <textarea
//                     ref={textareaRef}
//                     className="input flex-1 resize-none min-h-[44px] max-h-32 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     placeholder={isListening ? "Listening..." : "Describe your symptoms, ask about lab results..."}
//                     value={input}
//                     onChange={(e) => setInput(e.target.value)}
//                     onKeyDown={handleKeyDown}
//                     rows={1}
//                     disabled={streaming}
//                   />
                  
//                   {/* Microphone Button */}
//                   <button
//                     onClick={toggleListening}
//                     className={clsx(
//                       "px-4 py-2.5 flex items-center justify-center gap-2 rounded-lg border transition-all",
//                       isListening 
//                         ? "bg-red-50 border-red-200 text-red-600 animate-pulse" 
//                         : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
//                     )}
//                     disabled={streaming}
//                     title={isListening ? "Stop listening" : "Start speaking"}
//                   >
//                     {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
//                   </button>

//                   {/* Send Button */}
//                   <button
//                     onClick={() => sendMessage()}
//                     className="btn-primary px-4 py-2.5 flex items-center justify-center gap-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50"
//                     disabled={!input.trim() || streaming}
//                   >
//                     <Send className="w-5 h-5" />
//                   </button>
//                 </div>
//                 <p className="text-xs text-gray-400 mt-2 text-center">
//                   For emergencies, call 911. MedAgent is not a substitute for professional medical care.
//                 </p>
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   )
// }

// function MessageBubble({ 
//   message, 
//   onFollowUpClick 
// }: { 
//   message: Message, 
//   onFollowUpClick?: (q: string) => void 
// }) {
//   const isUser = message.role === 'user'
//   const [showDetails, setShowDetails] = useState(false)
//   const [isPlaying, setIsPlaying] = useState(false)
  
//   const escalation = message.escalation_level
//   const cfg = escalation ? ESCALATION_CONFIG[escalation as keyof typeof ESCALATION_CONFIG] : null

//   // Text-to-Speech logic (Text to Voice)
//   const toggleSpeech = () => {
//     if (!('speechSynthesis' in window)) {
//       alert("Your browser does not support text-to-speech!");
//       return;
//     }

//     if (isPlaying) {
//       window.speechSynthesis.cancel()
//       setIsPlaying(false)
//     } else {
//       // Clean up markdown syntax (*, #, `) so the voice reads it naturally
//       const cleanText = message.content.replace(/[#*_`]/g, '')
//       const utterance = new SpeechSynthesisUtterance(cleanText)
      
//       // Optional: You can change the voice or speed here
//       // utterance.rate = 1.0; 
      
//       utterance.onend = () => setIsPlaying(false)
//       utterance.onerror = () => setIsPlaying(false)
      
//       window.speechSynthesis.speak(utterance)
//       setIsPlaying(true)
//     }
//   }

//   // Ensure speech stops if component unmounts
//   useEffect(() => {
//     return () => {
//       if (isPlaying) {
//         window.speechSynthesis.cancel()
//       }
//     }
//   }, [isPlaying])

//   return (
//     <div className={clsx('flex gap-3', isUser && 'flex-row-reverse')}>
//       {/* Avatar */}
//       <div className={clsx(
//         'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
//         isUser ? 'bg-primary-600' : 'bg-primary-100'
//       )}>
//         {isUser
//           ? <User className="w-4 h-4 text-white" />
//           : <Bot className="w-4 h-4 text-primary-600" />
//         }
//       </div>

//       <div className={clsx('flex flex-col gap-2 max-w-2xl', isUser && 'items-end')}>
//         {/* Main bubble */}
//         <div className={clsx(
//           'px-4 py-3 rounded-2xl shadow-sm',
//           isUser
//             ? 'bg-primary-600 text-white rounded-tr-sm'
//             : 'bg-white border border-gray-200 rounded-tl-sm text-gray-800'
//         )}>
//           <div className={clsx('text-sm prose prose-sm max-w-none', isUser && 'prose-invert')}>
//             <ReactMarkdown>{message.content}</ReactMarkdown>
//           </div>
//         </div>

//         {/* AI Action Buttons (Read Aloud & Escalation) */}
//         {!isUser && (
//           <div className="flex flex-wrap items-center gap-2 mt-1">
            
//             {/* THIS IS THE TEXT-TO-VOICE BUTTON */}
//             <button
//               onClick={toggleSpeech}
//               className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 transition-colors border border-primary-100"
//             >
//               {isPlaying ? (
//                 <><Square className="w-3.5 h-3.5 fill-current" /> Stop Reading</>
//               ) : (
//                 <><Volume2 className="w-3.5 h-3.5" /> Read Aloud</>
//               )}
//             </button>

//             {/* Escalation banner */}
//             {escalation && escalation !== 'none' && cfg && (
//               <div className={clsx('flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium', cfg.color)}>
//                 <cfg.icon className="w-3.5 h-3.5 flex-shrink-0" />
//                 <span>{cfg.label}</span>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Follow-up Questions (Quick Replies) */}
//         {!isUser && message.follow_up_questions && message.follow_up_questions.length > 0 && (
//           <div className="flex flex-wrap gap-2 mt-1">
//             {message.follow_up_questions.map((q, i) => (
//               <button
//                 key={i}
//                 onClick={() => onFollowUpClick?.(q)}
//                 className="text-xs font-medium bg-white text-primary-600 border border-primary-200 rounded-full px-4 py-2 hover:bg-primary-50 transition-colors shadow-sm text-left leading-tight"
//               >
//                 {q}
//               </button>
//             ))}
//           </div>
//         )}

//         {/* Details toggle */}
//         {!isUser && (message.recommendations?.length || message.disclaimer) && (
//           <button
//             onClick={() => setShowDetails(!showDetails)}
//             className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 mt-1"
//           >
//             Details
//             <ChevronDown className={clsx('w-3 h-3 transition-transform', showDetails && 'rotate-180')} />
//           </button>
//         )}

//         {/* Expanded Details Section */}
//         {!isUser && showDetails && (
//           <div className="bg-white border border-gray-100 shadow-sm rounded-lg p-3 text-sm space-y-2 w-full mt-1">
//             {message.recommendations && message.recommendations.length > 0 && (
//               <div>
//                 <p className="font-medium text-gray-700 mb-1">Recommendations</p>
//                 <ul className="space-y-1">
//                   {message.recommendations.map((r, i) => (
//                     <li key={i} className="flex items-start gap-2 text-gray-600">
//                       <span className="text-primary-500 mt-0.5">•</span> {r}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//             {message.confidence_score && (
//               <p className="text-gray-500 text-xs mt-2">
//                 Confidence: {Math.round(message.confidence_score * 100)}%
//               </p>
//             )}
//             {message.disclaimer && (
//               <p className="text-gray-400 text-xs italic border-t border-gray-100 pt-2 mt-2">
//                 {message.disclaimer}
//               </p>
//             )}
//           </div>
//         )}

//         <p className="text-xs text-gray-400 px-1 mt-0.5">
//           {format(new Date(message.created_at), 'HH:mm')}
//         </p>
//       </div>
//     </div>
//   )
// }
import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Send, Plus, Trash2, AlertTriangle, AlertCircle, Info, CheckCircle,
  ChevronDown, Bot, User, Mic, MicOff, Volume2, Square
} from 'lucide-react'
import { chatApi } from '../api/chat'
import type { Conversation, ConversationDetail, MedicalResponse, Message } from '../types'
import { format } from 'date-fns'
import clsx from 'clsx'
import ReactMarkdown from 'react-markdown'

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const ESCALATION_CONFIG = {
  none: { color: 'bg-green-50 border-green-200 text-green-800', icon: CheckCircle, label: 'No concern' },
  mild: { color: 'bg-blue-50 border-blue-200 text-blue-800', icon: Info, label: 'Mild concern' },
  urgent: { color: 'bg-orange-50 border-orange-200 text-orange-800', icon: AlertCircle, label: 'See a doctor soon' },
  emergency: { color: 'bg-red-50 border-red-200 text-red-800', icon: AlertTriangle, label: 'SEEK EMERGENCY CARE' },
}

export default function ChatPage() {
  const { conversationId } = useParams<{ conversationId: string }>()
  const navigate = useNavigate()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConv, setActiveConv] = useState<ConversationDetail | null>(null)
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [streamingText, setStreamingText] = useState('')
  const [finalResponse, setFinalResponse] = useState<MedicalResponse | null>(null)
  
  // Voice State
  const [isListening, setIsListening] = useState(false)
  const [usedVoice, setUsedVoice] = useState(false)
  const [autoPlayNext, setAutoPlayNext] = useState(false)

  const recognitionRef = useRef<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    loadConversations()
  }, [])

  useEffect(() => {
    if (conversationId) loadConversation(conversationId)
  }, [conversationId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeConv?.messages, streamingText])

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = ''
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript
          }
        }
        if (finalTranscript) {
          setInput((prev) => prev + (prev ? ' ' : '') + finalTranscript)
          setUsedVoice(true)
        }
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error)
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }
  }, [])

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
    } else {
      try {
        recognitionRef.current?.start()
        setIsListening(true)
      } catch (e) {
        console.error("Microphone access denied or error:", e)
      }
    }
  }

  const loadConversations = async () => {
    const { data } = await chatApi.listConversations()
    setConversations(data.items)
  }

  const loadConversation = async (id: string) => {
    const { data } = await chatApi.getConversation(id)
    setActiveConv(data)
  }

  const newConversation = async () => {
    const { data } = await chatApi.createConversation()
    setConversations((prev) => [data, ...prev])
    navigate(`/chat/${data.id}`)
  }

  const deleteConversation = async (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    await chatApi.deleteConversation(id)
    setConversations((prev) => prev.filter((c) => c.id !== id))
    if (conversationId === id) {
      setActiveConv(null)
      navigate('/chat')
    }
  }

  const sendMessage = async (overrideMessage?: string) => {
    const msgText = overrideMessage || input.trim()
    if (!msgText || streaming || !conversationId) return

    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
    }

    setAutoPlayNext(usedVoice && !overrideMessage) 
    
    setInput('')
    setUsedVoice(false)
    setStreaming(true)
    setStreamingText('')
    setFinalResponse(null)

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: msgText,
      escalation_level: null,
      confidence_score: null,
      recommendations: null,
      follow_up_questions: null,
      disclaimer: null,
      created_at: new Date().toISOString(),
    }
    setActiveConv((prev) => prev ? { ...prev, messages: [...prev.messages, userMsg] } : prev)

    await chatApi.sendMessage(
      conversationId,
      msgText,
      (chunk) => setStreamingText((prev) => prev + chunk),
      (data) => {
        setFinalResponse(data as unknown as MedicalResponse)
        setStreaming(false)
        setStreamingText('')
        loadConversation(conversationId)
        loadConversations()
      },
      (err) => {
        console.error(err)
        setStreaming(false)
        setStreamingText('')
      }
    )
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex h-full">
      {/* Conversation list */}
      <aside className="w-60 border-r border-gray-200 bg-white flex flex-col">
        <div className="p-3 border-b border-gray-200">
          <button onClick={newConversation} className="btn-primary w-full flex items-center justify-center gap-2 text-sm py-2">
            <Plus className="w-4 h-4" /> New chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => navigate(`/chat/${conv.id}`)}
              className={clsx(
                'group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors',
                conv.id === conversationId
                  ? 'bg-primary-50 text-primary-700'
                  : 'hover:bg-gray-100 text-gray-700'
              )}
            >
              <span className="truncate flex-1">{conv.title || 'New conversation'}</span>
              <button
                onClick={(e) => deleteConversation(conv.id, e)}
                className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-red-500 transition-all"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </aside>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {!conversationId ? (
          <EmptyState onNew={newConversation} />
        ) : (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {activeConv?.messages.map((msg, index) => {
                const isLast = index === activeConv.messages.length - 1;
                return (
                  <MessageBubble 
                    key={msg.id} 
                    message={msg} 
                    onFollowUpClick={(q) => sendMessage(q)} 
                    autoPlay={isLast && autoPlayNext && !streaming}
                  />
                )
              })}

              {/* Streaming indicator */}
              {streaming && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-primary-600" />
                  </div>
                  <div className="flex-1 bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 max-w-2xl">
                    {streamingText ? (
                      <p className="text-sm text-gray-800 whitespace-pre-wrap">{streamingText}</p>
                    ) : (
                      <div className="flex gap-1 py-1">
                        {[0, 1, 2].map((i) => (
                          <div key={i} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Container */}
            <div className="border-t border-gray-200 bg-white p-4">
              <div className="max-w-3xl mx-auto">
                <div className="flex gap-2 items-end">
                  <textarea
                    ref={textareaRef}
                    className="input flex-1 resize-none min-h-[44px] max-h-32 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder={isListening ? "Listening..." : "Describe your symptoms, ask about lab results..."}
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);
                      setUsedVoice(false);
                    }}
                    onKeyDown={handleKeyDown}
                    rows={1}
                    disabled={streaming}
                  />
                  
                  {/* Microphone Button */}
                  <button
                    onClick={toggleListening}
                    className={clsx(
                      "px-4 py-2.5 flex items-center justify-center gap-2 rounded-lg border transition-all",
                      isListening 
                        ? "bg-red-50 border-red-200 text-red-600 animate-pulse" 
                        : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
                    )}
                    disabled={streaming}
                    title={isListening ? "Stop listening" : "Start speaking"}
                  >
                    {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>

                  {/* Send Button */}
                  <button
                    onClick={() => sendMessage()}
                    className="btn-primary px-4 py-2.5 flex items-center justify-center gap-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50"
                    disabled={!input.trim() || streaming}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2 text-center">
                  For emergencies, call 911. MedAgent is not a substitute for professional medical care.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function MessageBubble({ 
  message, 
  onFollowUpClick,
  autoPlay = false
}: { 
  message: Message, 
  onFollowUpClick?: (q: string) => void,
  autoPlay?: boolean 
}) {
  const isUser = message.role === 'user'
  const [showDetails, setShowDetails] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const hasAutoPlayed = useRef(false)
  
  const escalation = message.escalation_level
  const cfg = escalation ? ESCALATION_CONFIG[escalation as keyof typeof ESCALATION_CONFIG] : null

  // Core Speech Function
  const playSpeech = () => {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel() 
    const cleanText = message.content.replace(/[#*_`]/g, '')
    const utterance = new SpeechSynthesisUtterance(cleanText)
    
    utterance.onend = () => setIsPlaying(false)
    utterance.onerror = () => setIsPlaying(false)
    
    window.speechSynthesis.speak(utterance)
    setIsPlaying(true)
  }

  // Hook for Auto-Play
  useEffect(() => {
    if (autoPlay && !isUser && !hasAutoPlayed.current && message.content) {
      hasAutoPlayed.current = true;
      playSpeech();
    }
  }, [autoPlay, isUser, message.content]);

  // Manual Toggle Function
  const toggleSpeech = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel()
      setIsPlaying(false)
    } else {
      playSpeech()
    }
  }

  useEffect(() => {
    return () => {
      if (isPlaying) window.speechSynthesis.cancel()
    }
  }, [isPlaying])

  return (
    <div className={clsx('flex gap-3', isUser && 'flex-row-reverse')}>
      {/* Avatar */}
      <div className={clsx(
        'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
        isUser ? 'bg-primary-600' : 'bg-primary-100'
      )}>
        {isUser
          ? <User className="w-4 h-4 text-white" />
          : <Bot className="w-4 h-4 text-primary-600" />
        }
      </div>

      <div className={clsx('flex flex-col gap-2 max-w-2xl', isUser && 'items-end')}>
        {/* Main bubble */}
        <div className={clsx(
          'px-4 py-3 rounded-2xl shadow-sm',
          isUser
            ? 'bg-primary-600 text-white rounded-tr-sm'
            : 'bg-white border border-gray-200 rounded-tl-sm text-gray-800'
        )}>
          <div className={clsx('text-sm prose prose-sm max-w-none', isUser && 'prose-invert')}>
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        </div>

        {/* AI Action Buttons (Read Aloud & Escalation) */}
        {!isUser && (
          <div className="flex flex-wrap items-center gap-2 mt-1">
            
            {/* TEXT-TO-VOICE BUTTON */}
            <button
              onClick={toggleSpeech}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 transition-colors border border-primary-100"
            >
              {isPlaying ? (
                <><Square className="w-3.5 h-3.5 fill-current" /> Stop Reading</>
              ) : (
                <><Volume2 className="w-3.5 h-3.5" /> Read Aloud</>
              )}
            </button>

            {/* Escalation banner */}
            {escalation && escalation !== 'none' && cfg && (
              <div className={clsx('flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium', cfg.color)}>
                <cfg.icon className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{cfg.label}</span>
              </div>
            )}
          </div>
        )}

        {/* Follow-up Questions (Quick Replies) */}
        {!isUser && message.follow_up_questions && message.follow_up_questions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1">
            {message.follow_up_questions.map((q, i) => (
              <button
                key={i}
                onClick={() => onFollowUpClick?.(q)}
                className="text-xs font-medium bg-white text-primary-600 border border-primary-200 rounded-full px-4 py-2 hover:bg-primary-50 transition-colors shadow-sm text-left leading-tight"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Details toggle */}
        {!isUser && (message.recommendations?.length || message.disclaimer) && (
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 mt-1"
          >
            Details
            <ChevronDown className={clsx('w-3 h-3 transition-transform', showDetails && 'rotate-180')} />
          </button>
        )}

        {/* Expanded Details Section */}
        {!isUser && showDetails && (
          <div className="bg-white border border-gray-100 shadow-sm rounded-lg p-3 text-sm space-y-2 w-full mt-1">
            {message.recommendations && message.recommendations.length > 0 && (
              <div>
                <p className="font-medium text-gray-700 mb-1">Recommendations</p>
                <ul className="space-y-1">
                  {message.recommendations.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-600">
                      <span className="text-primary-500 mt-0.5">•</span> {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {message.confidence_score !== null && (
              <p className="text-gray-500 text-xs mt-2">
                Confidence: {Math.round(message.confidence_score * 100)}%
              </p>
            )}
            {message.disclaimer && (
              <p className="text-gray-400 text-xs italic border-t border-gray-100 pt-2 mt-2">
                {message.disclaimer}
              </p>
            )}
          </div>
        )}

        <p className="text-xs text-gray-400 px-1 mt-0.5">
          {format(new Date(message.created_at), 'HH:mm')}
        </p>
      </div>
    </div>
  )
}

function EmptyState({ onNew }: { onNew: () => void }) {
  const suggestions = [
    'My blood pressure has been high lately, what does it mean?',
    'Explain my HbA1c result of 6.8%',
    'Is it safe to take ibuprofen with my current medications?',
    'I have a headache and mild fever for 2 days. Should I see a doctor?',
  ]
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <Bot className="w-12 h-12 text-primary-300 mb-4" />
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Your personal health AI</h2>
      <p className="text-gray-500 mb-8 max-w-md">
        Ask about your symptoms, understand lab results, track medications, and get guidance on when to see a doctor.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl w-full mb-6">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={onNew}
            className="text-left text-sm bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-primary-300 hover:bg-primary-50 transition-colors text-gray-700 shadow-sm"
          >
            {s}
          </button>
        ))}
      </div>
      <button onClick={onNew} className="btn-primary px-6 py-2 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors shadow-sm">
        Start chatting
      </button>
    </div>
  )
}