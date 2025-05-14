import { useState, useEffect } from "react";
import { useAuth } from "./auth/auth-provider";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { LogOut, Plus, UserPlus } from "lucide-react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";

function UserChat({
  user,
}: {
  user: {
    friendId: string;
    friendName: string;
    friendEmail: string;
    friendCreatedAt: string;
    friendDisplayPicture: string | null;
  };
}) {
  const router = useRouter();
  return (
    <button
      onClick={() => {
        router.push(`/app/chat/` + user.friendId);
      }}
      className="size-16 overflow-hidden aspect-square rounded-full bg-gradient-to-tr from-neutral-800 to-neutral-900 items-center flex justify-center text-center uppercase"
    >
      {user.friendDisplayPicture ? (
        <img
          className="w-full h-full object-cover"
          src={user.friendDisplayPicture}
        />
      ) : (
        <>
          {user.friendName.split(" ").length > 1
            ? user.friendName
              .split(" ")
              .map((x) => x[0])
              .join("")
            : user.friendName.slice(0, 3)}
        </>
      )}
    </button>
  );
}

function GroupChat({
  group,
}: {
  group: {
    group: {
      id: string;
      name: string;
      createdAt: string;
      visibility: "private" | "public";
    };
    group_membership: {
      id: string;
      userId: string;
      groupId: string;
      joinedAt: string;
      role: "user" | "admin";
    } | null;
  };
}) {
  const router = useRouter();
  return (
    <button
      onClick={() => {
        router.push(`/app/chat/GPXX_` + group.group.id + "_GPXX");
      }}
      className="size-16 overflow-hidden aspect-square  rounded-full bg-gradient-to-tr from-neutral-800 to-neutral-900 items-center flex justify-center text-center uppercase"
    >
      <>
        {group.group.name.split(" ").length > 1
          ? group.group.name
            .split(" ")
            .map((x) => x[0])
            .join("")
          : group.group.name.slice(0, 3)}
      </>
    </button>
  );
}

interface SearchResult {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  displayPicture: string | null;
}

export function Sidebar() {
  const { signOut, user } = useAuth();
  const [showGroupPopup, setShowGroupPopup] = useState(false);
  const [showFriendPopup, setShowFriendPopup] = useState(false);
  const [groupId, setGroupId] = useState("");
  const [friendQuery, setFriendQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(
    null,
  );
  const [myFriends, setMyFriends] = useState<
    | {
      friendId: string;
      friendName: string;
      friendEmail: string;
      friendCreatedAt: string;
      friendDisplayPicture: string | null;
    }[]
    | null
  >(null);

  const [myGroups, setMyGroups] = useState<
    | {
      group: {
        id: string;
        name: string;
        createdAt: string;
        visibility: "private" | "public";
      };
      group_membership: {
        id: string;
        userId: string;
        groupId: string;
        joinedAt: string;
        role: "user" | "admin";
      } | null;
    }[]
    | null
  >(null);

  useEffect(() => {
    if (!user) return;
    fetchFriendsAndGroups();
  }, [user]);

  const fetchFriendsAndGroups = async () => {
    if (!user) return;
    try {
      const friendsResponse = await axios.get("/api/friends", {
        params: { userId: user.id },
      });
      setMyFriends(friendsResponse.data);

      const groupsResponse = await axios.get("/api/groups", {
        params: { userId: user.id },
      });
      setMyGroups(groupsResponse.data);
    } catch (error) {
      console.log("Error fetching friends and groups:", error);
      // Optionally handle error display to the user
    }
  };

  const handleSearchFriend = async () => {
    if (!friendQuery) {
      setSearchResults(null);
      return;
    }
    try {
      const response = await axios.get("/api/users/search", {
        params: { q: friendQuery },
      });
      setSearchResults(response.data);
    } catch (error) {
      console.log("Error searching for friends:", error);
      setSearchResults([]); // Indicate an error with an empty array or handle differently
    }
  };

  const handleAddFriend = async (friendId: string) => {
    if (!user) return;
    try {
      await axios.post("/api/friends", {
        frienderId: user.id,
        friendeeId: friendId,
      });
      // After successfully adding a friend, refresh the friends list and close the popup
      fetchFriendsAndGroups();
      setShowFriendPopup(false);
      setSearchResults(null);
      setFriendQuery("");
      // Optionally provide feedback to the user (e.g., a toast notification)
    } catch (error) {
      console.log("Error adding friend:", error);
      // Optionally handle error display to the user
    }
  };
  const handleRequestJoinGroup = async (groupInviteCode: string) => {
    if (!user) return;
    try {
      await axios.post("/api/groups/join", {
        groupInviteCode,
        userId: user.id,
      });
    } catch (error) {
      console.log("Error adding friend:", error);
    }
  };

  return (
    <>
      {/* Sidebar */}
      <div className="h-screen w-16 bg-neutral-950 p-2 justify-between flex flex-col relative">
        <div className="flex flex-col gap-3">
          {myFriends?.map((friend) => (
            <UserChat user={friend} key={friend.friendId} />
          ))}
          {myGroups?.map((group) => (
            <GroupChat group={group} key={group.group.id} />
          ))}
        </div>

        <div className="flex flex-col gap-2 items-center">
          {/* Add Friend Button */}
          <Button
            size="sm"
            className="rounded-full h-12 w-12 bg-black text-white hover:bg-neutral-900"
            onClick={() => setShowFriendPopup(true)}
          >
            <UserPlus />
          </Button>
          <Button
            size="sm"
            className="rounded-full h-12 w-12 bg-black text-white hover:bg-neutral-900"
            onClick={() => setShowGroupPopup(true)}
          >
            <Plus />
          </Button>

          {/* Logout Button */}
          <Button
            size="sm"
            className="rounded-full h-12 w-12 bg-black text-white hover:bg-neutral-900"
            onClick={() => signOut()}
          >
            <LogOut />
          </Button>
        </div>
      </div>

      <Dialog open={showGroupPopup} onOpenChange={setShowGroupPopup}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Group ID</DialogTitle>
          </DialogHeader>
          <input
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
            className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 placeholder:text-neutral-400 text-white"
            placeholder="Group ID"
          />
          <div className="flex justify-end gap-2 mt-4">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={() => handleRequestJoinGroup(groupId)}>
              Submit
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showFriendPopup} onOpenChange={setShowFriendPopup}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Search Friend</DialogTitle>
          </DialogHeader>
          <input
            value={friendQuery}
            onChange={(e) => setFriendQuery(e.target.value)}
            className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 placeholder:text-neutral-400 text-white mb-2"
            placeholder="Enter name or email"
          />
          <Button className="w-full mb-4" onClick={handleSearchFriend}>
            Search
          </Button>
          {searchResults?.length ? (
            <ul className="space-y-2">
              {searchResults.map((r) => (
                <li key={r.id} className="flex justify-between">
                  <div>
                    <p>{r.name}</p>
                    <p className="text-sm text-neutral-400">{r.email}</p>
                  </div>
                  <Button size="sm" onClick={() => handleAddFriend(r.id)}>
                    Add
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            searchResults && <p>No users found.</p>
          )}
          <div className="flex justify-end mt-4">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
