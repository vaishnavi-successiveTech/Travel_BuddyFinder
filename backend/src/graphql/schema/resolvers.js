import Message from "../../models/Message.js";
import User from "../../models/User.js";
import { PubSub, withFilter } from "graphql-subscriptions";
import { NEW_USER, pubsub } from "../server/pubsub.js";
import Trip from "../../models/Trip.js";

const MESSAGE_SENT = "MESSAGE_SENT";
const NEW_TRIP = "NEW_TRIP";

export const resolvers = {
  Query: {
    // Get all users
    users: async () => await User.find().select("_id name email avatar"),

    // Get messages between sender and recipient
    messages: async (_, { sender, recipient }) => {
      try {
        let msgs = await Message.find({
          $or: [
            { sender, recipient },
            { sender: recipient, recipient: sender },
          ],
        }).sort({ createdAt: 1 }); // Sort by creation date

        // Populate sender and recipient safely
        msgs = await Promise.all(
          msgs.map(async (msg) => {
            const senderUser = await User.findById(msg.sender).select(
              "_id name email avatar"
            );
            const recipientUser = await User.findById(msg.recipient).select(
              "_id name email avatar"
            );
            if (!senderUser || !recipientUser) return null; // skip invalid messages
            msg.sender = senderUser;
            msg.recipient = recipientUser;
            return msg;
          })
        );

        return msgs.filter(Boolean);
      } catch (err) {
        throw new Error("Error fetching messages: " + err.message);
      }
    },

    // messages: async (_, { sender, recipient }) => {
    //   try {
    //     let msgs = await Message.find({
    //       $or: [
    //         { sender, recipient },
    //         { sender: recipient, recipient: sender },
    //       ],
    //     }).sort({ createdAt: 1 });

    //     // Populate sender and recipient safely
    //     msgs = await Promise.all(
    //       msgs.map(async (msg) => {
    //         const senderUser = await User.findById(msg.sender).select("_id name email avatar");
    //         const recipientUser = await User.findById(msg.recipient).select("_id name email avatar");
    //         if (!senderUser || !recipientUser) return null; // skip invalid messages
    //         msg.sender = senderUser;
    //         msg.recipient = recipientUser;
    //         return msg;
    //       })
    //     );

    //     return msgs.filter(Boolean);
    //   } catch (err) {
    //     throw new Error("Error fetching messages: " + err.message);
    //   }
    // },
  },

  Mutation: {
    sendMessage: async (_, { sender, recipient, content }) => {
      // Validate users exist
      const senderUser = await User.findById(sender).select(
        "_id name email avatar"
      );
      const recipientUser = await User.findById(recipient).select(
        "_id name email avatar"
      );
      if (!senderUser || !recipientUser) {
        throw new Error("Sender or recipient not found");
      }

      // Create message
      let message = await Message.create({ sender, recipient, content });

      // Attach full sender and recipient objects manually
      message.sender = senderUser;
      message.recipient = recipientUser;

      pubsub.publish(MESSAGE_SENT, { messageSent: message, recipient });

      return message;
    },

    markMessageAsRead: async (_, { messageId, userId }) => {
      const message = await Message.findById(messageId);
      if (!message) throw new Error("Message not found");

      if (message.recipient.toString() !== userId) {
        throw new Error("Not authorized to mark this message as read");
      }

      message.read = true;

      // Populate sender and recipient before returning
      const senderUser = await User.findById(message.sender).select(
        "_id name email avatar"
      );
      const recipientUser = await User.findById(message.recipient).select(
        "_id name email avatar"
      );

      message.sender = senderUser;
      message.recipient = recipientUser;

      await message.save();
      return message;
    },
  },

  Subscription: {
    messageSent: {
      subscribe: withFilter(
        () => pubsub.asyncIterableIterator(MESSAGE_SENT),
        (payload, variables) => {
          // deliver only if recipient matches
          return (
            payload.messageSent.recipient._id.toString() === variables.recipient
          );
        }
      ),
    },
    newUser: {
      subscribe: () => pubsub.asyncIterableIterator([NEW_USER]),
    },
    tripCreated: {
      subscribe: () => pubsub.asyncIterableIterator([NEW_TRIP]),
    },
  },
   Trip: {
    creator: async (parent) => {
      return await User.findById(parent.creator);
    },
  },
};

// import Message from "../../models/Message.js";
// import User from "../../models/User.js";
// import { pubsub } from "../server/pubsub.js";

// const MESSAGE_SENT = "MESSAGE_SENT";

// export const resolvers = {
//   Query: {
//      users: async () => await User.find().select("_id name email avatar"),
//     //  user: async (_, { id }) => await User.findById(id).select("_id name email avatar"),
//     messages: async (_, { sender, recipient }) => {
//       try {
//         const msgs = await Message.find({
//           $or: [
//             { sender, recipient },
//             { sender: recipient, recipient: sender }
//           ]
//         })
//           .sort({ createdAt: 1 }) // oldest → newest
//           .populate("sender", "_id name email avatar") // populate user info
//           .populate("recipient", "_id name email avatar");

//         return msgs;
//       } catch (err) {
//         throw new Error("Error fetching messages: " + err.message);
//       }
//     },
//   },
//   Mutation: {
//     sendMessage: async (_, { sender, recipient, content }) => {
//       const message = await Message.create({ sender, recipient, content });
//       pubsub.publish(MESSAGE_SENT, { messageSent: message, recipient });
//       return message;
//     },
//     markMessageAsRead: async (_, { messageId, userId }) => {
//     // Ensure only the recipient can mark it as read
//     const message = await Message.findById(messageId);
//     if (!message) throw new Error("Message not found");

//     if (message.recipient.toString() !== userId) {
//       throw new Error("Not authorized to mark this message as read");
//     }

//     message.read = true;
//     await message.save();
//     return message;
//   },
//   },
//   Subscription: {
//     messageSent: {
//       subscribe: (_, {  recipient}) =>
//         pubsub.asyncIterableIterator([MESSAGE_SENT]),
//       resolve: (payload, args) => {
//         // Only deliver if the recipient matches
//         if (payload.recipient === args.recipient) {
//           return payload.messageSent;
//         }
//         return null;
//       },
//     },
//   },
// };
