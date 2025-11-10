import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { User } from "@/lib/types"

interface UserAvatarProps {
  user: User | null
}

export function UserAvatar({ user }: UserAvatarProps) {
  const getInitials = (name: string) => {
    const names = name.split(" ")
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  return (
    <Avatar className="h-9 w-9">
      <AvatarImage src={user?.avatar} alt={user?.name} />
      <AvatarFallback>{user ? getInitials(user.name) : "U"}</AvatarFallback>
    </Avatar>
  )
}
