import { Users, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

type ChatUser = {
  id: string;
  name: string;
  username: string;
  avatar: string;
  isAdmin?: boolean;
  isOnline?: boolean;
};

interface UserListProps {
  users: ChatUser[];
  currentUser: ChatUser;
  onPromoteUser: (userId: string) => void;
  onKickUser: (userId: string) => void;
  isAdmin: boolean;
}

const UserList: React.FC<UserListProps> = ({
  users,
  currentUser,
  onPromoteUser,
  onKickUser,
  isAdmin,
}) => {
  return (
    <div className="space-y-3">
      {users.map((user) => {
        const isCurrentUserItem = user.id === currentUser.id;
        const canManageUser = isAdmin && !isCurrentUserItem;

        return (
          <div
            key={user.id}
            className={`flex items-center justify-between p-2 rounded-md transition-colors ${
              isCurrentUserItem ? "bg-[#EBFFF5]" : "hover:bg-[#EBFFF5]/50"
            }`}
          >
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback 
                  className={`font-medium ${
                    isCurrentUserItem 
                      ? "bg-[#CFECE0] text-[#7CAE9E]" 
                      : "bg-[#F8E8E9] text-[#E69EA2]"
                  }`}
                >
                  {user.username[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-sm">{user.name}</span>
                  {isCurrentUserItem && (
                    <span className="text-xs text-[#7CAE9E]">(You)</span>
                  )}
                </div>

                {user.isAdmin && (
                  <Badge
                    variant="outline"
                    className="text-[#7CAE9E] border-[#CFECE0] text-[10px] py-0 h-4"
                  >
                    Admin
                  </Badge>
                )}
              </div>
            </div>

            {canManageUser && (
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-2 h-7 text-xs bg-[#EBFFF5] text-[#7CAE9E] hover:bg-[#EBFFF5]/80 hover:text-[#7CAE9E] border-[#CFECE0]"
                  onClick={() => onPromoteUser(user.id)}
                >
                  Make Admin
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs bg-[#F8E8E9] text-[#E69EA2] hover:bg-[#F8E8E9]/80 hover:text-[#E69EA2] border-[#FEC0B3]"
                  onClick={() => onKickUser(user.id)}
                >
                  Kick
                </Button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

interface MembersListProps {
  users: ChatUser[];
  currentUser: ChatUser;
  onPromoteUser: (userId: string) => void;
  onKickUser: (userId: string) => void;
  isAdmin: boolean;
  adminUser?: ChatUser;
}

export const MembersList: React.FC<MembersListProps> = ({
  users,
  currentUser,
  onPromoteUser,
  onKickUser,
  isAdmin,
  adminUser,
}) => {
  const navigate = useNavigate();

  return (
<Card className="border-[#CFECE0] md:col-span-1 w-full md:w-[107%] mr-70">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-[#7CAE9E] text-base">Members</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-[#7CAE9E]"
            onClick={() => navigate("/chatroom")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </div>
        {adminUser && (
          <div className="flex items-center gap-2 mt-2 p-2 bg-[#EBFFF5] rounded-md">
            <Users className="h-4 w-4 text-[#7CAE9E]" />
            <span className="text-sm text-[#7CAE9E]">
              Room Admin: {adminUser.name}
            </span>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-3">
        <UserList
          users={users}
          currentUser={currentUser}
          onPromoteUser={onPromoteUser}
          onKickUser={onKickUser}
          isAdmin={isAdmin}
        />
      </CardContent>
    </Card>
  );
};