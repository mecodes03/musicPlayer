import UserDropdownMenu from "./UserDropdownMenu";
import { GoogleUser, SpotifyUser } from "@/types/user";

const UserAvatar = ({
  user,
}: {
  user: { spotify: SpotifyUser | null; google: GoogleUser | null };
}) => {
  return <UserDropdownMenu user={user} />;
};

export { UserAvatar };
