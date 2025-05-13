import { useState } from "react";
import { useAuth } from "./auth/auth-provider";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { LogOut, Plus } from "lucide-react";

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
  const [showPopup, setShowPopup] = useState(false);
  const [groupId, setGroupId] = useState("");

  return (
    <>
      {/* Sidebar */}
      <div className="h-screen w-16 bg-neutral-950 p-2 justify-between flex flex-col relative">
        <div className="flex flex-col gap-3">
          {/* Render friend chats here */}
        </div>

        <div className="flex flex-col gap-2 items-center">
          {/* + Button */}
          <Button
            size="sm"
            className="rounded-full h-12 w-12"
            onClick={() => setShowPopup(true)}
          >
            <Plus />
          </Button>

          {/* Logout Button */}
          <Button
            size="sm"
            className="rounded-full h-12 w-12"
            onClick={() => signOut()}
          >
            <LogOut />
          </Button>
        </div>
      </div>

      {/* Centered Dark-Themed Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-neutral-900 text-white p-6 rounded-lg shadow-lg w-[90%] max-w-sm">
            <h2 className="text-lg font-semibold mb-4">Enter Group ID</h2>
            <input
              type="text"
              placeholder="Group ID"
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 placeholder:text-neutral-400 text-white"
            />
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                className="border-neutral-600 text-neutral-300 hover:bg-neutral-800"
                onClick={() => setShowPopup(false)}
              >
                Cancel
              </Button>
              <Button className="bg-white text-black hover:bg-gray-300">
                Submit
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
