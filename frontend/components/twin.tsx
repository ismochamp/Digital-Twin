'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, MessageCircle, Loader2 } from 'lucide-react';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export default function Twin() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState<string>('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: input,
                    session_id: sessionId || undefined,
                }),
            });

            if (!response.ok) throw new Error('Failed to send message');

            const data = await response.json();

            if (!sessionId) {
                setSessionId(data.session_id);
            }

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.response,
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Error:', error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: 'Apologies, an error occurred. Please try again.',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    // Check if avatar exists
    const [hasAvatar, setHasAvatar] = useState(false);
    useEffect(() => {
        // Check if avatar.jpeg exists
        fetch('/avatar.jpeg', { method: 'HEAD' })
            .then(res => setHasAvatar(res.ok))
            .catch(() => setHasAvatar(false));
    }, []);

    return (
        <div className="flex flex-col h-full bg-white rounded-2xl shadow-2xl border border-gray-100 font-sans">
            {/* Header */}
            <div className="bg-emerald-800 text-white p-6 rounded-t-2xl flex items-center gap-4 transition-all">
                <MessageCircle className="w-8 h-8 text-emerald-200" />
                <div>
                    <h2 className="text-2xl font-semibold tracking-tight">Digital Twin AI</h2>
                    <p className="text-sm text-emerald-200 mt-1">Your personalized conversational companion</p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
                {messages.length === 0 && (
                    <div className="text-center text-gray-600 mt-16 animate-fade-in">
                        {hasAvatar ? (
                            <img
                                src="/avatar.jpeg"
                                alt="Digital Twin Avatar"
                                className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-gray-300"
                            />
                        ) : (
                            <div>
                                <Bot className="w-16 h-16 mx-auto mb-4 text-emerald-700" />
                                <p className="text-lg font-medium">Welcome to Your Digital Twin</p>
                                <p className="text-sm mt-2 max-w-md mx-auto">
                                    Engage with your AI companion, designed to reflect your unique perspective.
                                    Start by asking a question or sharing a thought.
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex gap-4 items-start transition-all duration-300 hover:scale-[1.01] ${
                            message.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                    >
                        {message.role === 'assistant' && (
                            <div className="flex-shrink-0">
                                {hasAvatar ? (
                                    <img
                                        src="/avatar.jpeg"
                                        alt="Digital Twin Avatar"
                                        className="w-10 h-10 rounded-full border border-gray-200"
                                    />
                                ) : (
                                    <div className="w-10 h-10 bg-emerald-800 rounded-full flex items-center justify-center hover:bg-emerald-900 transition-colors">
                                        <Bot className="w-6 h-6 text-white" />
                                    </div>
                                )}
                            </div>
                        )}

                        <div
                            className={`max-w-[70%] rounded-2xl p-4 shadow-md transition-all duration-200 hover:shadow-lg ${
                                message.role === 'user'
                                    ? 'bg-emerald-700 text-white'
                                    : 'bg-white border border-gray-200 text-gray-800'
                            }`}
                        >
                            <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                            <p
                                className={`text-xs mt-2 font-light ${
                                    message.role === 'user' ? 'text-emerald-200' : 'text-gray-500'
                                }`}
                            >
                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                            </p>
                        </div>

                        {message.role === 'user' && (
                            <div className="flex-shrink-0">
                                <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                                    <User className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {isLoading && (
                    <div className="flex gap-4 justify-start animate-pulse">
                        <div className="flex-shrink-0">
                            {hasAvatar ? (
                                <img
                                    src="/avatar.jpeg"
                                    alt="Digital Twin Avatar"
                                    className="w-10 h-10 rounded-full border border-gray-200"
                                />
                            ) : (
                                <div className="w-10 h-10 bg-emerald-800 rounded-full flex items-center justify-center">
                                    <Bot className="w-6 h-6 text-white" />
                                </div>
                            )}
                        </div>
                        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-md">
                            <Loader2 className="w-5 h-5 text-emerald-700 animate-spin" />
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 p-5 bg-white rounded-b-2xl">
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Enter your message..."
                        className="flex-1 px-5 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-gray-800 text-sm transition-all duration-200 hover:border-emerald-300"
                        disabled={isLoading}
                    />
                    <button
                        onClick={sendMessage}
                        disabled={!input.trim() || isLoading}
                        className="px-6 py-3 bg-emerald-800 text-white rounded-xl hover:bg-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                    >
                        <Send className="w-5 h-5" />
                        <span className="text-sm font-medium">Send</span>
                    </button>
                </div>
            </div>
        </div>
    );
}