// "use client";
// import { useQuery, useMutation, useSubscription } from "@apollo/client/react";
// import { useEffect, useState, useRef } from "react";
// import { useAuth } from "@/contexts/AuthContext";
// import gql from "graphql-tag";

// // GraphQL queries & mutations
// const GET_MESSAGES = gql`
//   query Messages($sender: ID!, $recipient: ID!) {
//     messages(sender: $sender, recipient: $recipient) {
//       _id
//       sender { _id name avatar }
//       recipient { _id name avatar }
//       content
//       createdAt
//       read
//     }
//   }
// `;

// const SEND_MESSAGE = gql`
//   mutation SendMessage($sender: ID!, $recipient: ID!, $content: String!) {
//     sendMessage(sender: $sender, recipient: $recipient, content: $content) {
//       _id
//       sender { _id name avatar }
//       recipient { _id name avatar }
//       content
//       createdAt
//       read
//     }
//   }
// `;

// const MARK_AS_READ = gql`
//   mutation MarkMessageAsRead($messageId: ID!, $userId: ID!) {
//     markMessageAsRead(messageId: $messageId, userId: $userId) {
//       _id
//       read
//     }
//   }
// `;

// const MESSAGE_SUB = gql`
//   subscription OnMessageSent($recipient: ID!) {
//     messageSent(recipient: $recipient) {
//       _id
//       sender { _id name avatar }
//       recipient { _id name avatar }
//       content
//       createdAt
//       read
//     }
//   }
// `;

// export default function ChatWindow({ recipient }) {
//   const { user } = useAuth();
//   const senderId = user?._id;

//   const [messages, setMessages] = useState([]);
//   const [content, setContent] = useState("");
//   const messagesEndRef = useRef(null);

//   // Fetch messages
//   const { data, loading } = useQuery(GET_MESSAGES, {
//     variables: { sender: senderId, recipient: recipient?._id },
//     fetchPolicy: "network-only",
//     skip: !senderId || !recipient?._id,
//   });

//   const [sendMessage] = useMutation(SEND_MESSAGE);
//   const [markAsRead] = useMutation(MARK_AS_READ);

//   // Subscription
//   const { data: subData } = useSubscription(MESSAGE_SUB, {
//     variables: { recipient: senderId },
//     skip: !senderId,
//   });

//   // Load messages
//   useEffect(() => {
//     if (data?.messages) {
//       setMessages(data.messages);
//     }
//   }, [data]);

//   // Handle subscription
//   useEffect(() => {
//     if (subData?.messageSent) {
//       const newMsg = subData.messageSent;
//       setMessages((prev) =>
//         prev.some((m) => m._id === newMsg._id) ? prev : [...prev, newMsg]
//       );
//     }
//   }, [subData]);

//   // Mark unread messages as read
//   useEffect(() => {
//     messages.forEach((msg) => {
//       if (msg.recipient._id === senderId && !msg.read) {
//         markAsRead({ variables: { messageId: msg._id, userId: senderId } }).catch(console.error);
//       }
//     });
//   }, [messages, senderId]);

