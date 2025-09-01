import { PubSub } from "graphql-subscriptions";


const pubsub=new PubSub();
export const NEW_USER = "NEW_USER";
export const NEW_TRIP="NEW_TRIP";
export {pubsub};