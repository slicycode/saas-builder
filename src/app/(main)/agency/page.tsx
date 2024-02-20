import AgencyDetails from "@/components/forms/agency-details";
import { getAuthUserDetails, verifyAndAcceptInvitation } from "@/libs/queries";
import { currentUser } from "@clerk/nextjs";
import { Plan } from "@prisma/client";
import { redirect } from "next/navigation";

const Page = async ({
  searchParams,
}: {
  searchParams: { plan: Plan; state: string; code: string };
}) => {
  const agencyId = await verifyAndAcceptInvitation();

  const user = await getAuthUserDetails();

  if (agencyId) {
    if (user?.role === "SUBACCOUNT_GUEST" || user?.role === "SUBACCOUNT_USER") {
      return redirect("/subaccount");
    } else if (user?.role === "AGENCY_ADMIN" || user?.role === "AGENCY_OWNER") {
      if (searchParams.plan)
        return redirect(`/agency/${agencyId}/billing?=${searchParams.plan}`);

      if (searchParams.state) {
        const statePath = searchParams.state.split("__")[0];
        const stateAgencyId = searchParams.state.split("___")[1];

        if (!stateAgencyId) return <div>Not authorized</div>;

        return redirect(
          `/agency/${stateAgencyId}/${statePath}?code=${searchParams.code}`,
        );
      } else return redirect(`/agency/${agencyId}`);
    } else return <div>Not authorized</div>;
  }

  const authUser = await currentUser();

  return (
    <div className="mt-4 flex items-center justify-center">
      <div className="max-w-[850px] rounded-xl border-[1px] p-4">
        <h1 className="mb-3 text-4xl">Create An Agency</h1>
        <AgencyDetails
          data={{ companyEmail: authUser?.emailAddresses[0].emailAddress }}
        />
      </div>
    </div>
  );
};

export default Page;
