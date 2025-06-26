"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import Editor from "@monaco-editor/react";

interface Message {
	id: string;
	role: "user" | "assistant" | "system";
	content: string;
}

interface MessageGroupProps {
	onUpdate?: (messages: Message[]) => void;
}

export function MessageGroup({ onUpdate }: MessageGroupProps) {
	const [messages, setMessages] = useState<Message[]>([]);
	const [selectedMessage, setSelectedMessage] = useState<string | null>(null);

	const addMessage = (role: "user" | "assistant" | "system") => {
		const newMessage: Message = {
			id: Date.now().toString(),
			role,
			content: "",
		};
		const newMessages = [...messages, newMessage];
		setMessages(newMessages);
		setSelectedMessage(newMessage.id);
		onUpdate?.(newMessages);
	};

	const updateMessage = (id: string, content: string) => {
		const newMessages = messages.map((msg) =>
			msg.id === id ? { ...msg, content } : msg,
		);
		setMessages(newMessages);
		onUpdate?.(newMessages);
	};

	const deleteMessage = (id: string) => {
		const newMessages = messages.filter((msg) => msg.id !== id);
		setMessages(newMessages);
		if (selectedMessage === id) {
			setSelectedMessage(null);
		}
		onUpdate?.(newMessages);
	};

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="text-lg font-semibold">User Messages</h2>
				<div className="space-x-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => addMessage("user")}
					>
						Add User Message
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => addMessage("assistant")}
					>
						Add Assistant Message
					</Button>
				</div>
			</div>

			<div className="space-y-4">
				{messages.map((message) => (
					<div
						key={message.id}
						className="border rounded-lg bg-card overflow-hidden"
					>
						<div className="flex items-center justify-between p-2 bg-muted">
							<div className="flex items-center space-x-2">
								<span className="font-medium capitalize">{message.role}</span>
								<span className="text-sm text-muted-foreground">
									#{message.id}
								</span>
							</div>
							<div className="space-x-2">
								<Button
									variant="ghost"
									size="sm"
									onClick={() =>
										setSelectedMessage(
											selectedMessage === message.id ? null : message.id,
										)
									}
								>
									{selectedMessage === message.id ? "Close" : "Edit"}
								</Button>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => deleteMessage(message.id)}
								>
									Delete
								</Button>
							</div>
						</div>

						{selectedMessage === message.id ? (
							<div className="h-[200px]">
								<Editor
									height="100%"
									defaultLanguage="markdown"
									theme="light"
									value={message.content}
									onChange={(value) => updateMessage(message.id, value || "")}
									options={{
										minimap: { enabled: false },
										fontSize: 14,
										lineNumbers: "off",
										wordWrap: "on",
										wrappingIndent: "indent",
										scrollBeyondLastLine: false,
									}}
								/>
							</div>
						) : (
							<div className="p-4">
								<pre className="whitespace-pre-wrap font-mono text-sm">
									{message.content || "(Empty message)"}
								</pre>
							</div>
						)}
					</div>
				))}
			</div>

			{messages.length === 0 && (
				<div className="text-center p-8 text-muted-foreground">
					No messages yet. Add a message to get started.
				</div>
			)}
		</div>
	);
}
