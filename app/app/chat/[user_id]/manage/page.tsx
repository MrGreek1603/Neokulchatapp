"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import {
  Users,
  Settings,
  Info,
  Ticket,
  UserPlus,
  UserMinus,
  Edit,
  Trash,
  Copy,
  RefreshCw,
  CheckCircle,
  XCircle,
  Calendar,
  Eye,
  EyeOff,
  Lock,
  Unlock,
} from "lucide-react";

// Types
type GroupVisibility = "public" | "private" | "unlisted";
type GroupJoinMethod = "open" | "request" | "invite_only";

interface Group {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  visibility: GroupVisibility;
  joinMethod: GroupJoinMethod;
}

interface User {
  id: string;
  username: string;
  email: string;
}

interface Member extends User {
  role: "admin" | "user";
  joinedAt: string;
}

interface Invite {
  code: string;
  createdAt: string;
  expiresAt: string | null;
  maxUses: number | null;
  usedCount: number;
  createdBy: string;
}

interface JoinRequest {
  id: string;
  userId: string;
  username: string;
  email: string;
  requestedAt: string;
  message: string | null;
}

export default function GroupManagePage({
  params,
}: {
  params: { group_id: string };
}) {
  const router = useRouter();
  const groupId = params.group_id;

  // State
  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingGroup, setEditingGroup] = useState(false);
  const [groupForm, setGroupForm] = useState({ name: "", description: "" });
  const [newInvite, setNewInvite] = useState({ maxUses: "", expiresAt: "" });
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Fetch group data
  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const response = await fetch(`/api/groups/${groupId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch group data");
        }
        const data = await response.json();
        setGroup(data);
        setGroupForm({ name: data.name, description: data.description });
      } catch (error) {
        console.error("Error fetching group data:", error);
      }
    };

    // Fetch members data
    const fetchMembersData = async () => {
      try {
        const response = await fetch(`/api/groups/${groupId}/members`);
        if (!response.ok) {
          throw new Error("Failed to fetch members data");
        }
        const data = await response.json();
        setMembers(data);
      } catch (error) {
        console.error("Error fetching members data:", error);
      }
    };

    // Fetch invites data
    const fetchInvitesData = async () => {
      try {
        const response = await fetch(`/api/groups/${groupId}/invites`);
        if (!response.ok) {
          throw new Error("Failed to fetch invites data");
        }
        const data = await response.json();
        setInvites(data);
      } catch (error) {
        console.error("Error fetching invites data:", error);
      }
    };

    // Fetch join requests data
    const fetchJoinRequestsData = async () => {
      try {
        const response = await fetch(`/api/groups/${groupId}/requests`);
        if (!response.ok) {
          throw new Error("Failed to fetch join requests data");
        }
        const data = await response.json();
        setJoinRequests(data);
      } catch (error) {
        console.error("Error fetching join requests data:", error);
      }
    };

    const fetchData = async () => {
      await Promise.all([
        fetchGroupData(),
        fetchMembersData(),
        fetchInvitesData(),
        fetchJoinRequestsData(),
      ]);
      setLoading(false);
    };

    fetchData();
  }, [groupId]);

  // Handlers
  const handleUpdateGroup = async () => {
    try {
      const response = await fetch(`/api/groups/${groupId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(groupForm),
      });

      if (!response.ok) {
        throw new Error("Failed to update group information");
      }

      setGroup((prev) => (prev ? { ...prev, ...groupForm } : null));
      setEditingGroup(false);
      toast({
        title: "Group updated",
        description: "Group information has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update group information.",
        variant: "destructive",
      });
    }
  };

  const handleChangeRole = async (
    memberId: string,
    newRole: "admin" | "user",
  ) => {
    try {
      const response = await fetch(`/api/groups/members/${memberId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        throw new Error("Failed to update member role");
      }

      setMembers((prev) =>
        prev.map((member) =>
          member.id === memberId ? { ...member, role: newRole } : member,
        ),
      );

      toast({
        title: "Role updated",
        description: `Member role has been updated to ${newRole}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update member role.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      const response = await fetch(`/api/groups/members/${memberId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to remove member");
      }

      setMembers((prev) => prev.filter((member) => member.id !== memberId));

      toast({
        title: "Member removed",
        description: "Member has been removed from the group.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove member.",
        variant: "destructive",
      });
    }
  };

  const handleCreateInvite = async () => {
    try {
      const response = await fetch(`/api/groups/invites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          groupId,
          maxUses: newInvite.maxUses ? parseInt(newInvite.maxUses) : null,
          expiresAt: newInvite.expiresAt || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create invite code");
      }

      const data = await response.json();

      setInvites((prev) => [...prev, data]);
      setNewInvite({ maxUses: "", expiresAt: "" });

      toast({
        title: "Invite created",
        description: `New invite code: ${data.code}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create invite code.",
        variant: "destructive",
      });
    }
  };

  const handleRevokeInvite = async (code: string) => {
    try {
      const response = await fetch(`/api/groups/invites/${code}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to revoke invite code");
      }

      setInvites((prev) => prev.filter((invite) => invite.code !== code));

      toast({
        title: "Invite revoked",
        description: "Invite code has been revoked.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to revoke invite code.",
        variant: "destructive",
      });
    }
  };

  const handleApproveRequest = async (requestId: string) => {
    try {
      const response = await fetch(
        `/api/groups/requests/${requestId}/approve`,
        {
          method: "POST",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to approve join request");
      }

      const request = joinRequests.find((req) => req.id === requestId);
      if (request) {
        setMembers((prev) => [
          ...prev,
          {
            id: request.userId,
            username: request.username,
            email: request.email,
            role: "user",
            joinedAt: new Date().toISOString(),
          },
        ]);

        setJoinRequests((prev) => prev.filter((req) => req.id !== requestId));
      }

      toast({
        title: "Request approved",
        description: "Join request has been approved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve join request.",
        variant: "destructive",
      });
    }
  };

  const handleDenyRequest = async (requestId: string) => {
    try {
      const response = await fetch(`/api/groups/requests/${requestId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to deny join request");
      }

      setJoinRequests((prev) => prev.filter((req) => req.id !== requestId));

      toast({
        title: "Request denied",
        description: "Join request has been denied.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to deny join request.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateSettings = async (
    field: "visibility" | "joinMethod",
    value: string,
  ) => {
    try {
      const response = await fetch(`/api/groups/${groupId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ [field]: value }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update group ${field}`);
      }

      setGroup((prev) => (prev ? { ...prev, [field]: value } : null));

      toast({
        title: "Settings updated",
        description: `Group ${field} has been updated.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to update group ${field}.`,
        variant: "destructive",
      });
    }
  };

  const handleDeleteGroup = async () => {
    try {
      const response = await fetch(`/api/groups/${groupId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete group");
      }

      toast({
        title: "Group deleted",
        description: "Group has been permanently deleted.",
      });

      // Redirect to groups list
      router.push("/groups");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete group.",
        variant: "destructive",
      });
    }
  };

  const copyInviteCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied",
      description: "Invite code copied to clipboard.",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <RefreshCw className="h-8 w-8 animate-spin text-gray-500" />
          <p className="text-lg text-gray-500">Loading group information...</p>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">Group not found</h1>
          <p className="text-gray-500 mt-2">
            The requested group does not exist or you don't have permission to
            view it.
          </p>
          <Button className="mt-4" onClick={() => router.push("/groups")}>
            Back to Groups
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">{group.name}</h1>
          <p className="text-gray-500">Group Management</p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push(`/groups/${groupId}`)}
        >
          Back to Group
        </Button>
      </div>

      {/* Group Info Section */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Info className="h-5 w-5" />
          <h2 className="text-2xl font-semibold">Group Information</h2>
        </div>
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Group Details</CardTitle>
            <CardDescription>
              Basic information about your group
            </CardDescription>
          </CardHeader>
          <CardContent>
            {editingGroup ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="group-name">Group Name</Label>
                  <Input
                    id="group-name"
                    value={groupForm.name}
                    onChange={(e) =>
                      setGroupForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="Enter group name"
                  />
                </div>
                <div>
                  <Label htmlFor="group-description">Description</Label>
                  <Textarea
                    id="group-description"
                    value={groupForm.description}
                    onChange={(e) =>
                      setGroupForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Enter group description"
                    rows={4}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-sm text-gray-500">
                    Group Name
                  </h3>
                  <p>{group.name}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-gray-500">
                    Description
                  </h3>
                  <p>{group.description || "No description provided."}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-gray-500">
                    Created At
                  </h3>
                  <p>{new Date(group.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end">
            {editingGroup ? (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setEditingGroup(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleUpdateGroup}>Save Changes</Button>
              </div>
            ) : (
              <Button onClick={() => setEditingGroup(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Information
              </Button>
            )}
          </CardFooter>
        </Card>
      </section>

      {/* Members Section */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5" />
          <h2 className="text-2xl font-semibold">Members</h2>
        </div>
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Member Management</CardTitle>
            <CardDescription>
              Manage roles and access for group members
            </CardDescription>
          </CardHeader>
          <CardContent>
            {members.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No members in this group yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {members.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">
                          {member.username}
                        </TableCell>
                        <TableCell>{member.email}</TableCell>
                        <TableCell>
                          <Select
                            defaultValue={member.role}
                            onValueChange={(value) =>
                              handleChangeRole(
                                member.id,
                                value as "admin" | "user",
                              )
                            }
                          >
                            <SelectTrigger className="w-[110px]">
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="user">User</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          {new Date(member.joinedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm">
                                <UserMinus className="h-4 w-4 mr-1" />
                                Kick
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Remove Member
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to remove{" "}
                                  {member.username} from the group? This action
                                  cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleRemoveMember(member.id)}
                                >
                                  Remove
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Invites & Requests Section */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Ticket className="h-5 w-5" />
          <h2 className="text-2xl font-semibold">Invites & Requests</h2>
        </div>

        {/* Invite Manager */}
        <Card className="mb-6 animate-fade-in">
          <CardHeader>
            <CardTitle>Invite Codes</CardTitle>
            <CardDescription>
              Generate and manage invite codes for new members
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="max-uses">Max Uses (Optional)</Label>
                  <Input
                    id="max-uses"
                    type="number"
                    placeholder="Unlimited"
                    value={newInvite.maxUses}
                    onChange={(e) =>
                      setNewInvite((prev) => ({
                        ...prev,
                        maxUses: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="expires-at">Expiry Date (Optional)</Label>
                  <Input
                    id="expires-at"
                    type="date"
                    placeholder="Never expires"
                    value={newInvite.expiresAt}
                    onChange={(e) =>
                      setNewInvite((prev) => ({
                        ...prev,
                        expiresAt: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <Button onClick={handleCreateInvite}>
                Generate New Invite Code
              </Button>

              <Separator />

              {invites.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-500">
                    No invite codes generated yet.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Code</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Expires</TableHead>
                        <TableHead>Uses</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invites.map((invite) => (
                        <TableRow key={invite.code}>
                          <TableCell className="font-mono font-medium">
                            {invite.code}
                          </TableCell>
                          <TableCell>
                            {new Date(invite.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {invite.expiresAt
                              ? new Date(invite.expiresAt).toLocaleDateString()
                              : "Never"}
                          </TableCell>
                          <TableCell>
                            {invite.usedCount}
                            {invite.maxUses ? `/${invite.maxUses}` : ""}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copyInviteCode(invite.code)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="destructive" size="sm">
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Revoke Invite Code
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to revoke this
                                      invite code? Anyone with this code will no
                                      longer be able to join the group.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        handleRevokeInvite(invite.code)
                                      }
                                    >
                                      Revoke
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Join Requests */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Join Requests</CardTitle>
            <CardDescription>
              Approve or deny requests to join the group
            </CardDescription>
          </CardHeader>
          <CardContent>
            {joinRequests.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No pending join requests.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {joinRequests.map((request) => (
                  <Card key={request.id} className="bg-gray-50">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">
                            {request.username}
                          </CardTitle>
                          <CardDescription>{request.email}</CardDescription>
                        </div>
                        <Badge variant="outline">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(request.requestedAt).toLocaleDateString()}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      {request.message ? (
                        <p className="text-sm">{request.message}</p>
                      ) : (
                        <p className="text-sm text-gray-500 italic">
                          No message provided
                        </p>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDenyRequest(request.id)}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Deny
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleApproveRequest(request.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Settings Section */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="h-5 w-5" />
          <h2 className="text-2xl font-semibold">Settings</h2>
        </div>
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Group Settings</CardTitle>
            <CardDescription>
              Configure group visibility and access settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="visibility">Group Visibility</Label>
              <Select
                value={group.visibility}
                onValueChange={(value) =>
                  handleUpdateSettings("visibility", value)
                }
              >
                <SelectTrigger id="visibility" className="w-full">
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-2" />
                      <div>
                        <span>Public</span>
                        <p className="text-xs text-gray-500">
                          Visible to everyone
                        </p>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="unlisted">
                    <div className="flex items-center">
                      <EyeOff className="h-4 w-4 mr-2" />
                      <div>
                        <span>Unlisted</span>
                        <p className="text-xs text-gray-500">
                          Only visible with direct link
                        </p>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="private">
                    <div className="flex items-center">
                      <Lock className="h-4 w-4 mr-2" />
                      <div>
                        <span>Private</span>
                        <p className="text-xs text-gray-500">
                          Only visible to members
                        </p>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="join-method">Join Method</Label>
              <Select
                value={group.joinMethod}
                onValueChange={(value) =>
                  handleUpdateSettings("joinMethod", value)
                }
              >
                <SelectTrigger id="join-method" className="w-full">
                  <SelectValue placeholder="Select join method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">
                    <div className="flex items-center">
                      <Unlock className="h-4 w-4 mr-2" />
                      <div>
                        <span>Open</span>
                        <p className="text-xs text-gray-500">Anyone can join</p>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="request">
                    <div className="flex items-center">
                      <UserPlus className="h-4 w-4 mr-2" />
                      <div>
                        <span>Request</span>
                        <p className="text-xs text-gray-500">
                          Users must request to join
                        </p>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="invite_only">
                    <div className="flex items-center">
                      <Ticket className="h-4 w-4 mr-2" />
                      <div>
                        <span>Invite Only</span>
                        <p className="text-xs text-gray-500">
                          Users must have an invite code
                        </p>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium text-red-600 mb-2">
                Danger Zone
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Permanently delete this group and all of its data. This action
                cannot be undone.
              </p>

              <Dialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
              >
                <DialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash className="h-4 w-4 mr-2" />
                    Delete Group
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Group</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently delete
                      the group and remove all members, invites, and data.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                    <p className="text-sm font-medium">
                      To confirm, type <span className="font-bold">DELETE</span>{" "}
                      below:
                    </p>
                    <Input
                      value={deleteConfirmation}
                      onChange={(e) => setDeleteConfirmation(e.target.value)}
                      placeholder="Type DELETE to confirm"
                    />
                  </div>

                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setShowDeleteDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDeleteGroup}
                      disabled={deleteConfirmation !== "DELETE"}
                    >
                      Delete Permanently
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
