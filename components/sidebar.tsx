import { useEffect, useState } from "react";
import { useAuth } from "./auth/auth-provider";
import { Button } from "./ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
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
      className="size-16 overflow-hidden aspect-square  rounded-full bg-gradient-to-tr from-neutral-800 to-neutral-900 items-center flex justify-center text-center uppercase"
    >
      {user.friendDisplayPicture ? (
        <img
          className=" w-full h-full object-cover"
          src={user.friendDisplayPicture}
        />
      ) : (
        <>
          {user.friendName.split.length > 1
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

export function Sidebar() {
  const { signOut, user } = useAuth();

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
  useEffect(() => {
    if (!user) return;
    axios
      .get("/api/friends", { params: { userId: user.id } })
      .then((resp) => setMyFriends(resp.data));
  }, [user]);

  return (
    <div className="h-screen w-16 bg-neutral-950 p-2 justify-between flex flex-col">
      <div className="flex flex-col gap-3">
        {myFriends?.map((friend) => (
          <UserChat user={friend} key={friend.friendId} />
        ))}
      </div>
      <Button
        size={"sm"}
        className="rounded-full h-12 w-12"
        onClick={() => signOut()}
      >
        <LogOut />
      </Button>
    </div>
  );
}
