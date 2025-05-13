// GroupMembersPage.tsx
"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/auth/auth-provider";

interface GroupMember {
  id: string;
  name: string;
}

interface PageParams {
  params: {
    user_id: string;
  };
}

interface InviteFormData {
  duration: string;
  maxUses: number;
}

interface Invite {
  code: string;
  group: string;
  createdBy: string;
  expiresAt: string;
  maxUses: number;
  usedCount: number;
}
export default function GroupMembersPage({ params }: PageParams) {
  const { user } = useAuth();
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
  const [groupPendingMembers, setGroupPendingMembers] = useState<GroupMember[]>(
    [],
  );

  const [activeInvites, setActiveInvites] = useState<Invite[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [inviteFormData, setInviteFormData] = useState<InviteFormData>({
    duration: "1",
    maxUses: 1,
  });

  const groupId = params.user_id.replace("GPXX_", "").replace("_GPXX", "");

  useEffect(() => {
    const fetchGroupMembers = async () => {
      try {
        const membersResponse = await axios.get("/api/groups/members", {
          params: { groupId },
        });
        setGroupMembers(membersResponse.data);

        const pendingMembersResponse = await axios.get("/api/groups/members", {
          params: { groupId, pending: true },
        });
        setGroupPendingMembers(pendingMembersResponse.data);
      } catch (error) {
        console.error("Error fetching group members:", error);
      }
    };

    axios
      .get("/api/groups/invite", { params: { groupId } })
      .then((resp) => setActiveInvites(resp.data));
    fetchGroupMembers();
  }, [groupId]);

  const approveMember = async (userId: string) => {
    try {
      await axios.post("/api/groups/join", { groupId, userId });
      const response = await axios.get("/api/groups/members", {
        params: { groupId, pending: true },
      });
      setGroupPendingMembers(response.data);
    } catch (error) {
      console.error("Error approving member:", error);
    }
  };

  const declineMember = async (userId: string) => {
    try {
      await axios.post("/api/groups/decline", { groupId, userId });
      const response = await axios.get("/api/groups/members", {
        params: { groupId, pending: true },
      });
      setGroupPendingMembers(response.data);
    } catch (error) {
      console.error("Error declining member:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInviteFormData((prev) => ({
      ...prev,
      [name]: name === "maxUses" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setInviteFormData((prev) => ({
      ...prev,
      duration: value,
    }));
  };

  const handleCreateInvite = async () => {
    try {
      // Calculate expiresAt based on the selected duration
      const expiresAt = new Date();
      switch (inviteFormData.duration) {
        case "1":
          expiresAt.setDate(expiresAt.getDate() + 1); // 1 day
          break;
        case "2":
          expiresAt.setDate(expiresAt.getDate() + 10); // 10 days
          break;
        case "3":
          expiresAt.setMonth(expiresAt.getMonth() + 1); // 1 month
          break;
        case "4":
          expiresAt.setMonth(expiresAt.getMonth() + 3); // 3 months
          break;
        case "5":
          expiresAt.setFullYear(expiresAt.getFullYear() + 1); // 1 year
          break;
      }
      if (!user) return;

      const response = await axios.post("/api/groups/invite", {
        groupId,
        expiresAt: expiresAt.toISOString(),
        maxUses: inviteFormData.maxUses,
        createdBy: user.id,
      });

      console.log("Invite created successfully:", response.data);
      setIsDialogOpen(false);
      // Reset form data
      setInviteFormData({
        duration: "1",
        maxUses: 1,
      });
    } catch (error) {
      console.error("Error creating invite:", error);
    }
  };

  return (
    <main className="p-6 font-sans mx-auto max-w-5xl">
      <div className="mb-6">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">CREATE AN INVITE</Button>
          </DialogTrigger>
          <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
            <DialogHeader>
              <DialogTitle className="text-left">
                Create an invite code
              </DialogTitle>
              <DialogDescription className="text-left">
                Set the parameters for your group invite.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="duration" className="text-right">
                  Duration
                </Label>
                <Select
                  value={inviteFormData.duration}
                  onValueChange={handleSelectChange}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 day</SelectItem>
                    <SelectItem value="2">10 Days</SelectItem>
                    <SelectItem value="3">1 Month</SelectItem>
                    <SelectItem value="4">3 Months</SelectItem>
                    <SelectItem value="5">1 Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="maxUses" className="text-right">
                  Max Uses
                </Label>
                <Input
                  id="maxUses"
                  name="maxUses"
                  type="number"
                  min="1"
                  value={inviteFormData.maxUses}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateInvite}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div>
        INVITES
        {activeInvites && activeInvites.length > 0 ? (
          activeInvites.map((invite) => (
            <div key={invite.code} className="p-4 border rounded-md">
              <p>Code: {invite.code}</p>
              <p>Expires at: {new Date(invite.expiresAt).toLocaleString()}</p>
              <p>Max Uses: {invite.maxUses}</p>
            </div>
          ))
        ) : (
          <p>No active invites yet.</p>
        )}
      </div>

      <h1 className="text-3xl font-semibold mb-8 text-center">Group Members</h1>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Approved Members</h2>
        <ul className="list-none p-0">
          {groupMembers.length > 0 ? (
            groupMembers.map((member) => (
              <li key={member.id} className="mb-2 text-lg">
                {member.name}
              </li>
            ))
          ) : (
            <p className="text-gray-500">No members yet.</p>
          )}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Pending Approval</h2>
        <ul className="list-none p-0">
          {groupPendingMembers.map((member) => (
            <li
              key={member.id}
              className="mb-4 text-lg flex justify-between items-center"
            >
              <span>{member.name}</span>
              <div className="flex space-x-4">
                <button
                  onClick={() => approveMember(member.id)}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none transition"
                >
                  Approve
                </button>
                <button
                  onClick={() => declineMember(member.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none transition"
                >
                  Decline
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