//   // Auto-scroll to bottom
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const handleSend = async () => {
//     if (!content.trim()) return;

//     try {
//       const { data: newMessageData } = await sendMessage({
//         variables: { sender: senderId, recipient: recipient._id, content },
//       });

//       if (newMessageData?.sendMessage) {
//         setMessages((prev) => [...prev, newMessageData.sendMessage]);
//       }

//       setContent("");
//     } catch (err) {
//       console.error("Error sending message:", err);
//     }
//   };

//   if (loading) return <p>Loading chat...</p>;

//   return (
//     <div className="flex flex-col h-screen sm:h-full bg-white">
//       {/* Header */}
//       <div className="flex items-center gap-3 p-3 sm:p-4 border-b bg-gray-50">
//         <img
//           src={recipient?.avatar || "/default-avatar.png"}
//           alt={recipient?.name}
//           className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border object-cover"
//         />
//         <p className="font-semibold text-base sm:text-lg truncate">{recipient?.name}</p>
//       </div>

//       {/* Messages */}
//       <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-3 bg-gray-100">
//         {messages.map((msg) => {
//           const isSender = msg.sender._id === senderId;
//           return (
//             <div
//               key={msg._id}
//               className={`flex items-end space-x-2 ${
//                 isSender ? "justify-end" : "justify-start"
//               }`}
//             >
//               {!isSender && (
//                 <img
//                   src={msg.sender?.avatar || "/default-avatar.png"}
//                   alt={msg.sender?.name || "User"}
//                   className="w-7 h-7 sm:w-8 sm:h-8 rounded-full"
//                 />
//               )}

//               <div
//                 className={`p-2 sm:p-3 rounded-lg max-w-[75%] sm:max-w-xs break-words relative ${
//                   isSender ? "bg-emerald-500 text-white" : "bg-gray-300"
//                 }`}
//               >
//                 <p className="text-sm sm:text-base">{msg.content}</p>
//                 {isSender && (
//                   <span className="text-[10px] sm:text-xs absolute bottom-0 right-1">
//                     {msg.read ? "✅ Seen" : "✔ Sent"}
//                   </span>
//                 )}
//               </div>

//               {isSender && (
//                 <img
//                   src={msg.sender?.avatar || "/default-avatar.png"}
//                   alt={msg.sender?.name || "You"}
//                   className="w-7 h-7 sm:w-8 sm:h-8 rounded-full"
//                 />
//               )}
//             </div>
//           );
//         })}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Input */}
//       <div className="p-2 sm:p-4 flex border-t bg-white">
//         <input
//           type="text"
//           value={content}
//           onChange={(e) => setContent(e.target.value)}
//           placeholder="Type a message..."
//           className="flex-1 p-2 rounded-lg border text-sm sm:text-base"
//         />
//         <button
//           onClick={handleSend}
//           className="ml-2 px-3 sm:px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm sm:text-base"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }

"use client";
import { useQuery, useMutation, useSubscription } from "@apollo/client/react";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation"; // 👈 import router
import { useAuth } from "@/contexts/AuthContext";
import { FaArrowLeft } from "react-icons/fa";
import gql from "graphql-tag";
import LoadingSpinner from "../ui/LoadingSpinner";

// GraphQL queries & mutations
const GET_MESSAGES = gql`
  query Messages($sender: ID!, $recipient: ID!) {
    messages(sender: $sender, recipient: $recipient) {
      _id
      sender {
        _id
        name
        avatar
      }
      recipient {
        _id
        name
        avatar
      }
      content
      createdAt
      read
    }
  }
`;

const SEND_MESSAGE = gql`
  mutation SendMessage($sender: ID!, $recipient: ID!, $content: String!) {
    sendMessage(sender: $sender, recipient: $recipient, content: $content) {
      _id
      sender {
        _id
        name
        avatar
      }
      recipient {
        _id
        name
        avatar
      }
      content
      createdAt
      read
    }
  }
`;

const MARK_AS_READ = gql`
  mutation MarkMessageAsRead($messageId: ID!, $userId: ID!) {
    markMessageAsRead(messageId: $messageId, userId: $userId) {
      _id
      read
    }
  }
`;

const MESSAGE_SUB = gql`
  subscription OnMessageSent($recipient: ID!) {
    messageSent(recipient: $recipient) {
      _id
      sender {
        _id
        name
        avatar
      }
      recipient {
        _id
        name
        avatar
      }
      content
      createdAt
      read
    }
  }
`;

export default function ChatWindow({ recipient }) {
  const { user } = useAuth();
  const router = useRouter(); // 👈 initialize router
  const senderId = user?._id;

  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const messagesEndRef = useRef(null);

  // Fetch messages
  const { data, loading } = useQuery(GET_MESSAGES, {
    variables: { sender: senderId, recipient: recipient?._id },
    fetchPolicy: "network-only",
    skip: !senderId || !recipient?._id,
  });

  const [sendMessage] = useMutation(SEND_MESSAGE);
  const [markAsRead] = useMutation(MARK_AS_READ);

  // Subscription
  const { data: subData } = useSubscription(MESSAGE_SUB, {
    variables: { recipient: senderId },
    skip: !senderId,
  });

  // Load messages
  useEffect(() => {
    if (data?.messages) {
      setMessages(data.messages);
    }
  }, [data]);

  // Handle subscription
  useEffect(() => {
    if (subData?.messageSent) {
      const newMsg = subData.messageSent;
      setMessages((prev) =>
        prev.some((m) => m._id === newMsg._id) ? prev : [...prev, newMsg]
      );
    }
  }, [subData]);

  // Mark unread messages as read
  useEffect(() => {
    messages.forEach((msg) => {
      if (msg.recipient._id === senderId && !msg.read) {
        markAsRead({
          variables: { messageId: msg._id, userId: senderId },
        }).catch(console.error);
      }
    });
  }, [messages, senderId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!content.trim()) return;

    try {
      const { data: newMessageData } = await sendMessage({
        variables: { sender: senderId, recipient: recipient._id, content },
      });

      if (newMessageData?.sendMessage) {
        setMessages((prev) => [...prev, newMessageData.sendMessage]);
      }

      setContent("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  if (loading)  return <LoadingSpinner />;;

  return (
    <div className="flex flex-col h-screen sm:h-full bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 p-3 sm:p-4 border-b bg-gray-50">
        {/* Back Arrow */}

        <button
          onClick={() => router.push("/")}
          className="p-2 text-gray-600 hover:text-emerald-600 flex items-center"
        >
          <FaArrowLeft className="mr-1" />
        
        </button>

        {/* Recipient avatar + name */}
        <img
          src={recipient?.avatar || "/default-avatar.png"}
          alt={recipient?.name}
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border object-cover"
        />
        <p className="font-semibold text-base sm:text-lg truncate">
          {recipient?.name}
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-3 bg-gray-100">
        {messages.map((msg) => {
          const isSender = msg.sender._id === senderId;
          return (
            <div
              key={msg._id}
              className={`flex items-end space-x-2 ${
                isSender ? "justify-end" : "justify-start"
              }`}
            >
              {!isSender && (
                <img
                  src={msg.sender?.avatar || "/default-avatar.png"}
                  alt={msg.sender?.name || "User"}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full"
                />
              )}

              <div
                className={`p-2 sm:p-3 rounded-lg max-w-[75%] sm:max-w-xs break-words relative ${
                  isSender ? "bg-emerald-500 text-white" : "bg-gray-300"
                }`}
              >
                <p className="text-sm sm:text-base">{msg.content}</p>
                {isSender && (
                  <span className="text-[10px] sm:text-xs absolute bottom-0 right-1">
                    {msg.read ? "✅ Seen" : "✔ Sent"}
                  </span>
                )}
              </div>

              {isSender && (
                <img
                  src={msg.sender?.avatar || "/default-avatar.png"}
                  alt={msg.sender?.name || "You"}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full"
                />
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-2 sm:p-4 flex border-t bg-white">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 rounded-lg border text-sm sm:text-base"
        />
        <button
          onClick={handleSend}
          className="ml-2 px-3 sm:px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm sm:text-base"
        >
          Send
        </button>
      </div>
    </div>
  );
}
