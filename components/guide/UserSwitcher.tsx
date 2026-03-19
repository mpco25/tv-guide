import type { UserOption } from "@/lib/types/user";
import styles from "./UserSwitcher.module.css";

type UserSwitcherProps = {
  selectedUserId: string;
  users: UserOption[];
  onChange: (userId: string) => void;
};

export function UserSwitcher({
  selectedUserId,
  users,
  onChange
}: UserSwitcherProps) {
  return (
    <div className={styles.wrap}>
      <label className={styles.label} htmlFor="user-switcher">
        Viewer
      </label>
      <select
        id="user-switcher"
        className={styles.select}
        value={selectedUserId}
        onChange={(event) => onChange(event.target.value)}
      >
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>
    </div>
  );
}
