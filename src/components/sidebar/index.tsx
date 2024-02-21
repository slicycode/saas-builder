import { getAuthUserDetails } from "@/libs/queries";
import MenuOptions from "./menu-options";

type SidebarProps = {
  id: string;
  type: "agency" | "subaccount";
};

const Sidebar = async ({ id, type }: SidebarProps) => {
  const user = await getAuthUserDetails();

  if (!user) return null;
  if (!user.Agency) return;

  const details =
    type === "agency"
      ? user?.Agency
      : user?.Agency?.SubAccount?.find((sub) => sub.id === id);

  const isWhiteLabeledAgency = user?.Agency?.whiteLabel;

  if (!details) return;

  let sidebarLogo = user.Agency.agencyLogo || "/assets/plura-logo.svg";

  if (!isWhiteLabeledAgency) {
    if (type === "subaccount") {
      sidebarLogo =
        user.Agency.SubAccount.find((sub) => sub.id === id)?.subAccountLogo ||
        user.Agency.agencyLogo;
    }
  }

  const sidebarOptions =
    type === "agency"
      ? user.Agency.SidebarOption || []
      : user.Agency.SubAccount.find((sub) => sub.id === id)?.SidebarOption ||
        [];

  const subaccounts = user.Agency.SubAccount.filter((sub) =>
    user.Permissions.find((p) => p.subAccountId === sub.id && p.access),
  );

  return (
    <>
      <MenuOptions
        defaultOpen
        details={details}
        id={id}
        sidebarLogo={sidebarLogo}
        sidebarOptions={sidebarOptions}
        subAccounts={subaccounts}
        user={user}
      />
      <MenuOptions
        details={details}
        id={id}
        sidebarLogo={sidebarLogo}
        sidebarOptions={sidebarOptions}
        subAccounts={subaccounts}
        user={user}
      />
    </>
  );
};

export default Sidebar;
