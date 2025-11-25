import { getRoles } from "@/app/api/roles/route";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import UserForm from "@/components/Users/UserForm";

export default async function AddEditUserPage() {
  const roles = await getRoles();

  return (
    <>
      <Breadcrumb pageName="Add Edit User" />
      <ShowcaseSection title="Input Fields" className="space-y-5.5 !p-6.5">
        <UserForm roles={roles} />
      </ShowcaseSection>
    </>
  );
}
