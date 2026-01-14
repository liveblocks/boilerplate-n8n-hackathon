import { LiveList, LiveMap, LiveObject } from "@liveblocks/core";

type Block = {
  id: string;
  content: string;
};

declare global {
  interface Liveblocks {
    // Each user's Presence, for room.getPresence, room.subscribe("others"), etc.
    Presence: {
      // Used by tldraw
      presence: any;
    };

    // Each user's Storage, for room.getStorage, room.subscribe("storage"), etc.
    Storage: {
      // Used by tldraw
      records: LiveMap<string, any>;

      // Used by builder
      blocks: LiveList<LiveObject<Block>>;
    };

    // Custom user info set when authenticating with a secret key
    UserMeta: {
      id: string; // Accessible through `user.id`
      info: {
        name: string;
        color: string;
        avatar: string;
      }; // Accessible through `user.info`
    };
  }
}
